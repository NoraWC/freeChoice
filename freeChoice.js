function go() {

    //fails w/ boolean & easy on: 10; 13; 14; 16;;;;

    //fails w/ multiple choice & medium on: 30; 25; 13

    //fails w/ boolean & medium on: 10; 11; 13; 16; 19; 20; 21; 24; 25; 26; 27; 28; 29; 30; 31; 32 (!!!!)

    //response_code: 1 for anything generated here?
    var index = parseInt(document.getElementById("category").selectedIndex) + 8;
    var cat = "";
    if (index !== 8) {
        cat = '&category='+ index.toString();
    }
    var x = document.getElementById("difficulty").selectedIndex;
    var arr= ["easy","medium","hard"];
    var dif = '&difficulty='+arr[x];

    var typ = '&type=';
    if(document.getElementById("multiY").checked === true){
        typ += 'multiple';
    } else {
        typ += 'boolean';
    }

    console.log("https://opentdb.com/api.php?amount=10&category=11&difficulty=medium&type=multiple");
    console.log("https://opentdb.com/api.php?amount=10"+cat+dif+typ);
    console.log(index, cat, dif, typ);

    $.ajax({
        url: 'https://opentdb.com/api.php?amount=1'+cat+dif+typ,
        type: 'GET',
        crossDomain: true,
        //dataType: 'jsonp',

        success: function (result) {
            if(result.response_code !== 1) {
                console.log(result.results);
                setUp(result.results);
            } else {
                alert('There are no questions for that category! Try another.');
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
