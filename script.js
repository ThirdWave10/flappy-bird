const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const flapSound = document.getElementById("flapSound");

const birdImg = new Image();
birdImg.src = "https://i.imgur.com/YukgR6W.png"; // Shogun-style bird sprite

let bird = { x: 80, y: 300, width: 34, height: 24, gravity: 0.4, lift: -8, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "#4a2c2a";
  for (let p of pipes) {
    ctx.fillRect(p.x, 0, 50, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, 50, p.bottom);
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "24px Trebuchet MS";
  ctx.fillText("Score: " + score, 10, 30);
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

  for (let p of pipes) {
    p.x -= 2;
    if (p.x + 50 === bird.x) score++;
  }

  // Collision detection
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

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    triggerGameOver();
    return;
  }

  drawPipes();
  drawBird();
  drawScore();

  frame++;
  requestAnimationFrame(update);
}

function flap() {
  if (gameOver) return;
  bird.velocity = bird.lift;
  flapSound.currentTime = 0;
  flapSound.play();
}

function triggerGameOver() {
  gameOver = true;
  document.getElementById("gameOver").classList.remove("hidden");
}

function restartGame() {
  bird.y = 300;
  bird.velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  document.getElementById("gameOver").classList.add("hidden");
  update();
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") flap();
});
canvas.addEventListener("mousedown", flap);
document.getElementById("restartBtn").addEventListener("click", restartGame);

birdImg.onload = update;
