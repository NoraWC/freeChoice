var RESULT_ARRAY = [];

function clearAll() {
    $('#hi').html("");
    RESULT_ARRAY=[];
    $('#warning').html("");
}

function go(questions, category, difficulty, multi) {

    var num = "amount=";
    if(questions > 0 || questions <= 50) {
        num += questions.toString();
    } else {
        num += "1";
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
            } else {
                $('#warning').html("Could not find enough questions in that category! Try another level or another category if nothing appears.");

                go(questions-1, category, difficulty, multi);
            }

        },
        error: function () {
            alert('Failed!');
        }
    });
}


function setUp(resultArray) {
    var htm = "";
    for(var i = 0; i < resultArray.length; i++) {
        htm += "<tr id = 'row"+i+"'><td>"+resultArray[i].difficulty+"</td><td>"+resultArray[i].category+"</td><td>";
        htm += resultArray[i].question+"</td><td id = 'actually"+i+"'></td><td><form>";
        var answers = [];

        answers = answers.concat(resultArray[i].incorrect_answers);

        var pos = Math.floor(Math.random() * answers.length);

        answers.splice(pos, 0, resultArray[i].correct_answer);

        for(var x = 0; x < answers.length; x ++) {
            if(x === pos) {
                htm += "<input type = 'radio' class = 'rightanswer' name = 'choice"+i+"' value = 'answer"+x+">"
            } else {
                htm += "<input type = 'radio'  class = 'wronganswer' name = 'choice"+i+"' value = 'answer"+x+">";
            }

            htm += "<label for = 'answer"+x+"'>"+answers[x]+"</label>";
        }
        htm += "</form></tr>";
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
                    console.log(i+'correct');

                } else {
                    document.getElementById('row'+i).className = 'incorrect';
                    console.log(i+'incorrect');
                    $('#actually'+i).html('Sorry, but you should have picked '+RESULT_ARRAY[i].correct_answer);
                }
            }
        }
    }
}