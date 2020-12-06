//creating the variables
var figure, figureImage;
var ghost, ghostImage;
var ground;
var bg, bgImage;
var obstacle, obstaclesGroup;
var plain, plainImage;
var score,highscore;
var gameState = "serve";
var arrow, arrowImage;
var icon, iconImage;
var play, playImage;
var keey, keyImage;
var gameOver, gameOverImage;
var restart, restartImage;
var backMusic;
var energ,eimg,spawnenergy,fg;
var EnergyScore=0;
var man,mi;
var won,wi
function preload() {
 
//loading animations, sounds and images  
  
  figureImage = loadAnimation("figure1.png","figure2.png");
  
  ghostImage = loadImage("ghost.png");
  
  eimg=loadImage("fit.jpg");
  
  bgImage = loadImage("background.jpg");
  
  mi=loadAnimation("clipart-man-runner-3.png","unnamed.png");
  
  plainImage = loadImage("plane.png");
  
  arrowImage = loadImage("arrow.png");
  
  iconImage = loadImage("name.png");
  
  playImage = loadImage("play.png");
  
  keyImage = loadImage("key.png");
  
  gameOverImage = loadImage("gameover.png");
  
  restartImage = loadImage("restart.png");
  
  wi = loadImage("win.png");
  
  backMusic = loadSound("music.mp3");
}

function setup() {
  createCanvas(800,600);
  
  //creating background
  bg = createSprite(600,300,10,10);
  bg.scale = 1.5;
  bg.addImage("bg",bgImage);

  //creating the stick figure
  figure = createSprite(100,350,10,10);
  figure.scale = 0.15;
  figure.addAnimation("figure_new",figureImage);
  figure.addAnimation("figure_man",mi);
  
  figure.setCollider("rectangle",0,0,500,800)
  
  //creating the plane
  plain = createSprite(-50,100,10,10);
  
  //creating the ghost 
  ghost = createSprite(200,200,10,10);
  ghost.addImage("ghost",ghostImage);
  ghost.scale = 0.7;
  ghost.visible = false;
  
  //creating the ground
  ground = createSprite(500,410,1000,15);
  ground.shapeColor = "black";
  
  //creating the up arrow icon
  arrow = createSprite(150,530,10,10);
  arrow.scale = 0.3;
  arrow.addImage("arrow",arrowImage);
  arrow.visible = false;
  
  //creating the 'use up arrow to jump'
  keey = createSprite(200,450,10,10);
  keey.scale = 0.6;
  keey.addImage("key",keyImage);
  keey.visible = false;
  
  //creating the 'stick running' before the game starts
  icon = createSprite(400,180,10,10)
  icon.addImage("icon",iconImage);
  icon.visible = false;
  
  //creating the 'click here to play'
  play = createSprite(400,250,10,10);
  play.scale = 0.7;
  play.addImage("play",playImage);
  play.visible = false;
  
  //creating the 'game over'
  gameOver = createSprite(400,200,10,10);
  gameOver.addImage("gameover",gameOverImage);
  gameOver.visible = false;
  
  //creating the 'click here to restart'
  restart = createSprite(400,270,10,10);
  restart.scale = 0.8;
  restart.addImage("restart",restartImage);
  restart.visible = false;
  
  won = createSprite(400,400,10,10);
  won.scale = 0.3;
  won.addImage("winner",wi);
  won.visible = false;
  
  //creating the obstacle group
  obstaclesGroup = createGroup();
  fg= createGroup();
  //playing the background music
  backMusic.loop();
  score=0;
  highscore=0;
}

function draw() {
  background(220);
  
     if (gameState === "serve") {
        //displaying the gamescreen before it has started
        icon.visible = true;
        play.visible = true;
        
    
    //starting the game once the user 
     if (mousePressedOver(play)) {
        gameState = "play";
    }
     }
     if (gameState === "play"){ 
  
      if(bg.x<200){
         bg.x = 600;
      }
      bg.velocityX = -(5 + 3* score/200);
    
    //setting the score
    score = score + Math.round(getFrameRate()/60);
    
    //spawning the obstacles
    obstacles();
    food();
      
      if (fg.isTouching(figure)){
           fg.destroyEach();
          EnergyScore=EnergyScore+2;
       }
      if (EnergyScore>=10){
          figure.changeAnimation("figure_man");
          figure.scale=0.10;
      }
      if (EnergyScore>=20){
          figure.scale=0.12;
      }
      if (EnergyScore>=30){
          figure.scale=0.14;
      }
      if (EnergyScore>=40){
          figure.scale=0.16;
      }
      if (EnergyScore>=50){
          won.visible=true;
          gameState="end";
          
      }
      
    //making the stickman jump if user presses up arrow key
    if (keyDown(UP_ARROW)&&figure.y>230&&frameCount % 1 === 0) {
        figure.velocityY = -15;
      
    }
    
    
    //adding gravity to the stickman
    figure.velocityY = figure.velocityY+0.7;
    
    //displaying the play gamestate objects
    arrow.visible = true;
    keey.visible = true;
    icon.visible = false;
    play.visible = false;
    gameOver.visible = false;
    restart.visible = false;
    ghost.visible = false;
    
    //ending the game if stickman collides with the obstacle
    if (figure.isTouching(obstaclesGroup)) {
      gameState = "end";
    }
  }
  
  if (gameState === "end") 
  {
    //making the background static if the game ends
    bg.velocityX = 0;
    figure.scale=0.15;
    //destroying obstacles on collision
    obstaclesGroup.destroyEach();
    fg.destroyEach();
    ////displaying the end screen objects
    figure.visible = false;
    
    arrow.visible = false;
    keey.visible = false;
    gameOver.visible = true;
    restart.visible = true;
   
     if(EnergyScore<50){
        ghost.visible = true;
        }
    //restarting the game once the user presses restart    
    if (mousePressedOver(restart)) {
     reset();
    }
  }
  
  //drawing the sprites
  drawSprites();
  
  //making the stickman collide with the ground
  figure.collide(ground);

  //displaying the score
  textFont("fantasy");
  textSize(25);
  fill("black");
  text("SCORE : "+score,600,30);
  text("Energy : "+EnergyScore,100,30);
   text("/50",210,30)
}

function obstacles() {
  //spawining obstacles at random positions
  if (frameCount % 100 === 0) {
    obstacle = createSprite(800,Math.round(random(250,390)),50,50);
    obstacle.velocityX = -(5 + score/100);
    obstacle.shapeColor = "red";
    obstacle.lifetime = 150;
    obstaclesGroup.add(obstacle);
  }}
  function food(){
  if(frameCount % 150 === 0){
    //banana.y = Math.round(random(120,200));
    banana = createSprite(400,150,20,20);
    banana.addImage(eimg);
    banana.scale = 0.2;
    banana.velocityX = -3;
    banana.lifetime = 110;
    fg.add(banana); 
  }
  
  //spawning the plane after every 700 frames
  if (frameCount % 700 === 0) {
    plain.y = 100
    plain.width = 10;
    plain.height = 10;
    plain.velocityX = 15;
    plain.scale = 0.3
    plain.addImage("plain",plainImage)
    plain.lifetime = 50;
    plain.depth = figure.depth-1;
  }
}


//resetting the game after user presses restart in the end state
function reset() {
  figure.scale=0.15;
  score = 0;
  EnergyScore=0;
  gameState = "play";
  figure.visible = true;
  plain.visible = true;
  won.visible=false;
  figure.changeAnimation("figure_new");
}