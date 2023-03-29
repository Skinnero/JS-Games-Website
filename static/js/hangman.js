let startButton = document.getElementById('start')
startButton.addEventListener('click', main)
const INVALID_KEYSTROKES = ['CapsLock', 'Shift','Backspace', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Control', ' ', 'TAB'
]
let word = document.getElementsByTagName('h1')[0]
const HANGMAN_WORDS = ['absence makes the heart grow fonder', 'a journey of a thousand miles begins with a single step',
'all good things must come to an end', 'beggars can not be choosers', 'many hands make light work', 'strike while the iron is hot',
'the grass is always greener on the other side of the fence', 'beauty is in the eye of the beholder', 'it is better to be safe than sorry'
]
let wordInGame = undefined
let guessedLetters = []
let lives = 5
let guessedProverbs = 0

function main() {
    document.getElementById('save').hidden = true
    document.getElementById('proceed').hidden = true
    wordInGame = getRandomProverb()
    startButton.hidden = true
    document.getElementsByTagName('p')[0].hidden = true
    word.innerHTML = ''
    getEmptySpacesForWord()
    window.addEventListener('keydown', keyListener)
    updateLives() 
    updateGuessedLetters()
}

function resetGame() {
    wordInGame = getRandomProverb()
    guessedLetters = []
    lives = 5
    updateLives() 
    updateGuessedLetters()
}

function getRandomProverb() {
    let randomNumber = Math.floor(Math.random() * HANGMAN_WORDS.length)
    return HANGMAN_WORDS[randomNumber].toUpperCase().split('')
}

function updateLives(){
    let livesSpan = document.getElementById('player-life')
    livesSpan.innerText = `Guesses left: ${lives}`
}

function updateGuessedLetters() {
    let playerGuessedLetter = document.getElementById('player-letters')
    playerGuessedLetter.innerText = `Guessed letters: ${guessedLetters}`
}

function getEmptySpacesForWord() {
    for (let i = 0; i < wordInGame.length; i++) {
        assignIdToLetter(i)
    }
}
function showLetter(index, letter) {
    let indexLetter = document.getElementById(index.toString())
    indexLetter.innerText = `${letter} `
}

function assignIdToLetter(index) {
    let letter = document.createElement('span')
    if (wordInGame[index] === ' '){
        letter.setAttribute('id',index)
        letter.innerText = '  '
        word.appendChild(letter)
        return
    }
    letter.setAttribute('id',index)
    letter.innerText = '_ '
    word.appendChild(letter)
}

function checkCorrectKeystroke(key) {
    if (wordInGame.includes(key.toUpperCase())){
        for (index in wordInGame){
            if (key.toUpperCase() === wordInGame[index]){
                showLetter(index, wordInGame[index])
            }
        }
    } else if (!guessedLetters.includes(key.toUpperCase())){
        guessedLetters.push(key.toUpperCase())
        lives --
    }
}

function checkLoseCondition() {
    if (lives === 0){
        word.innerHTML = 'You lost all your lives :('
        startButton.hidden = false
        document.getElementById('save').hidden = false
        startButton.setAttribute('onclick','resetGame()')
        startButton.innerText = 'Reset'
        return true
    }
}

function proceedGame() {
    HANGMAN_WORDS.splice(HANGMAN_WORDS.indexOf(wordInGame.join('').toLowerCase()),1)
    guessedProverbs ++
    document.getElementById('player-words').innerText = `Guessed proverbs: ${guessedProverbs}`
    main()
}

function gameWon() {
    document.getElementById('save').hidden = false
    document.getElementById('proceed').hidden = false
    word.innerHTML = 'Congratulations, You guessed it!'
}

function checkWinCondition() {
    for (index in wordInGame){
        let letter = document.getElementById(index.toString())
        if (letter.innerText.includes('_')){
            return
        }
    }
    gameWon()
}

function keyListener(keyEvent){
    if (!INVALID_KEYSTROKES.includes(keyEvent.key)){
        checkCorrectKeystroke(keyEvent.key)
        updateLives()
        updateGuessedLetters()
        if (checkLoseCondition()){ 
            window.removeEventListener('keydown', keyListener) 
            return
        }
        checkWinCondition()
    }
}

function saveData() {
    let name = prompt('Enter your nickname:')
    let score = guessedProverbs * 10 + lives 
    let data = {user_name: name, game_name: 'hangman', score: score}
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    window.location = '/hall-of-fame'
}