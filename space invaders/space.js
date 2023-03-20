//board
const tileSize = 32;
let rows = 16;
let cols = 16;

let board;
const boardWidth = tileSize * cols; // 32 * 16
const boardHeight = tileSize * rows; // 32 * 16
let context;

//ship
const shipWidth = tileSize * 2;
const shipHeight = tileSize;
const shipX = tileSize * cols / 2 - tileSize;
const shipY = tileSize * rows - tileSize * 2;

const ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
}

let shipImg;
const shipVelocityX = tileSize; // ship moving speed

//aliens
let alienArray = [];
const alienWidth = tileSize * 2;
const alienHeight = tileSize;
const alienX = tileSize;
const alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //number of aliens to defeat
let alienVelocityX = 1; // movement

//bullets
let bulletArray = [];
let bulletVelocity = -10;
let bulletVelocityY = -10;

let score = 0;
let GamerOver = false;

//level counter
let level = 1;

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); //used for drawing on the board

    //draw initial ship
    // context.fillStyle="green";
    // console.info(ship);
    // context.fillRect(ship.x, ship.y, shipWidth, shipHeight);

    //load images
    shipImg = new Image();
    shipImg.src = "./ship.png";
    shipImg.onload = function () {
        context.drawImage(shipImg, shipX, shipY, shipWidth, shipHeight);
    }

    alienImg = new Image();
    alienImg.src = "./alien.png";

    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}

function update() {
    // console.info('update');
    requestAnimationFrame(update);

    if (GamerOver) {
        return;
        alert("Game over (Reload the page)")
    }

    context.clearRect(0, 0, board.width, board.height);


    // drawing ship
    context.drawImage(shipImg, ship.x, ship.y, shipWidth, shipHeight);

    //alien
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            // alien border
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX * 2;

                // move alien up one row
                for (let j = 0; j < alienArray.length; j++)
                    alienArray[j].y += alienHeight;

            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
            if (alien.y >= ship.y) {
                GamerOver = true;
                alert("Game over")
            }
        }
    }

    // bullet
    // for (let i = 0; i < bulletArray.length; i++) {
    //     bullet = b
    //     bullet.y += bulletVelocityY;
    //     context.fillStyle = "white";
    //     context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    //     // bullet collision with aliens
    //     for (let j = 0; j < alienArray.length; j++) {
    //         let alien = alienArray[j];
    //         if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
    //             bullet.used = true;
    //             alien.alive = false;
    //             alienCount--;  
    //             score += 100;
    //       }

    //     }
    // }

    bulletArray.forEach(bullet => {
        bullet.y += bulletVelocityY;
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // bullet collision with aliens
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;  
                score += 100;
          }

        }
    });

    //clear bullet
    //while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
    //bulletArray.shift } // removes bullet

    // next level
    if (alienCount === 0) {
        // Increase aliens
        alienColumns = Math.min(alienColumns + 1, cols/2 -2);
        alienRows = Math.min(alienRows + 1, rows-4);
        alienVelocityX += 0.2;
        alienArray = [];
        bulletArray = [];
        createAliens();
        level += 1;
    }

    //score
    context.fillStyle="white";
    // context.f="16px courier";
    context.fillText(score, 5, 20);

    //level
    context.fillStyle="white"
    context.fillText(level, 40, 20);

}   



function moveShip(e) {
    if (GamerOver) {
        return;
        
    }
    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; // move left one tile
        console.info(ship);
    }
    else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX; // move right one tile
        console.info(ship);
    }
}

function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            const alien = {
                img: alienImg,
                x: alienX + c * alienWidth,
                y: alienY + r * alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive: true
            }
            alienArray.push(alien)
        }
    }
    alienCount = alienArray.length;
}

function shoot(e) {
    if (GamerOver) {
        return;
    }
    if (e.code === "Space") {
        let bullet = {
            x: ship.x + shipWidth * 15 / 32,
            y: ship.y,
            width: tileSize / 8,
            height: tileSize / 2,
            used: false
        }
        bulletArray.push(bullet);
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}