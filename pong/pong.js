var canvas;
var context;
var displayScoreOne;
var displayScoreTwo;

var width;
var height;

var timer;

var KEY_UPARROW = 38;
var KEY_DOWNARROW = 40;

var KEY_W = 87;
var KEY_S = 83;

var topMargin=10;

var paddleOneY=50;
var paddleTwoY=50;
var moveOneY=0;
var moveTwoY=0;
var ballSpeed=9;
var paddle;
var paddleH=50;
var paddleW=10;
var paddleSpeed = 3;
var paddleOneX;
var paddleTwoX;
var ballRad = 6;
var ballDirX = 1;
var ballDirY=1;
var ballX=50;
var ballY;
var playerOneScore=0;
var playerTwoScore=0;
var endGame=[];
	//Player one wins screen
	endGame[0]=new Object();
	endGame[0].text="Player One Wins";
	endGame[0].resetbtn="Play Again";
	endGame[0].isHidden='hidden';
	endGame[0].display='block';
	//Player two wins screen
	endGame[1]=new Object();
	endGame[1].text="Player Two Wins";
	endGame[1].isHidden='visible';
	//reset game
	endGame[2]=new Object();
	endGame[2].display='none';

function clearCanvas() {
	// Store the current transformation matrix
	context.save();

	// Use the identity matrix while clearing the canvas
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Restore the transform
	context.restore();
}

function drawPlayerOne() {
	context.fillStyle="#000";
	paddle = context.fillRect(paddleOneX,paddleOneY,paddleW,paddleH)
	if (paddleOneY+moveOneY+paddleH>height || paddleOneY+moveOneY<0){
		moveOneY=0;
	}
	paddleOneY=paddleOneY+moveOneY;
	context.fillStyle="#0ff";
	paddle = context.fillRect(paddleOneX,paddleOneY,paddleW,paddleH)
}

function drawPlayerTwo() {
	context.fillStyle="#000";
	paddle = context.fillRect(paddleTwoX,paddleTwoY,paddleW,paddleH)
	if (paddleTwoY+moveTwoY+paddleH>height || paddleTwoY+moveTwoY<0){
		moveTwoY=0;
	}
	paddleTwoY=paddleTwoY+moveTwoY;
	context.fillStyle="#0ff";
	paddle = context.fillRect(paddleTwoX,paddleTwoY,paddleW,paddleH)
}

function drawBall() {
	context.fillStyle="#000";
	 context.beginPath();
	 context.arc(ballX,ballY,ballRad,0,2*Math.PI);
	 context.fill();
	 //collision detection for the left and right side of screen
	 if (ballX+ballDirX*ballRad>width ||ballX+ballDirX*ballRad<0){
	 	ballDirX*=-1;
	 	ballX=height/2;
	 }
	 //top and bottom collision detection
	 if (ballY+ballDirY*ballRad>height ||ballY+ballDirY*ballRad<0){
	 	ballDirY*=-1;
	 }
	 //player one paddle detection
	 if (ballY+ballDirY*ballRad>paddleOneY && ballY+ballDirY*ballRad<paddleOneY+paddleH &&
	     ballX+ballDirX*ballRad>paddleOneX && ballX+ballDirX*ballRad<paddleOneX+paddleW){
	 	ballDirX*=-1;
	 }
	 //player two paddle detection
	  if (ballY+ballDirY*ballRad>paddleTwoY && ballY+ballDirY*ballRad<paddleTwoY+paddleH &&
	     ballX+ballDirX*ballRad>paddleTwoX && ballX+ballDirX*ballRad<paddleTwoX+paddleW){
	 	ballDirX*=-1;
	 }	
	 
	 ballX+=ballDirX;
	 ballY+=ballDirY;
	 context.fillStyle="#fff";
	 context.beginPath();
	 context.arc(ballX,ballY,ballRad,0,2*Math.PI);
	 context.fill();
}


