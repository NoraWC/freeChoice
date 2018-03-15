var RESULT_ARRAY = [];

function clearAll() {
    $('#hi').html("");
    RESULT_ARRAY=[];
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
                RESULT_ARRAY = result.results;
                console.log(RESULT_ARRAY);
                setUp(result.results);
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
    $('#done').html("<button id = 'finished' onclick = 'triviaSubmit();'>Finished!</button>");
    $('#hi').html(htm);
}

function triviaSubmit() {
    for(var i = 0; i < RESULT_ARRAY.length; i++) {

        var choiceArr = document.getElementsByName('choice'+i); //the choice radio buttons

        for(var x = 0; x < choiceArr.length; x ++) {

            if(choiceArr[x].checked) {

                if(choiceArr[x].className === 'rightanswer') {
                    document.getElementById('row'+i).className = 'correct';
                    $('#actually'+i).hide();
                } else {
                    document.getElementById('row'+i).className = 'incorrect';
                    $('#actually'+i).html('Sorry, but you should have picked '+RESULT_ARRAY[i].correct_answer);
                    $('#choices'+i).hide();
                }
            }
        }
    }
}