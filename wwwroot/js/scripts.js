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
