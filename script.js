const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird, pipes, frame, score, highScore, gameOver;

function resetGame() {
  bird = { x: 60, y: 150, width: 34, height: 24, gravity: 0.5, lift: -8, velocity: 0 };
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  document.getElementById("gameOver").classList.add("hidden");
  update();
}

function loadHighScore() {
  highScore = localStorage.getItem("flappyHighScore") || 0;
}

function saveHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("flappyHighScore", highScore);
  }
}

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, 50, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, 50, p.bottom);
  });
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "24px Trebuchet MS";
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`High: ${highScore}`, 300, 30);
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (frame % 90 === 0) {
    const top = Math.random() * (canvas.height / 2);
    const gap = 130;
    pipes.push({ x: canvas.width, top, bottom: canvas.height - top - gap });
  }

  pipes.forEach(p => {
    p.x -= 2;
  });

  // Remove off-screen pipes
  pipes = pipes.filter(p => p.x + 50 > 0);

  // Check collisions
  for (let p of pipes) {
    if (
      bird.x < p.x + 50 &&
      bird.x + bird.width > p.x &&
      (bird.y < p.top || bird.y + bird.height > canvas.height - p.bottom)
    ) {
      triggerGameOver();
      return;
    }
  }

  // Floor or ceiling
  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    triggerGameOver();
    return;
  }

  // Score
  pipes.forEach(p => {
    if (p.x + 50 === bird.x) score++;
  });

  drawPipes();
  drawBird();
  drawScore();

  frame++;
  requestAnimationFrame(update);
}

function flap() {
  if (gameOver) return;
  bird.velocity = bird.lift;
}

function triggerGameOver() {
  gameOver = true;
  saveHighScore();

  document.getElementById("scoreDisplay").innerText = `Score: ${score}`;
  document.getElementById("highScoreDisplay").innerText = `High Score: ${highScore}`;
  document.getElementById("gameOver").classList.remove("hidden");
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") flap();
});

canvas.addEventListener("mousedown", flap);
document.getElementById("restartBtn").addEventListener("click", resetGame);

// Initialize game
loadHighScore();
resetGame();
