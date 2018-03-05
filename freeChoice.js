var CONSTANT = [];
function go() {
    $.ajax({
        url: 'https://opentdb.com/api.php?amount=30',
        type: 'GET',
        //crossDomain: true,
        //dataType: 'jsonp',


        success: function (result) {
            console.log(result.results);
            CONSTANT = sort(result.results);
        },
        error: function () {
            alert('Failed!');
        }
    });
}


function sort(resultArray) {
    //differentiates between difficulties

    var hardArray = [];
    var mediArray = [];
    var easyArray = [];

    //checks difficulty
    for (var x = 0; x < resultArray.length; x++) {
        if(resultArray[x].difficulty === "hard") {
            hardArray.push(resultArray[x]);
        } else if(resultArray[x].difficulty === "easy") {
            easyArray.push(resultArray[x]);
        } else {
            mediArray.push(resultArray[x]);
        }
    }
    
    //whatever array the player picked
    if(document.getElementById('hard').selected === true) {
        console.log(hardArray);
        multiCheck(hardArray);
    } else if (document.getElementById('medi').selected === true) {
        console.log(mediArray);
        multiCheck(mediArray);
    } else {
        console.log(easyArray);
        multiCheck(easyArray);
    }

}


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
