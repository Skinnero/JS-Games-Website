// function main(currentTime){
//     window.requestAnimationFrame(main)
//     console.log(currentTime)
// }

// window.requestAnimationFrame(main)

const BOARD_ROW_SIZE = 5
const FIELD_IMG = 'static/images/snake_grass.png'
const SNAKE_IMG = 'static/images/snake_on_grass.png'

// window.onload = function() {
//     gameInit()
// }
const snake_x = parseInt(BOARD_ROW_SIZE / 2) + 1
const snake_y = parseInt(BOARD_ROW_SIZE / 2) + 1

let snakeBody = [[snake_x, snake_y]]

function gameInit (){
    createBoard()
    putSnakeOnBoard(snakeBody)
    gameLoop()
}

function gameLoop () {
    
}

function putSnakeOnBoard(snakeBody) {

    let field = document.getElementsByTagName('img')
    for (coordinates of field) {    
        if (parseInt(coordinates.dataset.x) === snakeBody[0][0] && parseInt(coordinates.dataset.y) === snakeBody[0][1]) {
            coordinates.setAttribute('src', SNAKE_IMG)
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


gameInit()