var TRIES = 0;
function go(questions, category, difficulty, multi) {

    var num = "amount="+questions;

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

    console.log("https://opentdb.com/api.php?amount=10&category=11&difficulty=medium&type=multiple");
    console.log("https://opentdb.com/api.php?"+num+cat+dif+typ);
    console.log(category, num, cat, dif, typ);

    $.ajax({
        url: 'https://opentdb.com/api.php?'+num+cat+dif+typ,
        type: 'GET',
        crossDomain: true,
        //dataType: 'jsonp',

        success: function (result) {
            if(result.response_code !== 1) {
                console.log(result.results);
                setUp(result.results);
            } else {
                if(TRIES<=0) {
                    alert("Could not find enough questions in that category! Trying fewer...");
                    TRIES++;
                }
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
        htm += "<tr><td>"+resultArray[i].difficulty+"</td><td>"+resultArray[i].category+"</td><td>";
        htm += resultArray[i].question+"</td><td><form>";
        var answers = [];
        answers = answers.concat(resultArray[i].incorrect_answers);
        var pos = Math.floor(Math.random() * answers.length-1);
        answers.splice(pos, 0, resultArray[i].correct_answer);
        for(var x = 0; x < answers.length; x ++) {

            htm += "<input type = 'radio' name = 'choice' id ='answer"+x+"' value = 'answer"+x+">";
            htm += "<label for = 'answer"+x+"'>"+answers[x]+"</label>";
        }
        htm += "</tr>";
    }
    $('#hi').html(htm);
}
