const canvas = document.getElementById('game-field')
const context = canvas.getContext('2d')

let ballX = canvas.width / 2
let ballY = canvas.height - 30
let BALL_RADIUS = 5
let BALL_SPEED_X = 1
let BALL_SPEED_Y = 1

const brickRowCount = 5
const brickColumnCount = 11
const brickWidth = 25
const brickHeight = 8
const brickPadding = 1
const brickOffsetTop = 5
const brickOffsetLeft = 7
const bricks = create2DArray()

let PADDLE_SPEED = 3
let paddleWidth = 80
let paddleHeight = 5
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false
let leftPressed = false



document.addEventListener('keydown', keyDownHandler)
document.addEventListener('keyup', keyUpHandler)



function create2DArray() {
    let bricks = []

    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = []
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = {x: 0, y: 0, status: 1}
        }
    }
    return bricks
}

function drawPlayerPaddle() {
    context.beginPath()
    context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
    context.fillStyle = '#00FF00'
    context.fill()
    context.closePath()
}

function drawCircle() {
    context.beginPath()
    context.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2, false)
    context.fillStyle = '#0000FF'
    context.fill()
    context.closePath()
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
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

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    ballX - BALL_RADIUS > b.x &&
                    ballX - BALL_RADIUS < b.x + brickWidth &&
                    ballY - BALL_RADIUS > b.y &&
                    ballY - BALL_RADIUS < b.y + brickHeight
                ) {
                    BALL_SPEED_Y = -BALL_SPEED_Y;
                    b.status = 0;
                    BALL_SPEED_X += 0.05
                    BALL_SPEED_Y += 0.05
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
    movePaddle()
    bounceBall()
    ballX += BALL_SPEED_X
    ballY += BALL_SPEED_Y
    // requestAnimationFrame(draw)
}

function bounceBall() {
    if(ballX + BALL_SPEED_X > canvas.width - BALL_RADIUS || ballX + BALL_SPEED_X < BALL_RADIUS) {
        BALL_SPEED_X = -BALL_SPEED_X;
    } else if(ballY + BALL_SPEED_Y < BALL_RADIUS) {
        BALL_SPEED_Y = -BALL_SPEED_Y;
    } else if(ballY + BALL_SPEED_Y > canvas.height - BALL_RADIUS) {
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval); // Needed for Chrome to end game
    } else if(ballY + BALL_SPEED_Y > canvas.height - BALL_RADIUS - paddleHeight) {
        if(ballX < paddleX + paddleWidth && ballX > paddleX) {
            BALL_SPEED_Y = -BALL_SPEED_Y;
        } 
        else if(ballX + BALL_SPEED_X < BALL_RADIUS) {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
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

// draw()
const interval = setInterval(draw, 10)
