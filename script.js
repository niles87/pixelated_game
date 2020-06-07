const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let keys = [];
let npcActions = ["left", "right"];
let npcs = 2;

// Player image
const playerSprite = new Image();
playerSprite.src = "./images/ironman.png";

// Background image
const background = new Image();
background.src = "./images/background.png";

// NPC image
const npcSprite = new Image();
npcSprite.src = "./images/ronan.png";

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

function drawNPCSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

class Character {
  constructor() {
    this.width = 32;
    this.height = 48;
    this.frameX = 0;
    this.frameY = 0;
    this.speed = 9;
    this.moving = false;
    this.x = 300;
    this.y = 300;
  }

  draw() {
    drawSprite(
      playerSprite,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update() {
    this.movePlayer();
    this.handlePlayerFrame();
  }

  movePlayer() {
    if (keys["ArrowUp"] && this.y > 100) {
      this.y -= this.speed;
      this.frameY = 3;
      this.moving = true;
    }
    if (keys["ArrowLeft"] && this.x > 0) {
      this.x -= this.speed;
      this.frameY = 1;
      this.moving = true;
    }
    if (keys["ArrowRight"] && this.x < canvas.width - this.width) {
      this.x += this.speed;
      this.frameY = 2;
      this.moving = true;
    }
    if (keys["ArrowDown"] && this.y < canvas.height - this.height) {
      this.y += this.speed;
      this.frameY = 0;
      this.moving = true;
    }
  }

  handlePlayerFrame() {
    if (this.frameX < 3 && this.moving) {
      this.frameX++;
    } else {
      this.frameX = 0;
    }
  }
}

class NPC {
  constructor() {
    this.x = 800;
    this.y = 200;
    this.width = 32;
    this.height = 48;
    this.frameX = 0;
    this.frameY = 1;
    this.speed = Math.random() * 1.5 + 8;
    this.actions = npcActions[Math.floor(Math.random() * npcActions.length)];
  }
  draw() {
    drawNPCSprite(
      npcSprite,
      this.width * this.frameX,
      this.height * this.frameY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  update() {
    if (this.actions === "left") {
      if (this.x > 0) {
        this.x -= this.speed;
      } else {
        this.x = 800 + this.width;
        this.y = Math.random() * (canvas.height - 100 - this.height) + 100;
      }
    } else if (this.actions === "right") {
      this.frameY = 2;
      if (this.x < canvas.width + this.width) {
        this.x += this.speed;
      } else {
        this.x = 0 - this.width;
        this.y = Math.random() * (canvas.height - 100 - this.height) + 100;
      }
    }
    this.handleNPCFrame();
  }
  handleNPCFrame() {
    if (this.frameX < 3) {
      this.frameX++;
    } else {
      this.frameX = 0;
    }
  }
}
let npcArr = [];
const player = new Character();
for (let n = 0; n < npcs; n++) {
  npcArr.push(new NPC());
}

window.addEventListener("keydown", function (e) {
  keys[e.key] = true;
  player.moving = true;
});

window.addEventListener("keyup", function (e) {
  delete keys[e.key];
  player.moving = false;
});

let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    for (let i = 0; i < npcArr.length; i++) {
      npcArr[i].draw();
      npcArr[i].update();
    }
    player.draw();
    player.update();
  }
}
startAnimating(15);
