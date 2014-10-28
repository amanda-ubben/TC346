console.log("Hi");

var canvas;
var context;

var width;
var height;

var timer;

var KEY_LEFTARROW = 37;
var KEY_RIGHTARROW = 39;

var levelDefs = [{blockWidth:60, blockHeight:30},
                 {blockWidth:50, blockHeight:25},
                 {blockWidth:40, blockHeight:20},
                 {blockWidth:30, blockHeight:15},
                 {blockWidth:20, blockHeight:10}];
var endOfGame=[];
	//if you win
	endOfGame[0]=new Object();
	endOfGame[0].text="You Win";
	endOfGame[0].resetbtn="Play Again";
	endOfGame[0].isHidden='visible';
	endOfGame[0].display='block';
	//if you lose
	endOfGame[1]=new Object();
	endOfGame[1].text="You Lose";
	endOfGame[1].isHidden='hidden';
	//reset game
	endOfGame[2]=new Object();
	endOfGame[2].display='none';

var leftMargin=10;
var topMargin=10;
var rightMargin=leftMargin;
var blockWidth=20;
var blockHeight=10;
var gap=2;
var blockArea;
var rows;
var cols;
var paddleX=50;
var moveX=0;
var brick;
var ballSpeed=1;
var paddle;
var paddleH=10;
var paddleW=50;
var paddleSpeed = 5;
var paddleY;
var ballRad = 6;
var ballDirX = ballSpeed;
var ballDirY=ballSpeed;
var ballX=50;
var ballY;
var courtBricks;
var score=0;
var lives=3;
var level;
var totalBlocks;
var SND_NEWLEVEL;
var SND_GAMEOVER;
var SND_WIN;
var SND_BLOCKHIT;
var SND_NEWBALL;

/*
 * Clear the Canvas for a new paint.
 */
function clearCanvas() {
	// Store the current transformation matrix
	context.save();

	// Use the identity matrix while clearing the canvas
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Restore the transform
	context.restore();
}


/*
 * Draw a single brick based on presence or absence.
 */
function drawBrick(r,c){
	brickX=leftMargin+(blockWidth+gap)*c;
	brickY=topMargin+(blockHeight+gap)*r;
	
	if (courtBricks[r][c]){
		context.fillStyle="#f00";
	}
	else{
		context.fillStyle="#000";
	}
	brick=context.fillRect(brickX,brickY,blockWidth,blockHeight);
	
}

/*
 * Draw the initial court.
 */
function drawCourt() {
	
	var x_offset=leftMargin;
	var y_offset=topMargin;
	for (var r = 0; r < rows; r = r + 1) {	
		x_offset = leftMargin;
		for(var c = 0; c < cols; c = c + 1) {
			drawBrick(r,c);
			x_offset= (x_offset+blockWidth)+gap;
		}
		y_offset= (y_offset+blockHeight)+gap;		
	}
	
}

/*
 * Draw the Ball in the new position and check to see if collided with anything.
 */
