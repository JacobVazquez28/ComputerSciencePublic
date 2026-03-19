import bank from './wordBank.json' with {type: 'json'}

function getDifficulty() {
    makeDifficultyButton('easy');
    makeDifficultyButton('medium');
    makeDifficultyButton('hard');
}

function chooseWord(difficulty) {
    const list = bank[difficulty];
    generateBoard(list[Math.floor(Math.random() * (list.length))]);
}

/**
 * encodes word to dashes to be processed
 * @param {string} word word to encode 
 * @returns {list} dashes in a binary format to symbolize where dashes should be
 */
function encodeWord(word) {
    const raw = word.split('')
    const data = [];

    raw.forEach(letter => {
        if (letter.charCodeAt(0) === 32) {
            data.push(new LetterObject('space', document.createElement('div')))
        } else {
            data.push(new LetterObject(letter, document.createElement('div')))
        }
    });
    return data;
}

/**
 * checks the alphabet letter pressed against the word
 * @param {HTMLElement} pressed letter pressed
 */
function checkWord(pressed) {
    let correctGuess = false;
    data.forEach(elem => {
        if (pressed.target.textContent === elem.value) {
            elem.show();
            correctGuess = true;

            const checkEnd = [];
            data.forEach(letter => {
                checkEnd.push(letter.hidden)
                if (letter.hidden) {
                    return false
                }
            })
            if (!checkEnd.includes(true)) endGame(true);
        }
    })

    if (correctGuess) {
        pressed.target.classList.add('guessed-correct');
    } else {
        incrementMan();
        pressed.target.classList.add('guessed-incorrect');
    }
    
    pressed.target.removeEventListener('click', checkWord);
}

///adds body part to man depending on num incorrect
function incrementMan() {
    incorrect++;

    switch (incorrect) {
        case 1:
            //head
            ctx.arc(
                canvas.width * 0.306502,
                canvas.height * 0.0936329588 + canvas.height * 0.187265918 + canvas.width * 0.092879257, 
                canvas.width * 0.092879257, 
                0, 
                2 * Math.PI, false
            );
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#003300';
            ctx.stroke();
            break;
        case 2:
            //body
            ctx.fillRect(
                canvas.width * 0.30351,
                canvas.height * 0.0936329588 + canvas.height * 0.187265918 + (canvas.width * 0.092879257) * 2, 
                2, 
                canvas.height * 0.18727
            );
            break;
        case 3:
            //right arm
            ctx.moveTo(
                canvas.width * 0.216718, 
                canvas.height * 0.0936329588 + canvas.height * 0.187265918 + (canvas.width * 0.092879257) * 2 + canvas.height * 0.15
            );
            ctx.lineTo(
                canvas.width * 0.306502,
                canvas.height * 0.0936329588 + canvas.height * 0.187265918 + (canvas.width * 0.092879257) * 2 + canvas.height * 0.015
            );
            ctx.stroke();
            break;
        case 4:
            //left arm
            ctx.moveTo(
                canvas.width * 0.399281,
                canvas.height * 0.0936329588 + canvas.height * 0.187265918 + (canvas.width * 0.092879257) * 2 + canvas.height * 0.15
            );
            ctx.lineTo(
                canvas.width * 0.306501, 
                canvas.height * 0.0936329588 + canvas.height * 0.187265918 + (canvas.width * 0.092879257) * 2 + canvas.height * 0.015
            );
            ctx.stroke();
            break;
        case 5:
            //left leg
            ctx.moveTo(
                canvas.width * 0.399281, 
                canvas.height * 0.0936329588 + canvas.height * 0.187265918 + (canvas.width * 0.092879257) * 2 + canvas.height * 0.32 
            );
            ctx.lineTo(
                canvas.width * 0.306502, 
                canvas.height * 0.0936329588 + canvas.height * 0.187265918 + (canvas.width * 0.092879257) * 2 + canvas.height * 0.18
            );
            ctx.stroke();
            break;
        case 6:
            //right leg
            ctx.moveTo(
                canvas.width * 0.216718, 
                canvas.height * 0.0936329588 + canvas.height * 0.187265918 + (canvas.width * 0.092879257) * 2 + canvas.height * 0.32
            );
            ctx.lineTo(
                canvas.width * 0.306502, 
                canvas.height * 0.0936329588 + canvas.height * 0.187265918 + (canvas.width * 0.092879257) * 2 + canvas.height * 0.18
            );
            ctx.stroke();

            endGame(false);
            break;
    }
}

