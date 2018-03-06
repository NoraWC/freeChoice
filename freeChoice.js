var CONSTANT = [];
function go() {
    var u = document.getElementById("category").selectedIndex + 8;
    var cat = "";
    if (u !== 8) {
        cat = '&category='+u;
    }
    var x = document.getElementById("difficulty").selectedIndex;
    var arr= ["easy","medium","hard"];
    var dif = '&difficulty='+arr[x];

    var typ = '&type=';
    if(document.getElementById("multiY").selected === true){
        typ += 'multiple';
    } else {
        typ += 'boolean';
    }

    $.ajax({
        url: 'https://opentdb.com/api.php?amount=50'+cat+dif+typ,
        type: 'GET',
        //crossDomain: true,
        //dataType: 'jsonp',

        success: function (result) {
            console.log(result.results);
            //CONSTANT = multiCheck(result.results);
        },
        error: function () {
            alert('Failed!');
        }
    });
}


/*
function multiCheck(arr) {
    //differentiates between multiple/true-false
    var multiArray = [];
    var singleArray = [];

    for (var y = 0; y < arr.length; y++) {
        console.log(arr[y]);
        if(arr[y].type === 'boolean') {
            singleArray.push(arr[y]);
        } else {
            multiArray.push(arr[y]);
        }
    }

    if(document.getElementById('multiY').selected === true) {
        console.log(multiArray);
        setUp(multiArray);
    } else {
        console.log(singleArray);
        setUp(singleArray);
    }
}

*/
function setUp(resultArray) {
    var htm = "";
    for(var i = 0; i < resultArray.length; i++) {
        htm += "<tr><td>"+resultArray[i].difficulty+"</td><td>"+resultArray[i].category+"</td><td>";
        htm += resultArray[i].question+"</td><td><form>";
        for(var x = 0; x < resultArray[i].incorrect_answers.length; x ++) {
            htm += "<input type = 'radio' name = 'choice' value = 'incorrect"+x+">";
        }
        htm += "<input type = 'radio' name = 'choice' value = 'correct'></form>";

        htm += "<td>Correct:"+resultArray[i].correct_answer+"</td><td>Incorrect:"+resultArray[i].incorrect_answers+"</td>";

        htm += "</tr>";
    }
    $('#hi').html(htm);
}
