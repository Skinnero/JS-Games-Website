const BOARD_ROW_SIZE = 10 // Need to change grid-template-columns in css as well
const FIELD_IMG = 'static/images/snake_grass.png'
const SNAKE_IMG = 'static/images/snake_on_grass.png'
const APPLE_IMG = 'static/images/apple_on_grass.png'

let snakeSpeed = 500
let interval = undefined
let apple = []
let score = 0

let snakeHead = [parseInt(BOARD_ROW_SIZE / 2), parseInt(BOARD_ROW_SIZE / 2)]
let snakeBody = [snakeHead]
let appleOnBoard = false
let movementDirection = []

document.addEventListener('keydown', gameLoop)
window.onload = gameInit()

function gameInit (){
    createBoard()
    generateNewApple()
    putSnakeOnBoard(snakeBody)
}

function saveData() {
    let name = prompt('Enter your nickname:')
    const data = {user_name: name, game: 'snake', score: score}
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

function showEndGameMessage(message) {
    clearInterval(interval)
    const scoreText = document.getElementById('score')
    scoreText.innerHTML = message
    document.getElementsByClassName('game-board')[0].style.filter = 'brightness(50%)';
    document.getElementById('buttons').style.display = 'flex'
    document.removeEventListener('keydown', gameLoop);
}

function gameLoop(event) {

    if (!captureKeys(event)) {
        return
    }
    
    clearInterval(interval)
    document.getElementById('score').innerText = `Score: ${score}`
    if (checkWinCondition()) {
        showEndGameMessage(`You won the game, you got ${score} score!`)
    } else if (checkLoseCondition(movementDirection)) {
        showEndGameMessage(`You lost the game, you got ${score} score!`)
    } else {
        generateNewApple()
        moveSnake(snakeBody)
        putSnakeOnBoard(snakeBody)
        interval = setInterval(() => {
            document.getElementById('score').innerText = `Score: ${score}`
            
            if (checkWinCondition()) {
                showEndGameMessage(`You won the game, you got ${score} score!`)
            } else if (checkLoseCondition(movementDirection)) {
                showEndGameMessage(`You lost the game, you got ${score} score!`)
            } else {
                generateNewApple()
                moveSnake(snakeBody)
                putSnakeOnBoard(snakeBody)
            }
        },snakeSpeed)
    }
}

function checkWinCondition() {
    return snakeBody.length === document.getElementsByTagName('img').length
}

function checkLoseCondition(movementDirection) {
    // Checks if snake hit the wall
    if (snakeHead[0] + movementDirection[0] < 0 || snakeHead[0] + movementDirection[0] > BOARD_ROW_SIZE - 1){
        return true
    } else if (snakeHead[1] + movementDirection[1] < 0 || snakeHead[1] + movementDirection[1] > BOARD_ROW_SIZE - 1){
        return true
    }
    // Cheks if snake hit itself
    for (body of snakeBody) {
        if (body[0] === snakeHead[0] + movementDirection[0] && body[1] === snakeHead[1] + movementDirection[1]) {
            return true
        }
    }
    return false
}


function putSnakeOnBoard(snakeBody) {
    let field = document.getElementsByTagName('img')
    for (coordinates of field) {
        let isSnakePart = false;
        for (body of snakeBody) { 
            if (body[0] === parseInt(coordinates.dataset.x) && body[1] == parseInt(coordinates.dataset.y)) {
                isSnakePart = true
            } 
        } if (isSnakePart) {
            coordinates.setAttribute('src', SNAKE_IMG);
        } else if (apple[0] === parseInt(coordinates.dataset.x) && apple[1] == parseInt(coordinates.dataset.y)) {
            coordinates.setAttribute('src', APPLE_IMG);
        } else {
            coordinates.setAttribute('src', FIELD_IMG);
        }
    }
}

function createBoard () {
    const gameField = document.getElementsByTagName('div')[0]
    for (let x = 0; x < BOARD_ROW_SIZE; x++){
        for (let y = 0; y < BOARD_ROW_SIZE; y++){
            let field = document.createElement('img')
            field.dataset.x = x
            field.dataset.y = y
            field.setAttribute('src', FIELD_IMG)
            gameField.appendChild(field)
        }
    }
}

function captureKeys(event) {
    if(
        (event.key === 'w' || event.key === 'ArrowUp') &&
        movementDirection[0] !== 1 &&
        movementDirection[1] !== 0
    ){
        movementDirection = [-1, 0];
        return true
    } else if(
        (event.key === 's' || event.key === 'ArrowDown') &&
        movementDirection[0] !== -1 &&
        movementDirection[1] !== 0
    ) {
        movementDirection = [1, 0];
        return true
    } else if(
        (event.key === 'a' || event.key === 'ArrowLeft') &&
        movementDirection[0] !== 0 &&
        movementDirection[1] !== 1
    ) {
        movementDirection = [0, -1];
        return true
    } else if(
        (event.key === 'd' || event.key === 'ArrowRight') &&
        movementDirection[0] !== 0 &&
        movementDirection[1] !== -1
    ) {
        movementDirection = [0, 1];
        return true
    }
    return false
}

function moveSnake(snake) {
    if (movementDirection[0] != 0 || movementDirection[1] != 0) {
        let newSnakeHead = []
        newSnakeHead[0] = snake[0][0] + movementDirection[0]
        newSnakeHead[1] = snake[0][1] + movementDirection[1]
        snakeHead = newSnakeHead
        snakeBody.unshift(newSnakeHead)
        if (newSnakeHead[0] != apple[0] || newSnakeHead[1] != apple[1]) {
            snakeBody.pop()
        } else {
            snakeSpeed -= 5
            score ++
            appleOnBoard = false
        }
    }
}

function generateNewApple() {
    if (!appleOnBoard) {
        let newApple = []
        do {
            newApple[0] = Math.floor(Math.random() * BOARD_ROW_SIZE)
            newApple[1] = Math.floor(Math.random() * BOARD_ROW_SIZE)
        } while (isOccupiedBySnake(newApple))
        apple = newApple
        appleOnBoard = true
    }
}

function isOccupiedBySnake(coordinates) {
    for (body of snakeBody) {
        if (body[0] === coordinates[0] && body[1] === coordinates[1]) {
            return true
        }
    }
    return apple[0] === coordinates[0] && apple[1] === coordinates[1]
}