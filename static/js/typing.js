document.getElementsByTagName('button')[0].addEventListener('click', main)
const INVALID_KEYSTROKES = ['CapsLock', 'Shift','Backspace', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Control'
]
let LIST_OF_WORDS = ['Abandon','Absence','Accomplish', 'Beautiful', 'Behavior', 'Celebration', 'Commercial', 'Environmental',
'Executive', 'Figure', 'Foreign', 'Generation', 'Government', 'Human', 'Individual', 'International', 'Knowledge', 'Management',
'Method', 'National', 'Newspaper', 'Opportunity', 'Participant', 'Relationship', 'Significant'
]
let maxTimeValue = null
let interval = null
let wordOnBoard = null
let playerLetters = []
let playerScore = 0

function resetValues() {
    LIST_OF_WORDS = ['Abandon','Absence','Accomplish', 'Beautiful', 'Behavior', 'Celebration', 'Commercial', 'Environmental',
    'Executive', 'Figure', 'Foreign', 'Generation', 'Government', 'Human', 'Individual', 'International', 'Knowledge', 'Management',
    'Method', 'National', 'Newspaper', 'Opportunity', 'Participant', 'Relationship', 'Significant'
    ]
    maxTimeValue = 60
    wordOnBoard = null
    playerLetters = []
    playerScore = 0
}

function setScoreText(gameDiv) {
    let scoreText = document.createElement('h1')
    scoreText.setAttribute('id','score')
    scoreText.innerText = 'Score: 0'
    gameDiv.appendChild(scoreText)
}

function setWordText(gameDiv) {
    let wordText = document.createElement('h2')
    wordText.setAttribute('id','word-text')
    gameDiv.appendChild(wordText)
    wordOnBoard = drawWord().split('')
}

function setGameDiv() {
    let currentDiv = document.getElementsByTagName('div')[0]
    currentDiv.innerHTML = ''
    setScoreText(currentDiv)
    setWordText(currentDiv)
    setTimer(currentDiv)
    setPlayerText(currentDiv)
}

function setPlayerText(gameDiv) {
    let playerInput = document.createElement('h2')
    playerInput.setAttribute('id', 'playerLetters')
    playerInput.innerHTML = `[${playerLetters}]`
    gameDiv.appendChild(playerInput)
}

function drawWord(){
    const randomNumber = Math.floor(Math.random() * (LIST_OF_WORDS.length - 1))
    const randomWord = LIST_OF_WORDS[randomNumber]
    document.getElementById('word-text').innerText = ''
    for (letter in randomWord){
        setLetterOnBoard(randomWord[letter], letter)
    }
    return randomWord
}

function setLetterOnBoard(letter, index) {
    let wordTag = document.getElementById('word-text')
    let newTag = document.createElement('span')
    newTag.innerText = letter
    newTag.setAttribute('id', index)
    wordTag.appendChild(newTag)
}

function setResultDiv(gameDiv) {
    gameDiv.innerHTML = ''
    createResultText(gameDiv)
    createNewGameButton(gameDiv)
    createSaveScoreButton(gameDiv)
    document.getElementsByTagName('button')[0].addEventListener('click', main)
    document.getElementsByTagName('button')[1].addEventListener('click', saveData)
}

function saveData() {
    let userName = prompt('Please enter you nickname')
    const data = {user_name: userName, game: 'typing', score: playerScore}
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

function createSaveScoreButton(gameDiv) {
    let link = document.createElement('a')
    link.setAttribute('href',"/")
    let saveButton = document.createElement('button')
    saveButton.innerText = 'Save Score!'
    saveButton.appendChild(link)
    gameDiv.appendChild(saveButton)
}
function createResultText(gameDiv) {
    let resultText = document.createElement('h1')
    resultText.innerText = `Congratulations you got ${playerScore} score!`
    gameDiv.appendChild(resultText)
}
function createNewGameButton(gameDiv) {
    let playButton = document.createElement('button')
    playButton.innerText = 'Play Again!'
    gameDiv.appendChild(playButton)
}

function setTimer(gameDiv){
    let timer = document.createElement('h3')
    timer.innerText = `Time left: ${maxTimeValue}`
    gameDiv.appendChild(timer)
    interval = setInterval(() => {
        maxTimeValue --
        timer.innerText = `Time left: ${maxTimeValue}`
        if (maxTimeValue === 0){
            clearInterval(interval)
            setResultDiv(gameDiv)
        }
    }, 1000);
}

function colorLetterGreen(index) {
    let letter = document.getElementById(index)
    letter.style = 'color: green;'
}
function colorLetterRed(index) {
    let letter = document.getElementById(index)
    letter.style = 'color: red;'
}
function colorLetterBasic(index) {
    let letter = document.getElementById(index)
    letter.style = 'color: white;'
}

function updatePlayerLetterOnBoard() {
    let playerInput = document.getElementById('playerLetters')
    let stringToDisplay = playerLetters.join('')
    playerInput.innerHTML = `[${stringToDisplay}]`
}

function checkCorrectTyping() {
    for (index in playerLetters){
        if (wordOnBoard[index] === playerLetters[index]){
            colorLetterGreen(index)
        } else {
            colorLetterRed(index)
        }
    }
}
function checkForCompleteWord() {
    return wordOnBoard.toString() === playerLetters.toString()
}

function updatePlayerPionts() {
    let score = document.getElementById('score')
    score.innerText = `Score: ${playerScore}`
}

function main() {
    resetValues()
    setGameDiv()
}

window.addEventListener('keydown', (event) =>{

    if (!INVALID_KEYSTROKES.includes(event.key)){
        playerLetters.push(event.key)
        updatePlayerLetterOnBoard()
    } else if(event.key === 'Backspace'){
        playerLetters.pop()
        updatePlayerLetterOnBoard()
        colorLetterBasic(playerLetters.length)
    }
    checkCorrectTyping()
    if (checkForCompleteWord()) {
        LIST_OF_WORDS.splice(LIST_OF_WORDS.indexOf(wordOnBoard.join('')),1)
        wordOnBoard = drawWord().split('')
        playerLetters = []
        playerScore ++
        updatePlayerLetterOnBoard()
        updatePlayerPionts()
    }
})
