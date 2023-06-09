
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

let foodX, foodY ;
let snakeBody = [];
let snakeX = 5, snakeY= 10;
let velocityX=0 , velocityY=0;
let gameOver = false;
let setIntervalId;
let score = 0;
let highScore= localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;
        

const changeFoodPosition = () => {
    // passing a random 0 - 30 value as food position
    foodX = Math.floor(Math.random() * 15) + 1;
    foodY = Math.floor(Math.random() * 15) + 1;
    
}


const handleGameOver = () => {
    // clearing the timer and reloading the page on game over

    clearInterval(setIntervalId);
    (async () => {
    const { value: accept } = await Swal.fire({
        icon: 'error',
        title: 'Game Over!',
        text: 'Pres Ok to replay ...',
        allowOutsideClick: false,
        customClass:{
            confirmButton:'swal-button',
        },

        inputValidator: (result) => {
          }

      })
      if (accept) {
        location.reload();
      }
    })()
}

const changeDirecction = (e) =>{
    // changing the velocity value based on key press
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX=0;
        velocityY= -1;
        
    } else if(e.key ==="ArrowDown" && velocityY != -1){
        velocityX= 0;
        velocityY= 1;
        
    }else if(e.key === "ArrowLeft" && velocityX != 1){
        velocityX= -1;
        velocityY= 0;
         
    }else if(e.key === "ArrowRight" && velocityX != -1){
        velocityX= 1;
        velocityY= 0;
        
    }
    initGame();
}

const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup= `<div class="food" style="grid-area: ${foodY} / ${foodX} "></div>`;
    // cheking if the snake hit the food
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX,foodY]); //pushing food position to shake body array
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerHTML = `Score: ${score}`;
        highScoreElement.innerHTML = `High Score: ${highScore}`;
        
    }

    for (let i = snakeBody.length -1 ; i > 0 ; i--) {
        // shifting forward the values of the elements in the snake body by one
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX,snakeY]; // setting first element of nake body to current snake position
    
    // updating the snake's head position based on the current velocity
    snakeX +=velocityX;
    snakeY +=velocityY;

    if (snakeX <= 0 || snakeX > 15 || snakeY <= 0 || snakeY > 15){
        gameOver = true;
    }
    
    for (let i= 0; i < snakeBody.length; i++){
    // adding a div for each part of the snake's body
    htmlMarkup+=  `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]} "></div>`;
   
    // cheking if the snake head hit the body if so set gameOver to true
    if(i !== 0 && snakeBody [0][1]=== snakeBody[i][1] &&snakeBody [0][0]=== snakeBody[i][0] ){
        gameOver = true;
    }
    }
    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
setIntervalId = setInterval (initGame, 150);
document.addEventListener("keydown", changeDirecction);