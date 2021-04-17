var obj;
var obst = [];
var frame = 0;

var gameCanvas = {
	canvas: document.createElement("canvas"),
	start: function() { 
		this.canvas.height = 320;
		this.canvas.width = 700;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, 
			document.body.childNodes[0]);
		this.interval = setInterval(nextFrame, 4);
		window.addEventListener('keydown', function(e) {
			gameCanvas.key = e.keyCode;
		})
		window.addEventListener('keyup', function(e) {
			gameCanvas.key = false;
		})
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width,
		 this.canvas.height);
	},
	stop: function(message) {
		clearInterval(this.interval);
		document.getElementById("tryAgain").innerHTML =
		 message;
		document.getElementById("restartBtn").style.visibility = "visible";
		// document.getElementById("upBtn").style.visibility = "hidden";
		// document.getElementById("downBtn").style.visibility = "hidden";
	}
}

function startGame() {
	gameCanvas.start();
	obj = new component(30, 30, "yellow", 40, 270);
	// document.getElementById("upBtn").style.visibility = "visible";
	// document.getElementById("downBtn").style.visibility = "visible";
	document.getElementById("startBtn").style.visibility = "hidden";
	document.getElementById("rules").style.display = "none";
}

function restartGame() {
	gameCanvas.clear();
	obst = []
	startGame();
	document.getElementById("tryAgain").innerHTML = "";
	document.getElementById("restartBtn").style.visibility = "hidden";
	frame = 0;
}


function component(width, height, color, x, y) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
    this.gravitySpeed = 0;
    this.rightSpeed = 0;
	this.update = function() {
		ctx = gameCanvas.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.width, 
			this.height);
    }
    this.newPos = function() {
    	this.y += this.gravitySpeed;
    	this.x += this.rightSpeed;
    	this.outOfBoundsBottom();
    	this.outOfBoundsTop();
	}

	this.crashed = function(obstacle) {
		var objLeft = this.x;
		var objRight = this.x + this.width;
		var objTop = this.y;
		var objBottom = this.y + this.height;
		var obstLeft = obstacle.x;
		var obstRight = obstacle.x + obstacle.width;
		var obstTop = obstacle.y;
		var obstBottom = obstacle.y + obstacle.height;
		var crash = false;
		if (((Math.abs(objBottom - obstTop) < 25) && (Math.abs(objLeft - obstRight)) < 25) ||
			((Math.abs(objBottom - obstTop) < 25) && (Math.abs(objRight - obstLeft)) < 25) ||
			((Math.abs(objTop - obstBottom) < 25) && (Math.abs(objRight - obstLeft)) < 25) ||
			((Math.abs(objTop - obstBottom) < 25) && (Math.abs(objLeft - obstRight)) < 25)) {
			crash = true;
		}
		return crash;
	}
	this.outOfBoundsBottom = function() {
		if (this.y > gameCanvas.canvas.height - 
			this.height-10) {
			this.y = (gameCanvas.canvas.height - 
				this.height-10);
			this.gravitySpeed = 0;
		}
	}
	this.outOfBoundsTop = function() {
		if (this.y < 10) {
			this.y = 10;
		}
	}
}

function nextFrame() {
	var obstX, obstY;
	for (i = 0; i < obst.length; i += 1) {
        if (obj.crashed(obst[i])) {
            gameCanvas.stop("Oh no! You came too close. Please try again.");
            return;
        } 
    }
    if (obj.x > 650) {
    	gameCanvas.stop("Yay! You made it to the end of the store safely.");
        return;
    }
    frame += 1;
	gameCanvas.clear();
	obj.rightSpeed = 0;
	obj.gravitySpeed = 0;
	if (gameCanvas.key && gameCanvas.key == 39) {
		obj.rightSpeed = 0.6;
	}
	if (gameCanvas.key && gameCanvas.key == 38) {
		obj.gravitySpeed = -1;
	}
	if (gameCanvas.key && gameCanvas.key == 40) {
		obj.gravitySpeed = 1;
	}
	var counter = Math.floor(Math.random() * 200);
	if (counter == 0) {
		var obstY = Math.floor(Math.random() * 
			(gameCanvas.canvas.height));
		obstX = gameCanvas.canvas.width;
		obstY = obstY - 15;
		obst.push(new component(15, 15, "red",
		 obstX, obstY));
	}
	for (i = 0; i < obst.length; i += 1) {
		obst[i].x += -1;
		obst[i].update();
	}
	obj.newPos();
	obj.update();
}

function up(x) {
    obj.gravitySpeed = x;
}

function right(x) {
    obj.rightSpeed = x;
}