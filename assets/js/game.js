/**
 * @author <a href="mailto:paulvstheworld@gmail.com">Paul</a>
 */
 
var requestAnimFrame = (function(){
  return window.requestAnimationFrame  || window.webkitRequestAnimationFrame 
    || window.mozRequestAnimationFrame || window.oRequestAnimationFrame      
    || window.msRequestAnimationFrame  || function(callback){
      window.setTimeout(callback, 1000 / 60);
    };
})();


var canvas, ctx = null;
var hero = null,
    blocks = [], 
    blockLastCreatedAt =0 , blocksCreated = 0, score = 0,
    timer = 200,        // duration of the game
    blocksMaxGap = 800, // milliseconds
    gameover = false;   // flag to check if the game is over

var scoreEl = document.getElementById('score');
var timerEl = document.getElementById('timer');


// create canvas element and attach to DOM
var createCanvas = function() {
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  
  // set canvas dimensions
  canvas.width = 600;
  canvas.height = 500;
  
  // append element to DOM
  document.body.appendChild(canvas);
};

// create HS hero object (position it on the canvas and set max boundaries)
var createHero = function() {
  hero = new Hero(
    20, 25,
    (canvas.width-20)/2, canvas.height-30, 
    canvas.width, canvas.height, 
    20
  );
};

// reset the time gap between each error depending on how many were created
function createError() {
  blocks.push(new Block(20, canvas.width, canvas.height, 10));
  blockLastCreatedAt = Math.round(new Date().getTime());
  ++blocksCreated;
  
  if(blocksCreated > 360) {
    blocksMaxGap = 200;
  }
  else if(blocksCreated > 180) {
    blocksMaxGap = 300;
  }
  else if (blocksCreated > 90) {
    blocksMaxGap = 400;
  }
  else if (blocksCreated > 60) {
    blocksMaxGap = 500;
  }
  else if (blocksCreated > 30) {
    blocksMaxGap = 600;
  }
};


// display the game over screen
function displayGameOverScreen() {
  clearCanvas();
  
  ctx.fillStyle = '#279327';

  ctx.font = '18pt helvetica';
  text = 'Game Over';
  textWidth = ctx.measureText(text).width;
  ctx.fillText(text, (canvas.width - textWidth)/2, (canvas.height - 80)/2);
  
  ctx.font = '10pt helvetica';
  text = ['You scored ', score, ' points!'].join('');
  textWidth = ctx.measureText(text).width;
  ctx.fillText(text, (canvas.width - textWidth)/2, (canvas.height - 30)/2);
  
  ctx.font = '10pt helvetica';
  text = 'Press r to restart the game.';
  textWidth = ctx.measureText(text).width;
  ctx.fillText(text, (canvas.width - textWidth)/2, (canvas.height - 0)/2);
};

// render the intro screen
function displayIntroScreen() {
  var img = new Image();
  var imgHero = new Image();
  var that = this;
  
  img.src = 'assets/img/keyboard.png';
  imgHero.src = 'assets/img/hs_hero.png';
  
  ctx.font = '16pt helvetica';
  ctx.fillStyle = '#000000';
  ctx.fillText('Use the', 0, 130);
  
  ctx.font = '16pt helvetica';
  ctx.fillText('to move', 0, 310);
  
  ctx.font = '14pt helvetica';
  ctx.fillText('and collect as many hacker school characteristics as possible', 0, 400);
  
  img.onload = function() {
    ctx.drawImage(img, 100, 40);
  }
  
  imgHero.onload = function() {
    ctx.drawImage(imgHero, 90, 290);
  }
};

// fill the canvas with a solid background color
function clearCanvas() {
  ctx.fillStyle="#F2F0ED";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

//update the position of the blocks
function update() {
  var block, randX, randY = null;
  var len = blocks.length;
  
  while(len--) {
    i = len;
    var block = blocks[i];
    if (block.isOffScreen()) {
      blocks.splice(i, 1);
      i--;
    }
    else {
      block.move(1);
    }
  }
};

// render the blocks according to their positions
function render() {
  var len = blocks.length;
  var i = null;
  clearCanvas();
  hero.render();

  while(len--) {
    i = len;
    var block = blocks[i];
    if (block.isOffScreen()) {
      blocks.splice(i, 1);
      i--;
    }
    else {
      blocks[len].render();
    }
  }
};

// check if two objects collide (helper method)
function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
};

// check if hero and the blocks have collided
function hasCollided() {
  var error = null;
  for(var i=0, len=blocks.length; i<len; i++) {
    error = blocks[i];
    if (collides(error.x, error.y, error.x + error.width, error.y + error.height,
        hero.x, hero.y, hero.x + hero.width, hero.y + hero.height)) {
      blocks.splice(i, 1);
      return true;
    }
  }
  return false;
}

// bind key handlers to the body
$('body').keydown(function(evt) {
  if (evt.keyCode === 37) {
    hero.move(-1, 0);
  }
  else if (evt.keyCode === 38) {
    hero.move(0, -1);
  }
  else if (evt.keyCode === 39) {
    hero.move(1, 0);
  }
  else if (evt.keyCode === 40) {
    hero.move(0, 1);
  }
  else if (gameover && evt.keyCode === 82){
    restartGame();
  }
});

// restart the game
function restartGame() {
  blocks = [];
  timer = 200;
  timerEl.innerHTML = timer;
  
  score = 0;
  scoreEl.innerHTML = score;
  
  blocksMaxGap = 800;
  blockLastCreatedAt = 0;
  blocksCreated = 0;
  
  gameover = false;
  
  clearCanvas();
  hero.reset();
  countdown();
  animloop();
};

// countdown the game clock (set to 200 seconds)
function countdown() {
  timerEl.innerHTML = timer;
  
  if (timer <= 0) {
    gameover = true;
  }
  else {
    timer--;
    setTimeout(countdown, 1000);
  }
};

// loop that continuously updates and renders elements if the game is ongoing
function animloop(){
  var collidedError = null;
  var currTime = Math.round(new Date().getTime());
  var timeSinceLastErrorCreated = currTime - blockLastCreatedAt
  
  if (!gameover) {
    if(!blockLastCreatedAt || timeSinceLastErrorCreated > blocksMaxGap) {
      createError();
    }

    update();
    render();

    if(hasCollided()) {
      score += 100;
      scoreEl.innerHTML = score;
    };
    requestAnimFrame(animloop);
  }
  else {
    displayGameOverScreen();
  }
};


// start the game
var init = function() {
  createCanvas();
  displayIntroScreen();
  
  setTimeout(function(){
    createHero();
    countdown();
    animloop();
  }, 3000);
};


init();