function score(){
	if (ballX+ballDirX*ballRad>525){
		playerOneScore=playerOneScore+1;
	}
	if (ballX-ballDirX<=ballRad){
		playerTwoScore=playerTwoScore+1;
	}
	displayScore();
}

function displayScore(){
	document.getElementById("scoreOne").innerHTML=playerOneScore;
	document.getElementById("scoreTwo").innerHTML=playerTwoScore;
}	


function gameLoop() {
	//clear Canvas
	clearCanvas();
	//hide btn
	document.getElementsByName("Return")[0].style.visibility = endGame[0].isHidden;
	document.getElementsByName("Menu")[0].style.visibility = endGame[0].isHidden;
	// Position the player paddles first
	drawPlayerOne();
	drawPlayerTwo();
	//display scores
	score();
	//draw ball
	drawBall();
	//  check to stop play
	if (playerOneScore >= 5){
		clearCanvas();
		document.getElementById("pongOver").innerHTML=endGame[0].text;
		document.getElementById("pongOver").style.display=endGame[0].display;
		document.getElementsByName("Return")[0].value=endGame[0].resetbtn;
		document.getElementsByName("Return")[0].style.visibility = endGame[1].isHidden;
		document.getElementsByName("Menu")[0].style.visibility = endGame[1].isHidden;
		self.clearInterval(timer);
	}
	if(playerTwoScore >=5){
		clearCanvas();
		document.getElementById("pongOver").innerHTML=endGame[1].text;
		document.getElementById("pongOver").style.display=endGame[0].display;
		document.getElementsByName("Return")[0].value=endGame[0].resetbtn;
		document.getElementsByName("Return")[0].style.visibility = endGame[1].isHidden;
		document.getElementsByName("Menu")[0].style.visibility = endGame[1].isHidden;
		self.clearInterval(timer);
	}
}


function onKeyDown(event) {
	//window.alert("onKeyDown " + event.keyCode);
	gameKeyPressed=false;
	switch(event.keyCode){
	//player one controls
	case KEY_UPARROW:
		moveOneY=-paddleSpeed;
		gameKeyPressed=true;
		break;
		
	case KEY_DOWNARROW:
		moveOneY=+paddleSpeed;
		gameKeyPressed=true;
		break;
	//player two controls
	case KEY_W:
		moveTwoY=-paddleSpeed;
		gameKeyPressed=true;
		break;
		
	case KEY_S:
		moveTwoY=+paddleSpeed;
		gameKeyPressed=true;
		break;
		
	}
	 if (gameKeyPressed){
	 	event.preventDefault();
	 }
}

function onKeyUp(event) {
	switch(event.keyCode){
	//player One controls
	case KEY_UPARROW:
		moveOneY=0;
		break;
		
	case KEY_DOWNARROW:
		moveOneY=0;
		break;
	//player two controls
	case KEY_S:
		moveTwoY=0;
		break;
		
	case KEY_W:
		moveTwoY=0;
		break;
	}
}

function OnPress(buttonPressed)
{
	
	//window.alert(buttonPressed);
	//window.alert("page="+page);
	if (buttonPressed == 'A'){
		clearCanvas();
		newGame();
		document.getElementByID("pongOver").style.display = endGame[2].display;
	}
}
function newGame(){
	document.getElementById("pongOver").style.display = endGame[2].display;
	playerOneScore=0;
	playerTwoScore=0;
	drawBall();
	timer = self.setInterval(gameLoop,15);
	return timer;
	return gameLoop();
}	
	

function onLoad() {
	console.log("OnLoad");
	canvas = document.getElementById("theCanvas");
	context = canvas.getContext("2d");

	width=canvas.width;
	height=canvas.height;

	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	document.getElementsByName("Return")[0].style.visability = endGame[0].isHidden;
	document.getElementsByName("Menu")[0].style.visibility = endGame[0].isHidden;
	document.getElementById("pongOver").style.display = endGame[2].display;
	
	paddleOneX=490;
	paddleTwoX=20;
	ballY=width/2;

	return newGame();
	
}