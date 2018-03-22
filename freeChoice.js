//total correct answers in a session
var SCORE = 0;
//all questions attempted so far
var QS_SO_FAR = 0;

function clearAll() {
    //resets all displayed values
    $('#cat-dif').html("");
    $('.container').className = 'secret';
    $('#warning').html("");
    $('#result').html("");
    document.getElementById('result').className = 'secret';
}

function go(questions, category, difficulty, multi) {
    console.log(difficulty);
    //takes the number of questions from the html form (if they didn't enter any, defaults to 5
    var num = "amount=";
    questions = parseInt(questions);
    if(questions !== undefined && questions !== NaN && questions > 0 && questions <= 50) {
        //surprisingly, I really do need to check for all of this
        num += questions.toString();
    } else {
        $('#warning').html("That's an invalid number of questions! You get 5 instead.");
        num += "5";
    }

    //takes the category selected (the list of categories in the API starts at 8, so it adds 8 to the index)
    //defaults to 0 (aka 8), general knowledge
    var cat = "";
    if (category !== 8) {
        cat = '&category='+ category.toString();
    }

    //array of difficulties; chooses one based on the level chosen by the user
    var arr= ["easy","medium","hard"];
    var dif = '&difficulty='+arr[difficulty];

    //designates either multiple choice or boolean depending on the chosen value; default boolean
    var typ = '&type=';
    if(multi){
        typ += 'multiple';
    } else {
        typ += 'boolean';
    }

    $.ajax({
        url: 'https://opentdb.com/api.php?'+num+cat+dif+typ,
        type: 'GET',
        crossDomain: true,

        success: function (result) {
            if(result.response_code !== 1) {
                setUp(result.results, category);
            } else if (questions > 1) {
                //if there aren't enough questions, display error message and try with fewer questions
                clearAll();
                if (questions !== 0) {
                    $('#warning').html("Not enough questions were found! You may receive fewer questions than you asked for.");
                    go(questions-1, category, difficulty, multi);
                } else {
                    //if all else fails, tell the player
                    $('#warning').html("Not enough questions were found! Please try another category.");
                }
            }

        },
        error: function () {
            alert('Failed!');
        }
    });
}

function setUp(resultArray, category) {
    if(category === 0 || category === undefined) {
        category = 9;
    } else {
        category += 8;
    }

    //capitalizes first letter of the difficulty level to make it look nicer
    console.log(resultArray);
    var diff = resultArray[0].difficulty[0].toUpperCase() + resultArray[0].difficulty.slice(1,resultArray[0].difficulty.length);

    $('#cat-dif').html(diff + " " +$('#'+category).html());

    var fin = "";

    for (var i = 0; i < resultArray.length; i++) {
        //creates set of divs to hold info; each one after the first is invisible
        if(i > 0) {
            fin += "<div class = 'secret' id = 'contain" + i + "'>Question "+(i+1)+" of "+resultArray.length+": ";
        } else {
            fin += "<div class = 'container' id = 'contain" + i + "'>Question "+(i+1)+" of "+resultArray.length+": ";
        }
        //the trivia question
        fin += "<span class = 'question' id = 'quest"+i+"'>"+resultArray[i].question+"</span>";
        //area for the choice options
        fin += "<br><span id = 'choices"+i+"'>";

        //array to hold all answer choices (optimized so both 2-choice and 4-choice questions go through)
        var answers = resultArray[i].incorrect_answers;

        //gets a random position....
        var pos = Math.floor(Math.random() * answers.length);

        //and inserts the right answer into the array at that position
        answers.splice(pos, 0, resultArray[i].correct_answer);

        for(var x = 0; x < answers.length; x ++) {
            //creates a radio button for each answer with the correct class:
            if(x === pos) {
                //rightanswer for the right answer (plus an id so I can use it to grab the right answer in moveOn())
                fin += "<input type = 'radio' class = 'rightanswer' id = 'right"+i+"' name = 'choice"+i;
            } else {
                //wronganswer for the wrong answer
                fin += "<input type = 'radio' class = 'wronganswer' name = 'choice"+i;
            }
            //moves to the verification function on click
            fin += "' onclick = 'moveOn("+i+", "+resultArray.length+")' value = '"+answers[x]+"'><label for = 'choice"+x+"'>"+answers[x]+"</label><br>";
            //labels the choice with the relevant option text
        }
        fin += "</span></div>";
    }
    $('#display').html(fin);
}

function moveOn(i, length) {

    //1 more than the element we're on ( allows the function to show the next element)
    var next = i+1;

    //hides current/previous question
    $('#contain'+i).hide();

    // list of the choice radio buttons for this question
    var choiceArr = document.getElementsByName('choice'+i);

    for(var x = 0; x < choiceArr.length; x ++) {
        //if the current option was selected (in order to minimize unnecessary iteration)
        if(choiceArr[x].checked) {
            //if they got it right,
            if(choiceArr[x].className === 'rightanswer') {
                //display a win message
                document.getElementById('result').className = 'correct';
                $('#result').html('Question ' + next + ' of '+ length+': '+$('#quest'+i).html() + '<br> Correct! You chose ' +choiceArr[x].value);
                //increment global var SCORE (stays the same throughout a session)
                SCORE ++;
            //if not
            } else {
                //display a lose message with the correct answer
                document.getElementById('result').className = 'incorrect';
                var rightAns = document.getElementById('right'+i).value;
                $('#result').html('Question ' + next + ' of '+ length+': '+$('#quest'+i).html() + '<br> Sorry! You picked '+choiceArr[x].value+' but you should have picked '+rightAns+'.');
            }
        }
    }
    //increments total question count
    QS_SO_FAR ++;

    //updates total score
    $('#score').html("Score: "+SCORE + "/"+QS_SO_FAR);
    var percentScore = ((SCORE/QS_SO_FAR)*100).toFixed();

    $('#data').html("Your grade so far is "+percentScore+"% out of "+QS_SO_FAR+" questions.");

    if (next < length) {
        //shows the next element
        document.getElementById('contain'+next).classList.remove('secret');
        document.getElementById('contain'+next).classList.add('container');
    } else {
        //displays final message
        if (percentScore > 50) {
            $('#warning').html("Game over! You got "+percentScore+"% of questions correct. Good job! Click 'Play' below to play again!");
        } else {
            $('#warning').html("Game over! You got "+percentScore+"% of questions correct. Better luck next time! Click 'Play' below to play again!");
        }
    }
}