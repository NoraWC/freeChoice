var ARRAY =[];
function clearAll() {
    $('#hi').html("");
    $('#warning').html("");
}
var FIRST_QS = 0;
function go(questions, category, difficulty, multi) {

    var num = "amount=";
    if(questions > 0 || questions <= 50) {
        num += questions.toString();
        if(FIRST_QS === 0) {
            FIRST_QS = questions;
        }
    } else {
        num += "5";
    }


    var cat = "";
    if (category !== 8) {
        cat = '&category='+ category.toString();
    }

    var arr= ["easy","medium","hard"];
    var dif = '&difficulty='+arr[difficulty];

    var typ = '&type=';
    if(multi){
        typ += 'multiple';
    } else {
        typ += 'boolean';
    }

    console.log(num, cat, dif, typ);

    $.ajax({
        url: 'https://opentdb.com/api.php?'+num+cat+dif+typ,
        type: 'GET',
        crossDomain: true,
        //dataType: 'jsonp',

        success: function (result) {
            if(result.response_code !== 1) {
                console.log(result.results);
                ARRAY = result.results;
                setUpTwo(result.results);
            } else if (questions > 1) {
                $('#warning').html("Not enough questions were found! You may have fewer questions or a different difficulty level.");
                go(questions-1, category, difficulty, multi);

            } else if (difficulty !== 0) {
                go(FIRST_QS, category, difficulty-1, multi);
            }

        },
        error: function () {
            alert('Failed!');
        }
    });
}

function setUpTwo(resultArray) {
    var category = parseInt(document.getElementById("category").selectedIndex);
    if(category === 0) {
        category = 9;
    } else {
        category += 8;
    }
    var fin = "<div id = 'cat-dif'>"+$('#'+category).html()+": "+resultArray[0].difficulty+"</div>";
    for (var i = 0; i < resultArray.length; i++) {
        fin += "<div class = 'container' id = 'contain"+i+"'><div class = 'question' id = 'quest"+i+"'>"+resultArray[i].question+"</div>";
        fin += "<div class = 'actually' id = 'act"+i+"'></div>";
        fin += "<div class = 'buttons' id = 'choices"+i+"'>";

        var answers = [];

        answers = answers.concat(resultArray[i].incorrect_answers);

        var pos = Math.floor(Math.random() * answers.length);

        answers.splice(pos, 0, resultArray[i].correct_answer);

        var choices = "";
        for(var x = 0; x < answers.length; x ++) {

            if(x === pos) {
                choices += "<input type = 'radio' class = 'rightanswer' id = 'choice"+i+"' name = 'choice"+i+"' value = '"+answers[x]+"'>"
            } else {
                choices += "<input type = 'radio'  class = 'wronganswer' id = 'choice"+i+"' name = 'choice"+i+"' value = '"+answers[x]+"'>";
            }

            choices += "<span id = 'answer"+x+"'>"+answers[x]+"</span><br>";
        }
        fin += choices + "</div></div>";
    }
    $('#display').html(fin);
    $('#done').html("<button id = 'finished' onclick = 'triviaSubmit(ARRAY);'>Finished!</button>");
}

function setUp(resultArray) {
    var category = parseInt(document.getElementById("category").selectedIndex);
    if(category === 0) {
        category = 9;
    } else {
        category += 8;
    }
    var htm = "<div>Difficulty: "+resultArray[0].difficulty+" Category: "+document.getElementById(category).innerHTML+"</div>";
    for(var i = 0; i < resultArray.length; i++) {
        htm += "<tr id = 'row"+i+"'><td class = 'qs'>";
        htm += resultArray[i].question+"</td><td id = 'actually"+i+"'></td><td class = 'buttons' id = 'choices"+i+"'><form>";
        var answers = [];

        answers = answers.concat(resultArray[i].incorrect_answers);

        var pos = Math.floor(Math.random() * answers.length);

        answers.splice(pos, 0, resultArray[i].correct_answer);

        for(var x = 0; x < answers.length; x ++) {
            if(x === pos) {
                htm += "<input type = 'radio' class = 'rightanswer' id = 'choice"+i+"' name = 'choice"+i+"' value = 'answer"+x+">"
            } else {
                htm += "<input type = 'radio'  class = 'wronganswer' id = 'choice"+i+"' name = 'choice"+i+"' value = 'answer"+x+">";
            }

            htm += "<label for = 'answer"+x+"'>"+answers[x]+"</label><br>";
        }
        htm += "</form></td></tr>";
    }

    $('#hi').html(htm);
}

function triviaSubmit(resultArray) {
    for(var i = 0; i < resultArray.length; i++) {

        var choiceArr = document.getElementsByName('choice'+i); //the choice radio buttons

        for(var x = 0; x < choiceArr.length; x ++) {

            if(choiceArr[x].checked) {

                if(choiceArr[x].className === 'rightanswer') {
                    document.getElementById('contain'+i).className = 'correct';
                    $('#act'+i).html('Correct! You chose ' +resultArray[i].correct_answer);
                    $('#choices'+i).hide();
                } else {
                    document.getElementById('contain'+i).className = 'incorrect';
                    console.log(choiceArr[x]);
                    $('#act'+i).html('Sorry! You picked '+choiceArr[x].value+' but you should have picked '+resultArray[i].correct_answer);
                    $('#choices'+i).hide();
                }
            }
        }
    }
}