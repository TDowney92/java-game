


// make the game canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
document.body.appendChild(canvas);

//backgroud image sprite
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "css/game-sprite/game-sprite-bg.png";

// hero sprite
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "css/game-sprite/game-sprite-1.png.png";

// cookie sprite
var cookieReady = false;
var cookieImage = new Image();
cookieImage.onload = function () {
	cookieReady = true;
};
cookieImage.src = "css/game-sprite/game-sprite-2.png.png";

// insert game sprite and objects
var hero = {
	speed: 220, //movment for pixles per second
	x:0,
	y:0
};

var cookie = { // cookie sprite
	x:0,
	y:0
};

var cookiesCaught = 0; // # of cookies caught

// player input stuff
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// the timmer for the game

function Stop(interval) {
	clearInterval(interval);
}

this.Start = function() {
	score.innerHTML = "0";
	var interval = setInterval(Spawn, 750);

	var count = 45;
	var counter = null;

	function timer()
	{
		count = count-1;
		if (count <= 0)
		{
			var left = document.querySelectorAll("section#game .gem");

			for (var i = 0; i < left.length; i++) {
				if(left[i] && left[i].parentNode) {
					left[i].parentNode.removeChild(left[i]);
				}
			}
			Stop(interval);
			Stop(counter);
			time.innerHTML = "Game Over, Cookies Win !"
			start.style.display = "block";

			UpdateScore();

			return;
		}else {
			time.innerHTML = count + "s left";
		}
	}
	counter = setInterval(timmer, 1000);

	setTimeout( function(){
		Stop(interval);
	}, count * 1000)
};


// displaying the scores
function HighScores() {
	if(typeof(Storage)!=="underfined"){
		var scores = false;
		if(localStorage["high-scores"]) {
			high_scores.style.display = "block";
			high_scores.innerHTML = '';
		}
	} else {
		high_scores.style.display = "none"
	}
}

// show highschore in order

function HighScores() {
	if(typeof(Storage)!=="undefined"){
		var scores = false;
		if(localStorage["high-scores"]) {
			high_scores.style.display = "block";
			high_scores.innerHTML = '';
			scores = JSON.parse(localStorage["high-scores"]);
			scores = scores.sort(function(a,b){return parseInt(b)-parseInt(a)});

			for(var i = 0; i < 10; i++){
				var s = scores[i];
				var fargment = document.createElement('li');
				fragment.innerHTML = (typeof(s) != "underfined" ? s : "" );
			}
		}
	} else {
		high_scores.style.display = "none";
	}
}

// restarting the game when user catches cookie
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// place cookie somewhere random
	cookie.x = 32 + (Math.random() * (canvas.width - 64));
	cookie.y = 32 + (Math.random() * (canvas.height - 64));
};


// update game objects
var update = function (modifier) {
	if (38 in keysDown) { // player holding up key
		hero.y -=hero.speed * modifier;
	}
	if (40 in keysDown) {// player holding down key
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) {// player holding left key
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) {// player holding right key
		hero.x += hero.speed * modifier;
	}

	// are they touching?
	if (
		hero.x <= (cookie.x + 32)
		&& cookie.x <= (hero.x + 32)
		&& hero.y <= (cookie.y +32)
		&& cookie.y <= (hero.y + 32)
	) {
		++cookiesCaught;
		reset();
	}
};

// draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y, 100,100);
	}

	if (cookieReady) {
		ctx.drawImage(cookieImage, cookie.x, cookie.y, 100,100);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250,250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText(" Cookies Caught: " + cookiesCaught, 32, 32);
};

// main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// request to do this agian ASAP
	requestAnimationFrame(main);
}

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// lets play !!
var then = Date.now();
reset();
main();
