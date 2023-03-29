let gameBoard = document.getElementsByClassName('greeting')[0]
let gameText = document.getElementsByTagName('h1')[0]
let saveButton = document.getElementsByTagName('button')[0]
gameBoard.addEventListener('click', main)
const MILISECONDS = 1000
const MINIMUM_WAIT = 2

let startTime = 0
let intervalId = undefined
let reactionTime = 0
let bestTimer = Infinity

function main() {
    if (this.classList.contains('greeting')) {
        this.classList.add('game-stop')
        this.classList.toggle('greeting')
        gameText.innerText = 'Click on screen when it turns green!'
        getRandomInterval()
    }
    else if (this.classList.contains('game-result')) {
        this.classList.toggle('game-result')
        saveButton.hidden = true
        gamePause()
    }
    else if (this.classList.contains('game-start')) {
        clearInterval(intervalId)
        gameText.innerHTML = `${reactionTime}<br>(Click on screen to try agian!)`
        this.classList.toggle('game-result')
        setResult(reactionTime)
        saveButton.addEventListener('click', saveData)
        saveButton.hidden = false
    }
}

function saveData() {
    let userName = prompt('Please enter you nickname')
    const data = {user_name: userName, game_name: 'reaction_time', score: bestTimer}
    fetch('/save',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    window.location = '/hall-of-fame'
}

function setResult(time) {
    let result = document.getElementById('score')
    if (time < bestTimer){
        bestTimer = time
        result.innerText = `Your Best: ${time}`
    }
}

function gamePause() {
    gameBoard.classList.toggle('game-start')
    gameBoard.classList.toggle('game-stop')
    gameText.innerText = 'Click on me when it turns green!'
    getRandomInterval()
}

function getRandomInterval() {
    let wait = Math.floor((Math.random() * 6) + MINIMUM_WAIT) * MILISECONDS
    setTimeout(() => {
        startTime = new Date()
        gameBoard.classList.toggle('game-start')
        gameBoard.classList.toggle('game-stop')
        intervalId = setInterval(() => {
            let time = endTimer(startTime)
            gameText.innerText = time
            reactionTime = time
        })
    }, wait)
}

function endTimer(startTime) {
    let endTime = new Date()
    return (endTime - startTime) / MILISECONDS
}
