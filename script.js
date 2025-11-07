const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const W = canvas.width;
const H = canvas.height;

let frames = 0;
let score = 0;
const gap = 140;
const pipeWidth = 60;
const pipeSpeed = 2.5;

// Bird object
const bird = {
  x: 80,
  y: H/2,
  width: 40,
  height: 30,
  gravity: 0.5,
  lift: -9,
  velocity: 0,

  draw() {
    // Draw samurai helmet (kabuto) - simplified
    ctx.fillStyle = '#b22222'; // dark red
    ctx.beginPath();
    ctx.ellipse(this.x + 20, this.y + 10, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Helmet front horns
    ctx.fillStyle = '#444';
    ctx.beginPath();
    ctx.moveTo(this.x + 10, this.y + 0);
    ctx.lineTo(this.x + 15, this.y + 20);
    ctx.lineTo(this.x + 5, this.y + 10);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.x + 30, this.y + 0);
    ctx.lineTo(this.x + 25, this.y + 20);
    ctx.lineTo(this.x + 35, this.y + 10);
    ctx.closePath();
    ctx.fill();

    // Headband
    ctx.fillStyle = '#800000';
    ctx.fillRect(this.x + 5, this.y + 15, 30, 5);

    // Face
    ctx.fillStyle = '#f4d1b1'; // skin color
    ctx.beginPath();
    ctx.ellipse(this.x + 20, this.y + 25, 15, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x + 13, this.y + 25, 3, 0, Math.PI * 2);
    ctx.arc(this.x + 27, this.y + 25, 3, 0, Math.PI * 2);
    ctx.fill();

    // Body - samurai armor
    ctx.fillStyle = '#222222';
    ctx.fillRect(this.x + 5, this.y + 37, 30, 15);

    // Armor details stripes
    ctx.strokeStyle = '#aa0000';
    ctx.lineWidth = 3;
    for(let i=0; i<5; i++) {
      ctx.beginPath();
      ctx.moveTo(this.x + 5 + i*6, this.y + 37);
      ctx.lineTo(this.x + 5 + i*6, this.y + 52);
      ctx.stroke();
    }
  },

  update() {
    this.velocity += this.gravity;
    this.velocity *= 0.9; // air resistance
    this.y += this.velocity;

    if(this.y + this.height > H) {
      this.y = H - this.height;
      this.velocity = 0;
    }

    if(this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  },

  flap() {
    this.velocity += this.lift;
  },

  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height,
    };
  }
};

// Pipes array
const pipes = [];

function addPipe() {
  // Pipe height random but ensuring gap fits in canvas height
  const pipeHeight = Math.floor(Math.random() * (H - gap - 120)) + 60;
  pipes.push({
    x: W,
    top: pipeHeight,
    bottom: pipeHeight + gap,
    width: pipeWidth,
    passed: false,
  });
}

function drawPipes() {
  ctx.fillStyle = '#228B22'; // dark green

  pipes.forEach(pipe => {
    // top pipe
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    // bottom pipe
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, H - pipe.bottom);

    // Pipe details - red stripes (samurai style)
    ctx.strokeStyle = '#b22222';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(pipe.x + 10, 0);
    ctx.lineTo(pipe.x + 10, pipe.top);
    ctx.moveTo(pipe.x + 40, 0);
    ctx.lineTo(pipe.x + 40, pipe.top);
    ctx.moveTo(pipe.x + 10, pipe.bottom);
    ctx.lineTo(pipe.x + 10, H);
    ctx.moveTo(pipe.x + 40, pipe.bottom);
    ctx.lineTo(pipe.x + 40, H);
    ctx.stroke();
  });
}

function checkCollision() {
  const b = bird.getBounds();
  for(let i = 0; i < pipes.length; i++) {
    const p = pipes[i];

    // Collision with top pipe
    if(b.right > p.x && b.left < p.x + p.width && b.top < p.top) {
      return true;
    }
    // Collision with bottom pipe
    if(b.right > p.x && b.left < p.x + p.width && b.bottom > p.bottom) {
      return true;
    }
  }

  return false;
}

function updateScore() {
  pipes.forEach(pipe => {
    if(!pipe.passed && pipe.x + pipe.width < bird.x) {
      pipe.passed = true;
      score++;
      document.getElementById('score').textContent = `Score: ${score}`;
    }
  });
}

function gameOver() {
  alert(`Game Over! Your score: ${score}`);
  resetGame();
}

function resetGame() {
  bird.y = H / 2;
  bird.velocity = 0;
  pipes.length = 0;
  score = 0;
  document.getElementById('score').textContent = `Score: ${score}`;
}

function gameLoop() {
  ctx.clearRect(0, 0, W, H);

  bird.update();
  bird.draw();

  if(frames % 100 === 0) {
    addPipe();
  }

  pipes.forEach(pipe => pipe.x -= pipeSpeed);
  drawPipes();

  updateScore();

  if(checkCollision()) {
    gameOver();
  }

  // Remove off-screen pipes
  if(pipes.length && pipes[0].x + pipes[0].width < 0) {
    pipes.shift();
  }

  frames++;
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', () => bird.flap());
window.addEventListener('keydown', e => {
  if(e.code === 'Space') {
    bird.flap();
  }
});

resetGame();
gameLoop();
