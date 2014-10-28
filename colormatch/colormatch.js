console.log("Hi")



var colorList=[];
	colorList[0]= new Object();
	colorList[0].text="Red";
	colorList[0].textColor="red";
	colorList[0].textSize="200px";
	colorList[1]= new Object();
	colorList[1].text="Green";
	colorList[1].textColor="green";
	colorList[2]= new Object();
	colorList[2].text="Blue";
	colorList[2].textColor="blue";
	colorList[3]= new Object();
	colorList[3].text="White";
	colorList[3].textColor="white";
var colors;
var colorPick = "None";
var KEY_LEFTARROW = 37;
var KEY_RIGHTARROW = 39;
var KEY_UPARROW = 38;
var KEY_DOWNARROW = 40;
var score=0;
var endGame=[];
	endGame[0]=new Object();
	endGame[0].text="You Win";
	endGame[0].textColor="white";
	endGame[0].textSize="100px";
	endGame[1]=new Object();
	endGame[1].text="You Lose";
	endGame[2]=new Object();
	endGame[2].text="Play Again";
	endGame[2].isHidden='hidden';
	endGame[2].isVisible='visible';
	

//Picks a random color
function randomColor(){
	colors=Math.floor(Math.random()*colorList.length);
	console.log(colorList[colors]);
	if(colorList[colors]==colorList[0]){
		displayColorText = colorList[0].text;
		displayColor = colorList[0].textColor;
	}
	else if(colorList[colors]==colorList[1]){
		displayColorText = colorList[1].text;
		displayColor = colorList[1].textColor;
	}
	else if(colorList[colors]==colorList[2]){
		displayColorText = colorList[2].text;
		displayColor = colorList[2].textColor;
	}
	else if(colorList[colors]==colorList[3]){
		displayColorText = colorList[3].text;
		displayColor = colorList[3].textColor;
	}
	
	document.getElementById("colorText").innerHTML=displayColorText;
	document.getElementById("colorText").style.color=displayColor
	document.getElementById("colorText").style.fontSize=colorList[0].textSize;

}

function onKeyDown(event) {
	//window.alert("onKeyDown " + event.keyCode);
	gameKeyPressed=false;
	switch(event.keyCode){
	//red key
	case KEY_LEFTARROW:
		colorPick=colorList[0];
		gameKeyPressed=true;
		break;
	//green key	
	case KEY_UPARROW:
		colorPick=colorList[1];
		gameKeyPressed=true;
		break;
	//blue key	
	case KEY_RIGHTARROW:
		colorPick=colorList[2];
		gameKeyPressed=true;
		break;
	//white key	
	case KEY_DOWNARROW:
		colorPick=colorList[3];
		gameKeyPressed=true;
		break;
		
	}
	//Triggers the test to pick a new color
	if (gameKeyPressed){
		console.log(colorPick);
		colorTest();
		event.preventDefault();
	}
}

function onKeyUp(event) {
	switch(event.keyCode){
	case KEY_LEFTARROW:
		colorPick="None";
		break;
		
	case KEY_RIGHTARROW:
		colorPick="None";
		break;
		
	case KEY_UPARROW:
		colorPick="None";
		break;
		
	case KEY_DOWNARROW:
		colorPick="None";
		break;
	}
}
//selects a new color when color test is checked
function newColor(){
	randomColor();
	timer = self.setTimeout(gameTimeout,5000);
	document.getElementsByName("Return")[0].style.visibility = endGame[2].isHidden;
	document.getElementsByName("Menu")[0].style.visibility = endGame[2].isHidden;
}
//tests for the matching colors
function colorTest(){
	if(colorPick==colorList[colors]){
		console.log("GREAT");
		self.clearTimeout(timer);
		score+=100;
		
	}
	else{
		console.log("FAIL");
		score-=100;
	}
	newColor();
	displayScore();
	endOfGame();
}
//ends game when max or min score is reached
function endOfGame(){
	if (score >= 2000){
		displayScore();
		document.getElementById("colorText").innerHTML=endGame[0].text;
		document.getElementById("colorText").style.color=endGame[0].textColor;
		document.getElementById("colorText").style.fontSize=endGame[0].textSize;
		document.getElementsByName("Return")[0].value=endGame[2].text;
		document.getElementsByName("Return")[0].style.visibility = endGame[2].isVisible;
		document.getElementsByName("Menu")[0].style.visibility = endGame[2].isVisible;
	}
	if (score<= -1000){
		displayScore();
		document.getElementById("colorText").innerHTML=endGame[1].text;
		document.getElementById("colorText").style.color=endGame[0].textColor;
		document.getElementById("colorText").style.fontSize=endGame[0].textSize;
		document.getElementsByName("Return")[0].value=endGame[2].text;
		document.getElementsByName("Return")[0].style.visibility = endGame[2].isVisible;
		document.getElementsByName("Menu")[0].style.visibility = endGame[2].isVisible;
	}
	self.clearTimeout(timer);
}
		
//displays score
function displayScore(){
	document.getElementById("CMScore").innerHTML=score;
}
//if a choice is not made within the time key press is tested
function gameTimeout() {
	console.log("timeout");
	colorTest();
}
//replay button
function OnPress(buttonPressed)
{
	
	//window.alert(buttonPressed);
	//window.alert("page="+page);
	if (buttonPressed == 'A'){
		score=0;
		displayScore();
		newGame();
	}
}
//starts a new game
function newGame(){
	newColor();
}
	

function onLoad() {
	console.log("OnLoad");

	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	newColor();
	displayScore();
	return timer;
	
}