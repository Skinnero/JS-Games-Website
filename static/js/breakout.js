const canvas = document.getElementById('game-field')
const context = canvas.getContext('2d')

let ballX = canvas.width / 2
let ballY = canvas.height - 30
let BALL_RADIUS = 5
let BALL_SPEED_X = 1
let BALL_SPEED_Y = 1
let BALL_SPEED_ACCELERATION = 0.1

const brickRowCount = 6
const brickColumnCount = 10
const brickWidth = 28
const brickHeight = 8
const brickPadding = 2
const brickOffsetTop = 2
const brickOffsetLeft = 1
const bricks = create2DArray()

let PADDLE_SPEED = 3
let paddleWidth = 80
let paddleHeight = 5
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false
let leftPressed = false

document.addEventListener('keydown', keyDownHandler)
document.addEventListener('keyup', keyUpHandler)

document.getElementById('start').addEventListener('click', startGame)

let score = 0
let interval 

function startGame() {
    interval = setInterval(draw, 10)
    document.getElementById('start').style.display = 'none'
}

function displayGameOver() {
    clearInterval(interval)
    canvas.style.filter = 'brightness(50%)'
    document.getElementById('start').style.display = 'block'
    document.getElementById('start').innerText = 'Restart'
    document.getElementById('start').setAttribute('onclick', 'window.location.reload()')
    document.getElementById('save').style.display = 'block'
}

function create2DArray() {
    let bricks = []
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = []
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = {x: 0, y: 0, status: true}
        }
    }
    return bricks
}

function drawPlayerPaddle() {
    context.beginPath()
    context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
    context.fillStyle = 'green'
    context.fill()
    context.closePath()
}

function drawCircle() {
    context.beginPath()
    context.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2, false)
    context.fillStyle = 'blue'
    context.fill()
    context.closePath()
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
                bricks[c][r].x = brickX
                bricks[c][r].y = brickY
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = "red";
                context.fill();
                context.closePath();
            }
        }
    }
}

function updateScore() {
    score ++
    document.getElementById('score').innerText = `Score: ${score}`
}
function checkWinCondition() {
    if (score === 60){
        clearInterval(interval)
        canvas.style.filter = 'brightness(50%)'
        document.getElementById('start').style.display = 'block'
        document.getElementById('start').innerText = 'Play Again!'
        document.getElementById('start').setAttribute('onclick', 'window.location.reload()')
        document.getElementById('save').style.display = 'block'
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status) {
                if (
                    ballX > b.x + BALL_RADIUS &&
                    ballX < b.x + brickWidth + BALL_RADIUS&&
                    ballY > b.y + BALL_RADIUS &&
                    ballY < b.y + brickHeight + BALL_RADIUS
                ) {
                    BALL_SPEED_Y = -BALL_SPEED_Y;
                    b.status = false;
                    updateScore()
                    BALL_SPEED_X += BALL_SPEED_ACCELERATION
                    BALL_SPEED_Y += BALL_SPEED_ACCELERATION
                }
            }
        }
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    drawBricks()
    drawCircle()
    drawPlayerPaddle()
    collisionDetection()
    checkWinCondition()
    movePaddle()
    bounceBall()
    ballX += BALL_SPEED_X
    ballY += BALL_SPEED_Y
}

function bounceBall() {
    if (ballX + BALL_SPEED_X > canvas.width - BALL_RADIUS || ballX + BALL_SPEED_X < BALL_RADIUS) {
        BALL_SPEED_X = -BALL_SPEED_X
    } else if (ballY + BALL_SPEED_Y < BALL_RADIUS) {
        BALL_SPEED_Y = -BALL_SPEED_Y
    } else if (ballY + BALL_SPEED_Y > canvas.height - BALL_RADIUS) {
        displayGameOver()
    } else if (ballX > paddleX && ballX + BALL_SPEED_X < paddleX + paddleWidth && ballY + BALL_SPEED_Y > canvas.height - BALL_RADIUS - paddleHeight) {
        BALL_SPEED_Y = -BALL_SPEED_Y
        if (ballX - paddleX < paddleWidth / 2) {
            if (-BALL_SPEED_X < 0){
                BALL_SPEED_X = -BALL_SPEED_X;
            }
        } else {
            if (-BALL_SPEED_X > 0){
                BALL_SPEED_X = -BALL_SPEED_X;
            }
        }
    }
}

function keyDownHandler(event) {
    if (event.key.toLowerCase() === 'd' || event.key === "ArrowRight") {
        rightPressed = true
    } else if (event.key.toLowerCase() === 'a' || event.key === "ArrowLeft"){
        leftPressed = true
    }
}

function keyUpHandler(event) {
    if (event.key.toLowerCase() === 'd' || event.key === "ArrowRight") {
        rightPressed = false
    } else if (event.key.toLowerCase() === 'a' || event.key === "ArrowLeft"){
        leftPressed = false
    }
}

function movePaddle() {
    if (rightPressed) {
        paddleX += PADDLE_SPEED
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if (leftPressed) {
        paddleX -= PADDLE_SPEED
        if (paddleX < 0) {
            paddleX = 0
        }
    }
}

function saveData() {
    const name = prompt('Enter your nickname:')
    const data = {user_name: name, game: 'breakout', score: score}
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