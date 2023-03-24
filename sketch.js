var PLAY = 1;
var END = 0;
var gameState = PLAY;

var forest, forestImg;
var invisibleGround;
var runner, mainRunnerImg1, runner_collided;
var villan, villanImg1;

var obstacle, stoneImg1;
var obstaclesGroup, rock1;
var villianStopped;
var score = 0;

var gameOver, restart;

function preload() {
  forestImg = loadImage("forest.png");

  mainRunnerImg1 = loadAnimation(
    "mainRunner1.png",
    "mainRunner2.png",
    "mainRunner3.png",
    "mainRunner4.png"
  );
  runner_collided = loadImage("runner_fallen-removebg-preview.png");

  villanImg1 = loadAnimation(
    "villan1.png",
    "villan2.png",
    "villan3.png",
    "villan4.png",
    "villan5.png",
    "villan6.png",
    "villan7.png",
    "villan8.png",
    "villan9.png",
    "villan10.png",
    "villan11.png",
    "villan12.png"
  );
  villianStopped = loadAnimation("villan12.png");

  rock1 = loadImage("rock1.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(1000, 600);
  forest = createSprite(450, 250);
  forest.addImage("forest", forestImg);
  forest.x = forest.width / 2;
  forest.velocityX = -(6 + (3 * score) / 100);

  runner = createSprite(325, 515);
  runner.addAnimation("girlRunning", mainRunnerImg1);
  runner.addAnimation("girlFallen", runner_collided);
  runner.scale = 2.5;

  villan = createSprite(115, 515);
  villan.addAnimation("villanRunning", villanImg1);
  villan.addAnimation("villianStopped", villianStopped);
  villan.scale = 0.8;

  gameOver = createSprite(500, 300);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(500, 340);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;

  invisibleGround = createSprite(550, 590, 550, 10);
  invisibleGround.visible = false;

  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background(225);
  if (forest.x > 450) {
    forest.x = 300;
  }
  if (gameState === PLAY) {
    score = score + Math.round(frameCount % 30 == 0);
    forest.velocityX = -(6 + (3 * score) / 100);

    if ((touches.length > 0 || keyDown("space")) && runner.y >= 159) {
      runner.velocityY = -12;
      touches = [];
    }
    if (forest.x < 0) {
      forest.x = forest.width / 2;
    }

    runner.velocityY = runner.velocityY + 0.8;

    spawnObstacles();

    if (obstaclesGroup.isTouching(runner)) {
      gameState = END;
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    forest.visible = true;
    forest.velocityX = 0;
    runner.velocityX = 0;
    villan.velocityX = 0;
    obstaclesGroup.setVelocityEach(0);
    villan.changeAnimation("villianStopped");
    runner.changeAnimation("girlFallen", runner_collided);
    runner.scale = 1.5;
    obstaclesGroup.setLifetimeEach(-1);

    if (touches.length > 0 || keyDown("SPACE") || mousePressedOver(restart)) {
      reset();
      touches = [];
    }
  }
  runner.collide(invisibleGround);

  drawSprites();

  textSize(20);
  fill("white");
  text("Score:" + score, 50, 200);
}

function spawnObstacles() {
  if (frameCount % 100 === 0) {
    var obstacle = createSprite(850, 575, 10, 40);
    obstacle.setCollider("circle", 0, 0, 45);
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1:
        obstacle.addImage(rock1);
        obstacle.scale = 0.2;
        break;

      case 2:
        obstacle.addImage(rock1);
        obstacle.scale = 0.2;
        break;

      default:
        break;
    }
    obstacle.velocityX = -(6 + (3 * score) / 100);
    obstacle.lifetime = 300;
    console.log(frameCount);
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();

  runner.changeAnimation("girlRunning", mainRunnerImg1);
  runner.scale = 2.5;

  score = 0;
}
