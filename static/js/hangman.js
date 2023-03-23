let startButton = document.getElementById('start')
startButton.addEventListener('click', main)
// TODO: Saving score
const INVALID_KEYSTROKES = ['CapsLock', 'Shift','Backspace', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 
]
let word = document.getElementsByTagName('h1')[0]
const hangmanWords = ['Absence makes the heart grow fonder', 'A journey of a thousand miles begins with a single step',
'All good things must come to an end', 'Beggars cant be choosers'
]
let wordInGame = undefined
let guessedLetters = []
let lives = 5

function main() {
    resetGame()
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
}

function getRandomProverb() {
    let randomNumber = Math.floor(Math.random() * hangmanWords.length)
    return hangmanWords[randomNumber].toUpperCase().split('')
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
        startButton.innerText = 'Try Again!'
        return true
    }
}

function checkWinCondition() {
    for (index in wordInGame){
        let letter = document.getElementById(index.toString())
        if (letter.innerText.includes('_')){
            return
        }
    }
    word.innerHTML = 'Congratulations, You Won!'
    startButton.hidden = false
    startButton.innerText = 'Play Again!'
}

function keyListener(keyEvent){
    if (!INVALID_KEYSTROKES.includes(keyEvent.key)){
        checkCorrectKeystroke(keyEvent.key)
        updateLives()
        updateGuessedLetters()
        if (checkLoseCondition()){ window.removeEventListener('keydown', keyListener) }
        checkWinCondition()
    }
}