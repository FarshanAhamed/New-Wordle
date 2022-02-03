var pressed = false;
var over = false;
var letters = [], allWords = [], wordHash = [];
row = 0, col = 0;

document.addEventListener('keydown', keyPress);

function showToast(message, tone) {

    let options;

    if (tone === 'sad') {
        options = {
            style: {
                main: {
                    background: "#c00000c4",
                    color: "white",
                    'font-weight': 700,
                    opacity: 1,
                    'box-shadow': "rgb(0 0 0 / 50 %) 0px 0px 10px 0px"
                }
            },
            settings: {
                duration: 700,
            }
        };
    }
    else if (tone === 'happy') {
        options = {
            style: {
                main: {
                    background: "green",
                    color: "white",
                    'font-weight': 700,
                    opacity: 1,
                    'box-shadow': "rgb(0 0 0 / 50 %) 0px 0px 10px 0px"
                }
            },
            settings: {
                duration: 3000,
            }
        };
    }

    console.log(options);
    iqwerty.toast.toast(message, options);
}

function keyPress(e) {
    if (!pressed && !over) {
        pressed = true;
        var key = e.key;
        var code = e.keyCode;

        handleInput(code, key);
    }
}

function handleInput(code, key) {

    if (code == 13) {
        enterEvent();
    }
    else if (code >= 65 && code <= 90) {
        addLetter(key);

    } else if (code >= 97 && code <= 122) {
        addLetter(key);
    }
    else if (code == 8) {
        clearLastLetter();
    }
}

document.addEventListener("keyup", () => {
    pressed = false;
});

window.onload = function () {

    var lastSavedHash = JSON.parse(localStorage.getItem("wordHash"));
    if (lastSavedHash) {
        if (lastSavedHash.length === wordHash.length) {
            for (let i = 0; i < lastSavedHash.length; i++) {
                if (lastSavedHash[i] !== wordHash[i]) {
                    localStorage.setItem("wordHash", JSON.stringify(wordHash));
                    refreshDataset();
                    break;
                }
            }
        } else {
            localStorage.setItem("wordHash", JSON.stringify(wordHash));
            refreshDataset();
        }
    } else {
        localStorage.setItem("wordHash", JSON.stringify(wordHash));
        refreshDataset();
    }

    fetch('/words').then(response => response.json()).then(data => allWords = data);
    letters = JSON.parse(localStorage.getItem("letters"));

    if (!letters)
        letters = [];

    col = (letters.length - 1) % letterCount;
    //row = Math.floor(letters.length / letterCount);
    row = JSON.parse(localStorage.getItem("row"));
    if (!row)
        row = 0;

    loadLetters();
}



function addLetter(l) {
    if (row >= tryCount)
        return;

    let i = row;
    for (let j = 0; j < letterCount; j++) {
        let element = document.getElementById('i' + i + 'j' + j);
        if (!element.innerHTML) {
            element.innerHTML = l;
            letters.push({ char: l.toUpperCase(), color: 'default' });
            localStorage.setItem("letters", JSON.stringify(letters));
            col = (letters.length - 1) % letterCount;
            return;
        }
    }
}

function enterEvent() {
    if (row < tryCount) {
        if (col == (letterCount - 1)) {
            let lastElement = document.getElementById('i' + row + 'j' + (letterCount - 1));
            if (lastElement.innerHTML) {
                if (allWords.indexOf(getTypedWord(row).toLowerCase()) === -1) {
                    showToast('Invalid word!', "sad");
                    return;
                }

                matchAttempt();
                row++;
                localStorage.setItem("row", JSON.stringify(row));
            }
        }
    }
}

function getTypedWord(r) {
    let i = r, typedWord = '';

    for (let j = 0; j < letterCount; j++) {
        let element = document.getElementById('i' + i + 'j' + j);
        typedWord += element.innerHTML;
    }

    return typedWord;
}

function matchAttempt() {
    var greenCount = 0;
    for (let i = letters.length - letterCount, j = 0; i < letters.length; i++, j++) {
        let l = letters[i];
        let lHash = hashThis(l.char);
        console.log(l);
        console.log(lHash);
        let indexes = getAllIndexes(wordHash, lHash);
        if (!indexes || indexes.length === 0) {
            l.color = 'grey';
        }
        else if (indexes.indexOf(j) !== -1) {
            l.color = 'green';
            greenCount++;
        }
        else {
            l.color = 'orange';
        }
    }

    if (greenCount === letterCount) {
        over = true;
        showToast("Congratulations", "happy");
    }

    localStorage.setItem("letters", JSON.stringify(letters));
    loadLetters();
}


function loadLetters() {
    let v = 0;

    if (letters.length > 0) {
        for (let i = 0; i < tryCount; i++) {
            for (let j = 0; j < letterCount; j++) {
                let element = document.getElementById('i' + i + 'j' + j);
                if (v < letters.length) {
                    var l = letters[v++];
                    element.innerHTML = l.char;
                    element.classList.add(l.color);
                }
                else
                    element.innerHTML = null;
            }
        }
    }
}

function clearLastLetter() {
    if (row >= tryCount)
        return;

    let i = row;
    for (let j = (letterCount - 1); j >= 0; j--) {
        let element = document.getElementById('i' + i + 'j' + j);
        if (element.innerHTML) {
            element.innerHTML = null;
            letters.pop();
            localStorage.setItem("letters", JSON.stringify(letters));
            col = (letters.length - 1) % letterCount;
            return;
        }
    }
}

function hashThis(input) {
    let shaObj = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" });
    shaObj.update(input);
    const hashString = "0x" + shaObj.getHash("HEX");
    return hashString;
}

function getAllIndexes(arr, val) {
    var indexes = [], i;
    for (i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

function refreshDataset() {
    localStorage.removeItem("letters");
    localStorage.removeItem("row");

    over = false;
}

function refresh() {
    localStorage.clear();
    //window.location.reload();
    over = false;
    console.log(wordHash);
}

function onChange(input) {
}

function onKeyPress(key) {
    if (key === '{enter}')
        handleInput(13, '');
    else if (key === '{bksp}')
        handleInput(8, '');
    else
        handleInput(key.charCodeAt(0), key);
}

var deskKeyboardOptions = {
    layoutName: "shift",
    //excludeFromLayout: {
    //    shift: [".com", "{space}", "@@", "{shift}", ">", "<", "?", "\"", ":", "{lock}", "{tab}", "|", "}", "{",
    //    "~", "!", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+"]
    //},
    layout: {
        'default': [
            'q w e r t y u i o p',
            'a s d f g h j k l',
            'z x c v b n m',
            '{enter} {bksp}'
        ],
        'shift': [
            'Q W E R T Y U I O P',
            'A S D F G H J K L {enter}',
            'Z X C V B N M {bksp}'
        ]
    },
    display: {
        '{bksp}': 'DEL',
        '{enter}': 'ENTER'
    },
    disableButtonHold: false
};

var mobileKeyboardOptions = {
    layoutName: "shift",
    layout: {
        'default': [
            'q w e r t y u i o p',
            'a s d f g h j k l',
            'z x c v b n m',
            '{enter} {bksp}'
        ],
        'shift': [
            'Q W E R T Y U I O P',
            'A S D F G H J K L',
            'Z X C V B N M',
            '{enter} {bksp}'
        ]
    },
    display: {
        '{bksp}': 'DEL',
        '{enter}': 'ENTER'
    },
    disableButtonHold: false
};

