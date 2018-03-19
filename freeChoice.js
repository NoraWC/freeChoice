var CORRECT_ANSWERS = 0;
function clearAll() {
    $('#hi').html("");
    $('#warning').html("");
    CORRECT_ANSWERS = 0;
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
        if(i > 0) {
            fin += "<div class = 'secret' id = 'contain" + i + "'>";
        } else {
            fin += "<div class = 'container' id = 'contain" + i + "'>";
        }
        fin += "<div class = 'question' id = 'quest"+i+"'>"+resultArray[i].question+"</div>";
        fin += "<div class = 'actually' id = 'act"+i+"'></div>";
        fin += "<div class = 'buttons' id = 'choices"+i+"'>";

        var answers = [];

        answers = answers.concat(resultArray[i].incorrect_answers);

        var pos = Math.floor(Math.random() * answers.length);

        answers.splice(pos, 0, resultArray[i].correct_answer);

        for(var x = 0; x < answers.length; x ++) {

            if(x === pos) {
                fin += "<input type = 'radio' class = 'rightanswer' id = 'right"+i+"' name = 'choice"+i+"' value = '"+answers[x]+"'>"
            } else {
                fin += "<input type = 'radio'  class = 'wronganswer' id = '"+x+"wrong"+i+"' name = 'choice"+i+"' value = '"+answers[x]+"'>";
            }

            fin += "<span id = 'answer"+x+"'>"+answers[x]+"</span><br>";
        }
        fin += "</div><button id = 'finished' onclick = 'moveOn("+i+", "+resultArray.length+");'>Finished!</button></div>";
    }

    $('#display').html(fin);
}

function moveOn(i, length) {
    //runs one too many times
    if( i < length) {
        var next = i+1;

        var choiceArr = document.getElementsByName('choice'+i); //the choice radio buttons

        for(var x = 0; x < choiceArr.length; x ++) {

            if(choiceArr[x].checked) {

                if(choiceArr[x].className === 'rightanswer') {
                    $('#result').className = 'correct';
                    CORRECT_ANSWERS++;
                    $('#result').html('Question ' + next + ' of '+ length+': '+$('#quest'+i).html() + ' Correct! You chose ' +choiceArr[x].value);

                } else {
                    $('#result').className = 'incorrect';
                    var rightAns = document.getElementById('right'+i).value;
                    $('#result').html('Question ' + next + ' of '+ length+': '+$('#quest'+i).html() + ' Sorry! You picked '+choiceArr[x].value+' but you should have picked '+rightAns+'.');
                }
            }
        }
        $('#contain'+i).hide();
        document.getElementById('score').innerHTML = "Score: "+CORRECT_ANSWERS + "/"+length;
        document.getElementById('contain'+next).classList.remove('secret');
        document.getElementById('contain'+next).classList.add('container');
    }

}