/**
 * ends the game with win or lose
 * @param {boolean} result whether player won or lost
 */
function endGame(result) {
    const letters = document.getElementsByClassName('letter')
    for (let i = 0; i < letters.length; i++) {
        const letter = letters.item(i);
        letter.removeEventListener('click', checkWord);
    }

    const end = document.createElement('div');
    end.id = 'game-end';
    end.className = 'container'
    end.textContent = `You ${result ? 'Win' : 'Lose'}`;

    const correct = document.createElement('div');
    correct.id = 'correct-word';
    data.forEach(letter => {
        correct.textContent = correct.textContent + (letter.value !== 'SPACE' ? letter.value : ' ');
    })
    correct.textContent = 'Correct: ' + correct.textContent;

    end.appendChild(correct);
    document.getElementById('dash-container').appendChild(end);
}

function generateBoard(word) {
    //remove difficulty buttons
    document.body.removeChild(document.getElementById('difficulty-button-container'));

    const container = document.createElement('div');
    container.className = 'container';
    container.id = 'main';
    document.body.appendChild(container);

    const top = document.createElement('div');
    top.className = 'container';
    top.id = 'top';
    container.appendChild(top);

    //make dashes
    const dashContainer = document.createElement('div');
    dashContainer.className = 'container';
    dashContainer.id = 'dash-container';
    top.appendChild(dashContainer);

    data = encodeWord(word);
    let wordContainer = document.createElement('div');
    wordContainer.className = 'container';
    wordContainer.id = 'word-container';
    data.forEach((object, i) => {
        if (data[i].value === 'SPACE') {
            dashContainer.appendChild(wordContainer);
            wordContainer = document.createElement('div');
            wordContainer.className = 'container';
            wordContainer.id = 'word-container';
        } else {
            wordContainer.appendChild(object.elem);
        }
    });
    dashContainer.appendChild(wordContainer);

    //make canvas
    const canvasContainer = document.createElement('div');
    canvasContainer.id = 'canvas-container';
    canvasContainer.className = 'container';
    top.appendChild(canvasContainer);

    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvasContainer.appendChild(canvas);
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
    ctx = canvas.getContext('2d');

    //making gallow
    ctx.fillStyle = 'black';
    ctx.fillRect( // central line
        canvas.width - canvas.width/2.5, 
        canvas.height * 0.187265918, 
        canvas.width * 0.013, 
        canvas.height * 0.655430712);
    ctx.fillRect( // bottom line
        canvas.width - canvas.width/2 - canvas.width * 0.2,
        canvas.height * 0.187265918 + canvas.height * 0.655430712, 
        canvas.width * 0.6, 
        canvas.width * 0.013
    );
    ctx.fillRect( // top line
        canvas.width - canvas.width/2 - canvas.width * 0.2,
        canvas.height * 0.187265918,
        canvas.width * 0.3,
        canvas.width * 0.013
    );
    ctx.fillRect( // noose
        canvas.width - canvas.width/2 - canvas.width * 0.2,
        canvas.height * 0.187265918,
        canvas.width * 0.013,
        canvas.height * 0.0936329588
    );

    //make alphabet
    const letterContainer = document.createElement('div');
    letterContainer.id = 'letter-container';
    letterContainer.className = 'container';
    document.getElementById('main').appendChild(letterContainer);

    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];

    letters.forEach(letter => {
        const letterElem = document.createElement('div');
        letterElem.id = letter;
        letterElem.textContent = letter;
        letterElem.className = 'letter';
        letterElem.addEventListener('click', checkWord);

        letterContainer.appendChild(letterElem);
    })
}

function start() {
    //making board
    getDifficulty();
}

/**
 * makes a difficulty button
 * @param {string} id difficulty for the button
 */
function makeDifficultyButton(id) {
    const button = document.createElement('div');
    button.className = 'difficulty-button';
    button.id = id;
    button.textContent = id;

    button.addEventListener('click', (() => {
        chooseWord(button.id);
    }));

    document.getElementById('difficulty-button-container').appendChild(button);
}

class LetterObject {
    constructor(value, elem) {
        this.value = value.toUpperCase();
        this.hidden = true;
        
        elem.className = 'dash';
        if (value !== 'space') {
            elem.id = 'dash-letter';
        } else this.hidden = false;

        this.elem = elem;
    }

    show() {
        this.elem.textContent = this.value;
        this.hidden = false;
    }
}

let data = null;
let ctx = null;
let incorrect = 0;

start();