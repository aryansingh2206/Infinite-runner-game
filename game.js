// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

// Player properties
const player = {
    x: 50,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    velocityY: 0,
    gravity: 0.6,
    jumpStrength: -12,
    isJumping: false
};

// Obstacles
let obstacles = [];
const obstacleWidth = 20;
const obstacleHeight = 40;
let obstacleSpeed = 5;
let frameCount = 0;

// Score system
let score = 0;
let highScore = 0;
let isGameOver = false;

// Handle Jump
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && !player.isJumping && !isGameOver) {
        player.velocityY = player.jumpStrength;
        player.isJumping = true;
    }
});

// Restart game on Enter key press
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && isGameOver) {
        resetGame();
    }
});

// Update function
function update() {
    if (isGameOver) return;

    // Apply gravity
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Prevent player from falling below ground
    if (player.y >= canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.isJumping = false;
    }

    // Generate obstacles randomly
    if (frameCount % 90 === 0) {
        obstacles.push({ x: canvas.width, y: canvas.height - obstacleHeight, width: obstacleWidth, height: obstacleHeight });
    }

    // Move obstacles
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacleSpeed;

        // Collision detection
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y
        ) {
            isGameOver = true;
            if (score > highScore) {
                highScore = score; // Update high score
            }
        }
    }

    // Remove off-screen obstacles
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Increase score over time
    score++;

    frameCount++;
}

// Draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = isGameOver ? "gray" : "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw obstacles
    ctx.fillStyle = "yellow";
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    // Display Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
    ctx.fillText("High Score: " + highScore, 20, 60);

    // Game Over Text
    if (isGameOver) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2);
        ctx.fillText("Press ENTER to Restart", canvas.width / 2 - 140, canvas.height / 2 + 40);
    }
}

// Reset game function
function resetGame() {
    player.y = canvas.height - 50;
    player.velocityY = 0;
    obstacles = [];
    frameCount = 0;
    score = 0;
    isGameOver = false;
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
