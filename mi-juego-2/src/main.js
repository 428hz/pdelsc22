let score = 0;
const hero = {
    x: 300,
    y: 400
}

const enemies = [{x: 50, y:50},{x: 250, y:50}, {x: 450, y:250}, {x: 550, y:250}];

let bullets = [];

function displayHero(){
    document.getElementById('hero').style.top = hero.y + "px";
    document.getElementById('hero').style.left = hero.x + "px";
}

function displayEnemies(){
    let output = '';
    for(let i=0; i<enemies.length; i++){
        output += `<div class='enemy1' style='top:${enemies[i].y}px; left:${enemies[i].x}px;'></div>`;
    }
    document.getElementById('enemies').innerHTML = output;
}

function moveEnemies(){
    for(let i=0; i<enemies.length; i++){
        enemies[i].y += 5;

        if(enemies[i].y > 540){
            enemies[i].y = 0;
            enemies[i].x = Math.random()*500;
        }
    }
}

function moveBullets(){
    for(let i=0; i<bullets.length; i++){
        bullets[i].y -= 5;

        if (bullets[i].y < 0){
            bullets.splice(i, 1); // Método más simple para eliminar la bala
        }
    }
}

function displayBullets(){
    let output = '';
    for(let i=0; i<bullets.length; i++){
        output += `<div class='bullet' style='top:${bullets[i].y}px; left:${bullets[i].x}px;'></div>`; 
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
    for(let i = bullets.length - 1; i >= 0; i--){
        for(let j = enemies.length - 1; j >= 0; j--){
            const bullet = bullets[i];
            const enemy = enemies[j];
            if( Math.abs(bullet.x - enemy.x) < 15 && Math.abs(bullet.y - enemy.y) < 15) {
                score += 10;
                enemies.splice(j, 1); // Elimina el enemigo
                bullets.splice(i, 1); // Elimina la bala
                break; // Sal del bucle interno ya que la bala fue eliminada
            }
        }		
    }
}

setInterval(gameLoop, 20);

document.onkeydown = function(a) {
    if(a.keyCode == 37){ hero.x -= 10; }
    else if(a.keyCode == 39){ hero.x += 10; }
    if(a.keyCode == 38){ hero.y -= 10; }
    else if (a.keyCode == 40){ hero.y += 10; }
    else if (a.keyCode == 32){
        bullets.push({x: hero.x+6, y: hero.y-15});
    }
    displayHero();
}

displayHero();
displayEnemies();