function drawBall() {
	 // Erase the ball from the previous location.
	 // Had to add 1 to the radius to ensure the previous location was erased properly.
	 context.fillStyle="#000";
	 context.beginPath();
	 context.arc(ballX,ballY,ballRad+1,0,2*Math.PI);
	 context.fill();
	 
	 // Figure out the Ball's next location and its edges for collision detection
	 ballX+=ballDirX;
	 ballY+=ballDirY;
	 ballTop = ballY - ballRad;
	 ballBottom = ballY + ballRad;
	 ballLeft = ballX - ballRad;
	 ballRight = ballX + ballRad;
	 
	 //left and right wall detection
	 if (ballLeft<0 || ballRight>width){
	 	ballDirX*=-1;
	 }
	 //top wall detection
	 if (ballTop<=0){
	 	ballDirY*=-1;
	 }
	 //bottom wall detection
	 if (ballBottom>height){
	 	return false;  // Hit bottom wall - game not in play
	 }
	 //paddle detection
	 if (ballBottom>paddleY && ballTop<paddleY+paddleH &&
	     ballRight>paddleX  && ballLeft<paddleX+paddleW) {
	 	ballDirY*=-1;
		if (ballX<paddleX || ballX>paddleX+paddleW) {
			// Hit the side of the paddle - change sideways direction
			ballDirX*=-1;
		}
		playSound(SND_BLOCKHIT);
	 }
	 //block area detection
	 if (ballTop<=blockArea && ballBottom>=topMargin &&
	 	 ballLeft<=width-rightMargin && ballRight>=leftMargin){
	 	//Detect Top of Ball hitting Bottom of Brick
	 	if (ballTop>=topMargin+blockHeight-ballSpeed &&
	 		ballX>=leftMargin && ballX<=width-rightMargin) {
	 		c=Math.floor((ballX-leftMargin)/(blockWidth+gap));
	 		r=Math.floor((ballTop-topMargin)/(blockHeight+gap));
	 		if (courtBricks[r][c]) {
	 			courtBricks[r][c]=false;
	 			score+=5;
	 			displayScore();
	 			totalBlocks--;
	 			if (totalBlocks==0) {
	 				return false;
	 			}
	 			drawBrick(r,c);
	 			ballDirY*=-1;
	 			playSound(SND_BLOCKHIT);
	 		}
	 	}
	 	// Detect Bottom of Ball hitting Top of Brick
	 	if (ballBottom<=blockArea-blockHeight+ballSpeed &&
	 		ballX>=leftMargin && ballX<=width-rightMargin) {
	 		c=Math.floor((ballX-leftMargin)/(blockWidth+gap));
	 		r=Math.floor((ballBottom-topMargin)/(blockHeight+gap));
	 		if (courtBricks[r][c]) {
	 			courtBricks[r][c]=false;
	 			score+=5;
	 			displayScore();
	 			totalBlocks--;
	 			if (totalBlocks==0) {
	 				return false;
	 			}
	 			drawBrick(r,c);
	 			ballDirY*=-1;
	 			playSound(SND_BLOCKHIT);
	 		}
	 	}
	 	
	 	// Detect Left Side of Ball hitting Right side of Brick
	 	if (ballLeft>=width-rightMargin-blockWidth+ballSpeed &&
	 		ballY>=topMargin && ballY<=blockArea) {
	 		c=Math.floor((ballLeft-leftMargin)/(blockWidth+gap));
	 		r=Math.floor((ballY-topMargin)/(blockHeight+gap));
	 		if (courtBricks[r][c]) {
	 			courtBricks[r][c]=false;
	 			score+=5;
	 			displayScore();
	 			totalBlocks--;
	 			if (totalBlocks==0) {
	 				return false;
	 			}
	 			drawBrick(r,c);
	 			ballDirX*=-1;
	 			playSound(SND_BLOCKHIT);
	 		}
	 	}
	 	
	 	// Detect Right Side of Ball hitting Left side of Brick
	 	if (ballRight>=leftMargin+blockWidth-ballSpeed &&
	 		ballY>=topMargin && ballY<=blockArea) {
	 		c=Math.floor((ballRight-leftMargin)/(blockWidth+gap));
	 		r=Math.floor((ballY-topMargin)/(blockHeight+gap));
	 		if (courtBricks[r][c]) {
	 			courtBricks[r][c]=false;
	 			score+=5;
	 			displayScore();
	 			totalBlocks--;
	 			if (totalBlocks==0) {
	 				return false;
	 			}
	 			drawBrick(r,c);
	 			ballDirX*=-1;
	 			playSound(SND_BLOCKHIT);
	 		}
	 	}
	 	
	 }

	 // Draw the ball in the new location
	 context.fillStyle="#fff";
	 context.beginPath();
	 context.arc(ballX,ballY,ballRad,0,2*Math.PI);
	 context.fill();

	 return true;  // Game still in play
}


/*
 * Draw the player paddle on the screen
 */
function drawPlayer() {
	context.fillStyle="#000";
	paddle = context.fillRect(paddleX,paddleY,paddleW,paddleH)
	if (paddleX+moveX+paddleW>width || paddleX+moveX<0){
		moveX=0;
	}
	paddleX=paddleX+moveX;
	context.fillStyle="#00f";
	paddle = context.fillRect(paddleX,paddleY,paddleW,paddleH)
}

/*
 * When key is pressed move the paddle.
 */
function onKeyDown(event) {
	//window.alert("onKeyDown " + event.keyCode);
	switch(event.keyCode){
	case KEY_LEFTARROW:
		moveX=-paddleSpeed;
		break;
		
	case KEY_RIGHTARROW:
		moveX=+paddleSpeed;
		break;
		
	}
}

/*
 * When key is let up stop moving the paddle.
 */
function onKeyUp(event) {
	switch(event.keyCode){
	case KEY_LEFTARROW:
		moveX=0;
		break;
		
	case KEY_RIGHTARROW:
		moveX=0;
		break;
	}
}


/*
 * Main game loop to move the ball and paddle.
 * Also handles the end of the life, end of game, and completion of level.
 */
