/**
 * @author <a href="mailto:paulvstheworld@gmail.com">Paul</a>
 */

var blockTexts = [
  'curiosity', 
  'passion', 
  'intelligent', 
  'commitment',
  'batches',
  'friendly',
  'self directed',
  'introspective',
  'rigorous',
  'reflective',
  'depth over breadth',
  'debugger',
  'pair programming',
  'alumni',
  'facilitators',
  'peers'
];

function getBlockText() {
  var len = blockTexts.length,
      rand = Math.round(Math.random() * (len-1));
  return blockTexts[rand];
}


// little hacker school icon hero
function Hero(width, height, x, y, maxX, maxY, speed) {
  this.initX = x;
  this.initY = y;
  
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.maxX = maxX;
  this.maxY = maxY;
  this.speed = speed;
  this.loaded = false;
}

Hero.prototype.render = function() {
  var that = this,
      img = new Image();
  
  img.src =  'assets/img/hs_hero.png';
  
  if (this.loaded) {
    ctx.drawImage(img, that.x, that.y);
  }
  
  img.onload = function() {
    if(!that.loaded) {
      that.loaded = true;
      ctx.drawImage(img, that.x, that.y);
    }
  };
};

Hero.prototype.reset = function() {
  this.x = this.initX;
  this.y = this.initY;
};

Hero.prototype.init = function() {
  var img = new Image(),
      that = this;
  img.onload = function() {
    that.loaded = true;
    ctx.drawImage(img, that.x, that.y);
  };
  
  img.src = 'assets/img/hs_hero.png';
}

Hero.prototype.move = function(x, y) {
  x = x * this.speed;
  y = y * this.speed;
  
  // move left and right (confined to canvas boundaries)
  if(this.x + x > this.maxX - this.width) {
    this.x = this.maxX - this.width;
  }
  else if(this.x + x <= 0) {
    this.x = 0;
  }
  else {
    this.x += x;
  }
  
  // move up and down (confined to canvas boundaries)
  if(this.y +y > this.maxY - this.height) {
    this.y = this.maxY - this.height;
  }
  else if (this.y + y <= 0) {
    this.y = 0;
  }
  else {
    this.y += y;
  }
};


// blocks of hacker school characteristics
function Block(y, maxX, maxY, speed) {
  this.x = Math.round(Math.random() * maxX);
  this.y = y;
  this.maxX = maxX;
  this.maxY = maxY;
  this.speed = speed;
  this.width = null;
  this.text = getBlockText();
}

// blocks are limited to vertical movement ...for now
Block.prototype.move = function(y) {
  this.y += y;
};

// check if an item traversed off the screen
Block.prototype.isOffScreen = function() {
  if (this.x > this.maxX || this.y > this.maxY) {
    return true;
  }
  
  return false;
}

// render the block of text onto the canvas element
Block.prototype.render = function() {
  var dimensions = null;
  ctx.font = '10pt helvetica';
  
  dimensions = ctx.measureText(this.text);
  this.width = dimensions.width;
  this.height = 3;
  
  // don't exceed right canvas boundary
  if(this.x + this.width > this.maxX) {
    this.x = this.maxX - this.width;
  }
  
  // set block background
  ctx.fillStyle = '#FFFFFF'; // set canvas background color
  ctx.fillRect(this.x, this.y-12, this.width, 15);  // now fill the canvas
  
  // set block text
  ctx.fillStyle = '#279327';
  ctx.fillText(this.text, this.x, this.y);
};