var input = document.getElementById('guess'); // the input box
var button = document.getElementById('button'); // the button
var input_file = document.getElementById('inputfile'); // the input
var begin_button = document.getElementById('beginbutton'); // the button

var guess;
var known = [];
var cur_id = 1;

// change css class
var changeClass = function (cng, old, newClass) {
    cng.className = cng.className.replace(old, newClass);
};

// game loop
var gameloop = function () {
    // div init
    for (var i = 1; i <= 5; i++) {
        var in_div_row = document.createElement("div");
        in_div_row.id = 'row' + i;
        in_div_row.innerHTML = "<div class=\"square default\"></div><div class=\"square default\"></div><div class=\"square default\"></div><div class=\"square default\"></div><div class=\"square default\"></div>";
        document.getElementById('container').appendChild(in_div_row);
    }

    // pick a random word
    while (true) {
        var rand = woordenlijst[Math.floor(Math.random() * woordenlijst.length)].toUpperCase();
        if (!known.includes(rand)) {
            known.push(rand);
            break;
        }
        if (known.length === woordenlijst.length) {
            end("No more words to play", "Refresh to start over");
            return;
        }
    }

    var hasDuplicates = (/([a-zA-Z]).*?\1/).test(rand); // if multiple insances of a letter in the word

    var dup_dict = {};
    for (var i = 0; i <= rand.length - 1; i++) {
        if (Object.keys(dup_dict).includes(rand[i])) {
            dup_dict[rand[i]] = dup_dict[rand[i]] + 1;
        } else {
            dup_dict[rand[i]] = 1;
        }
    }

    var pressn = 1; // turn number

    // get all indexes of a given value in an array
    var getAllIndexes = function (arr, val) {
        var indexes = [], i;
        for (i = 0; i < arr.length; i++)
            if (arr[i] === val)
                indexes.push(i);
        return indexes;
    };

    // give first letter
    document.getElementById("row1").firstElementChild.innerHTML = rand[0];

    var guessed = [-1, -1, -1, -1, -1];

    // guess event
    input.onkeypress = function (event) {
        if (event.key === "Enter" || event.keyCode === 13) {
            document.getElementById('smallMsg').innerHTML = ""; // reset message
            guess = input.value.toUpperCase();
            input.value = ""; // clear input box
            var current = "row" + pressn;
            // current row
            var childDivs = document.getElementById(current).getElementsByTagName('div');
            var c = 0; // correct count

            // If not right number of letters
            if (guess.length !== 5) {
                document.getElementById('smallMsg').innerHTML = "Guesses must be 5 letters!";
                // if (pressn === 5) {
                //     end("Sorry, you lost.", "Correct word: " + rand);
                // }
                // pressn++;
                // document.getElementById(current).firstElementChild.innerHTML = rand[0];
                return; // move down
            }

            // check for correctness
            for (var i = 0; i < childDivs.length; i++) {
                childDivs[i].innerHTML = guess[i];

                // if letter match in right place
                if (guess[i] === rand[i]) {
                    changeClass(childDivs[i], 'default', 'correct');
                    c++;
                }
            }

            // check for wrong place
            var check_dup = {};
            for (var i = 0; i < childDivs.length; i++) {
                if (rand.indexOf(guess[i]) !== -1) {
                    if (!Object.keys(check_dup).includes(guess[i])) {
                        check_dup[guess[i]] = 1;
                    } else {
                        check_dup[guess[i]] = check_dup[guess[i]] + 1;
                    }

                    if (hasDuplicates === false && childDivs[rand.indexOf(guess[i])].className !== "square correct") {
                        changeClass(childDivs[i], 'default', 'wrongplace');
                    }
                    // if there are duplicate letters
                    else if (hasDuplicates === true) {
                        var ind = getAllIndexes(rand, guess[i]);
                        if (ind.length > 1) {
                            for (var j = 0; j < ind.length; j++) {
                                if (childDivs[ind[j]].className !== "square correct" && childDivs[i].className !== "square wrongplace" && Object.keys(dup_dict).includes(guess[i])) {
                                    if (check_dup[guess[i]] <= dup_dict[guess[i]]) {
                                        changeClass(childDivs[i], 'default', 'wrongplace');
                                    }
                                } //if
                            } //for
                        } //if
                        else if (childDivs[rand.indexOf(guess[i])].className !== "square correct" && Object.keys(dup_dict).includes(guess[i])) {
                            if (check_dup[guess[i]] <= dup_dict[guess[i]]) {
                                changeClass(childDivs[i], 'default', 'wrongplace');
                            }
                        } //else if
                    }
                } //else if
            }

            if (c === 5) { // if they have all the correct letters
                end("Correct!", "Next word?", pressn);
                return;
            }

            pressn++; // inc number of guesses

            if (pressn > 5) { // if they're out of tries
                document.getElementById('smallMsg').innerHTML = "Out of tries, other team's turn";
                var div_row = document.createElement("div");
                div_row.id = 'row' + pressn;
                div_row.innerHTML = "<div class=\"square default\"></div><div class=\"square default\"></div><div class=\"square default\"></div><div class=\"square default\"></div><div class=\"square default\"></div>";
                document.getElementById('container').appendChild(div_row);
                document.getElementById('row' + (pressn - 5)).remove();
            }

            for (var i = 0; i < 5; i++) {
                if (childDivs[i].className === "square correct") {
                    guessed[i] = 1;
                }
                if (guessed[i] === 1) {
                    if (pressn < 5) {
                        document.getElementById("row" + pressn).children[i].innerHTML = rand[i];
                    } else {
                        document.getElementById("row" + 5).children[i].innerHTML = rand[i];
                    }
                }
            }
        } //if (key = 'enter')
    } //input
}; //gameloop

// endgame
var end = function (msg, smallmsg, _cur_id) {
    document.getElementById('msgBox').innerHTML = msg;
    document.getElementById('smallMsg').innerHTML = smallmsg;
    changeClass(button, "invisible", "visible");
    document.getElementById('guess').readOnly = true;
    cur_id = _cur_id;
};

// reset
var playagain = function () {
    document.getElementById('msgBox').innerHTML = "Lingo"; // main message
    document.getElementById('smallMsg').innerHTML = "Guess the word"; // small message
    document.getElementById('guess').readOnly = false;
    changeClass(button, "visible", "invisible");

    // clean boxes
    if (cur_id > 5) {
        var begin = cur_id - 4;
    } else {
        var begin = 1;
    }
    for (var i = begin; i <= begin + 4; i++) {
        document.getElementById('row' + i).remove();
    } //for
    // restart the loop
    gameloop();
};

function begin() {
    changeClass(input_file, "visible", "invisible");
    changeClass(begin_button, "visible", "invisible");
    changeClass(input, "invisible", "visible");
    known = [];
    // start loop
    gameloop();
}