function gameLoop() {
	//hide btn
	document.getElementsByName("Return")[0].style.visibility = endOfGame[1].isHidden;
	document.getElementsByName("Menu")[0].style.visibility = endOfGame[1].isHidden;
	// Position the player paddle first
	drawPlayer();
	
	// Position the ball and check to stop play
	if (!drawBall()) {
		self.clearInterval(timer);
		if (totalBlocks<=0) {
			// Finished Level
			level++;
			if (level >= levelDefs.length) {
				// Finished Game
				//window.alert("YOU WIN!");
				document.getElementById("breakOver").innerHTML=endOfGame[0].text;
				document.getElementById("breakOver").style.display=endOfGame[0].display;
				document.getElementsByName("Return")[0].value=endOfGame[0].resetbtn;
				document.getElementsByName("Return")[0].style.visibility = endOfGame[0].isHidden;
				document.getElementsByName("Menu")[0].style.visibility = endOfGame[0].isHidden;
				playSound(SND_WIN);
			}
			else {
				// Play next level
				newLevel();
				playSound(SND_NEWLEVEL);
				
			}
		}
		else {
			// Died - need new life
			lives--;
			if(lives<=0){
				//game over
				//window.alert("GAME OVER!");
				document.getElementById("breakOver").innerHTML=endOfGame[1].text;
				document.getElementById("breakOver").style.display=endOfGame[0].display;
				document.getElementsByName("Return")[0].value=endOfGame[0].resetbtn;
				document.getElementsByName("Return")[0].style.visibility = endOfGame[0].isHidden;
				document.getElementsByName("Menu")[0].style.visibility = endOfGame[0].isHidden;
				playSound(SND_GAMEOVER);
			}
			else{
				//new life
				dropNewBall();
				playSound(SND_NEWBALL);
				
			}
		}
	}
}

/*
 * Display the current score.
 */
function displayScore(){
	document.getElementById("breakoutScore").innerHTML="Score: " + score;
}

/*
 * Display the number of lives remaining.
 */
function displayLives(){
	document.getElementById("showLives").innerHTML="Lives: " + lives;
}


/*
 * Drop a New Ball and start playing.
 */
function dropNewBall(){
	displayLives();
	ballX=Math.floor(Math.random()*(width*3/5))+width*1/5;
	ballY=blockArea+gap+ballRad+blockHeight;
	timer = self.setInterval(gameLoop,15);
	return timer;
}

/*
 * Start a new level.
 */
function newLevel(){
	blockHeight = levelDefs[level].blockHeight;
	blockWidth = levelDefs[level].blockWidth;

	blockArea=height*(1/3);
	rows=Math.floor((blockArea-topMargin)/(blockHeight+gap));
	cols=Math.floor((width-leftMargin)/(blockWidth+gap));
	totalBlocks=rows*cols;
	leftMargin = (width-((blockWidth+gap)*cols)+gap)/2;
	blockArea=topMargin+rows*blockHeight+(rows-1)*gap;
	console.log(rows);
	paddleY=height-topMargin-paddleH-paddleH;
	courtBricks=new Array(r);
	for (var r = 0; r < rows; r = r + 1) {
		courtBricks[r]=new Array(c);	
		for(var c = 0; c < cols; c = c + 1) {
			courtBricks[r][c]=true;
		}
				
	}
	lives=3;
	displayLevels();
	clearCanvas();
	displayScore();
	drawCourt();
	return dropNewBall();

	
}
function OnPress(buttonPressed)
{
	
	//window.alert(buttonPressed);
	//window.alert("page="+page);
	if (buttonPressed == 'A'){
		clearCanvas();
		newGame();
		document.getElementById("breakOver").style.display = endOfGame[2].display;
	}
}
/*
 *Display Level
 */
 function displayLevels(){
 	document.getElementById("showLevels").innerHTML="Level: " + (level +1);
 }

/*
 * Start a new Game.
 */
function newGame(){
	score=0;
	lives=3;
	level=0;
	return newLevel();
}
//Load Sounds
function loadSound(url) {
    var s = new Audio();
    s.src = url;
    s.load();
    return s;
}
//Play sounds
function playSound(s) {
    try {
        // Reset the sound
        s.currentTime = 0;
        s.play();
    } catch (e) {
        // Ignore invalid state error on iOS if loading has not succeeded yet
    }
}

function onLoad() {
	console.log("OnLoad");
	canvas = document.getElementById("breakoutCanvas");
	context = canvas.getContext("2d");
	width=canvas.width;
	height=canvas.height;
	SND_NEWLEVEL=loadSound("newLevel.wav");
	SND_GAMEOVER=loadSound("gameOver.wav");
	SND_WIN=loadSound("win.wav");
	SND_BLOCKHIT=loadSound("blockHit.wav");
	SND_NEWBALL=loadSound("newBall.wav");
	
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	document.getElementsByName("Return")[0].style.visibility = endOfGame[1].isHidden;
	document.getElementsByName("Menu")[0].style.visibility = endOfGame[1].isHidden;
	document.getElementById("breakOver").style.display = endOfGame[2].display;
	

	return newGame();
	
}

