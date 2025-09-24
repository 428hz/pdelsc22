var score = 0;
var hero = {   // the brackets indicate a javascript object
		x: 300,
		y: 400
	}

var enemies = [{x: 50, y:50},{x: 250, y:50}, {x: 450, y:250}, {x: 550, y:250}];  // in this array, we actually have three javascript objects, storing the coordinates of enemies

var bullets = [];

function displayHero(){ // lets create something to show our hero
	document.getElementById('hero').style['top'] = hero.y + "px"; // this says, take the DOM with #hero, and goto it's style attribute, and take whatever the y variable above is in hero (in this case 300), and add px to that and stick that into the style tag. This moves the entire hero to that particular position.
	document.getElementById('hero').style['left'] = hero.x + "px";
}

function displayEnemies(){
	var output = ''; // create an empty variable called output
	for(var i=0; i<enemies.length; i++){ // this creates afor loop that says go through the enemies array and do the following
		output += "<div class='enemy1' style='top:"+enemies[i].y+"px; left:"+enemies[i].x+"px;'></div>"; // this div tag came from the initial design, but we modified the left and top style variables so that the values from the enemies array above is displayed instead. This takes what was a static image, stores the positions of each enemy into an array, and then calls that array and writes out the images. This essentially turned our image of enemies into objects we can now manipulate.
	}
	document.getElementById('enemies').innerHTML = output; //replace the innerHTML with your new ouput (which includes our enemies' coordinates)
	// console.log(output);
}

function moveEnemies(){
	for(var i=0; i<enemies.length; i++){
		enemies[i].y += 5;

		if(enemies[i].y > 540){
			enemies[i].y = 0;
			enemies[i].x = Math.random()*500;
		}
	}
}

function moveBullets(){
	for(var i=0; i<bullets.length; i++){
		bullets[i].y -= 5;

		if (bullets[i].y<0){
			bullets[i] = bullets[bullets.length-1];
			bullets.pop();
		}
		// 1, 2, 10 ..
		// if I want to get rid of 1, one method is:
		// 10, 2, 10 [pop 10] --> 10, 2, ...
	}
}


function displayBullets(){
	var output = '';
	for(var i=0; i<bullets.length; i++){
		output += "<div class='bullet' style='top:"+bullets[i].y+"px; left:"+bullets[i].x+"px;'></div>"; 
		}
		document.getElementById('bullets').innerHTML = output;
	}
	
function displayScore(){
	document.getElementById('score').innerHTML = score;	
}

function gameLoop(){
	displayHero();
	moveEnemies();
	displayEnemies();
	moveBullets();
	displayBullets();
	detectCollision();
	displayScore();
}

function detectCollision(){
	for(var i=0; i<bullets.length; i++){
		for(var j=0; j<enemies.length; j++){

			if( Math.abs(bullets[i].x - enemies[j].x) < 10 && Math.abs(bullets[i].y - enemies[j].y) < 10) {
				console.log('bullet', i, 'and enemy',j, 'collided');
				score += 10;
			}
		}		
	}
};
 
setInterval(gameLoop, 20); // this says to run gameLoop every 100ms

document.onkeydown = function(a) {  // this variable sends to the browser back
	// console.log(a.keyCode); //written as 'variableName.keyCode'
	if(a.keyCode == 37){ // key left
		hero.x -= 10; // this then changes the hero variable itself, moving our entire hero. We do this below for all directions along the x and y axis (up, down,left, right - in this case, Left).
	} else if(a.keyCode == 39){ // key right
		hero.x += 10;
	}
	if(a.keyCode == 38){ // key up
		hero.y -= 10;
	} else if (a.keyCode == 40){ // key down
		hero.y += 10;
	} else if (a.keyCode == 32){ // space bar
		bullets.push({x: hero.x+6, y: hero.y-15});
		displayBullets();
	}
	displayHero(); // make sure you call your initial function so it is drawn
}

displayHero(); // draws hero -- notice, these are outside of any of our functions
displayEnemies(); // draws enemies