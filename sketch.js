var foodimg
var waterimg
var fuelimg, fuelGroup
var peopleGroup
var foodGroup
var person1img, person2img, person3img, person4img, person5img
var peopleCount = 0
var racetrack, racetrackimg
var car, carimg
var boundaryLeft, boundaryRight
var foodBar = 0
var monsterimg, monsterGroup
var lives = 5
var PLAY = 1
var END = 0
var gamestate = PLAY
var gameOverimg, gameOver
var restartimg, restart
var peopleSaved=0
var distanceTravelled=0

function preload() {
  racetrackimg = loadImage('Background-overlay.gif')
  carimg = loadImage('Car.gif')
  person1img = loadImage('Person1.gif')
  person2img = loadImage('Person2.gif')
  person3img = loadImage('Person3.gif')
  person4img = loadImage('Person4.gif')
  person5img = loadImage('Person5.gif')
  foodimg = loadImage('Food.gif')
  waterimg = loadImage('Water.gif')
  monsterimg = loadImage('Monster.gif')
  gameOverimg = loadImage('GameOver.jpg')
  fuelimg = loadImage('Fuel.gif')
  restartimg = loadImage('restart button.gif')
}

function setup() {
  //background+scrolling bg
  createCanvas(800, 800);
  racetrack = createSprite(400, 400)
  racetrack.addImage(racetrackimg)
  racetrack.scale = 3
  racetrack.velocityY = 5
  boundaryLeft = createSprite(40, 400, 20, 800)
  boundaryLeft.visible = false
  boundaryRight = createSprite(760, 400, 20, 800)
  boundaryRight.visible = false

  //car
  car = createSprite(400, 700)
  car.addImage(carimg)
  car.scale = 0.25

  //peopleGroup 
  peopleGroup = new Group()

  //foodGroup
  foodGroup = new Group()

  //monsterGroup
  monsterGroup = new Group()

  //fuelGrou
  fuelGroup = new Group()

  //gameover sprite
  gameOver = createSprite(400, 300, 100, 100)
  gameOver.addImage(gameOverimg)
  gameOver.visible = false

  //restart button
  restart = createSprite(width / 2, 550, 50, 50)
  restart.addImage(restartimg)
  restart.visible = false
  restart.scale = 0.25

}

function draw() {
  //scrolling background
  background(51);
  //distance travelled
  distanceTravelled=Math.round(frameCount/60)

  //changing gamestates
  if (gamestate === PLAY) {
    if (racetrack.y > 600) {
      racetrack.y = 400
    }
    //car controls
    if (keyDown(LEFT_ARROW)) {
      car.x = car.x - 5
    }
    if (keyDown(RIGHT_ARROW)) {
      car.x = car.x + 5
    }
    //peoplecollidewithcar+food+etc
    if (peopleGroup.isTouching(car)) {
      peopleCount += 1
      peopleSaved +=1
      foodBar -= 1
      if (foodBar < 0) {
        lives = lives - 1
        foodBar=0
      }
      peopleGroup.destroyEach()
    }
    if (foodGroup.isTouching(car)) {
      foodBar += 1
      foodGroup.destroyEach()
    }
    if (monsterGroup.isTouching(car)) {
      lives -= 1
      monsterGroup.destroyEach()
    }
    if (peopleCount > 0) {
      peopleCount = peopleCount - 1
    }
    else {
      peopleCount = 0
    }

    //causing a gameover
    if (lives < 1 ) {
      gamestate=END
    }

    if (fuelGroup.isTouching(car)) {
      lives += 1
      fuelGroup.destroyEach()
    }

    //calling spawn functions
    spawnPeople()
    spawnFood()
    spawnMonsters()
    fuel()

  } else if (gamestate === END) {
    racetrack.velocityY = 0
    foodGroup.setVelocityYEach(0)
    monsterGroup.setVelocityYEach(0)
    peopleGroup.setVelocityYEach(0)
    foodGroup.destroyEach()
    monsterGroup.destroyEach()
    peopleGroup.destroyEach()
    gameOver.visible = true
    car.visible = false
    restart.visible = true
    

    if (mousePressedOver(restart)) {
      reset()
    }

  }

  //car boundary collisions
  car.collide(boundaryLeft)
  car.collide(boundaryRight)

  drawSprites();

  //text on screen
  textSize(20)
  fill("white")
  text("People Saved:" + peopleSaved, 80, 50)
  text("Food Collected:" + foodBar, 80, 100)
  text("Lives Left:" + lives, 80, 125)
  text("People Survived:"+peopleCount, 80, 75)
  text("Distance Travelled:"+distanceTravelled, 80, 150)
}

//People Group; adding people
function spawnPeople() {
  if (frameCount % 200 === 0) {
    var people = createSprite(Math.round(random(60, 740)), -10, 25, 25)
    var r = Math.round(random(1, 5))
    switch (r) {
      case 1:
        people.addImage(person1img)
        break;
      case 2:
        people.addImage(person2img)
        break;
      case 3:
        people.addImage(person3img)
        break;
      case 4:
        people.addImage(person4img)
        break;
      case 5:
        people.addImage(person5img)
        break;
      default:
        break;
    }
    people.scale = 0.15
    people.velocityY = 6
    people.lifetime = 170
    peopleGroup.add(people)
  }
}

//adding food
function spawnFood() {
  if (frameCount % 150 === 0) {
    var food = createSprite(Math.round(random(60, 740)), -10, 25, 25)
    var r = Math.round(random(1, 2))
    switch (r) {
      case 1:
        food.addImage(foodimg)
        break;
      case 2:
        food.addImage(waterimg)
        break;
      default:
        break;
    }
    food.velocityY = 5
    food.lifetime = 170
    food.scale = 0.10
    foodGroup.add(food)
  }
}

//adding obstacles
function spawnMonsters() {
  if (frameCount % 170 === 0) {
    var monster = createSprite(Math.round(random(60, 740)), -10, 25, 25)
    monster.addImage(monsterimg)
    monster.velocityY = 7
    monster.scale = 0.25
    monsterGroup.add(monster)
    monster.lifetime = 170
  }
}

// adding fuel
function fuel() {
  if (frameCount % 400 === 0) {
    var fuel = createSprite(Math.round(random(60, 740)), -10, 25, 25)
    fuel.addImage(fuelimg)
    fuel.velocityY = 5
    fuel.scale = 0.15
    fuelGroup.add(fuel)
    fuel.lifetime = 170
  }
}

// reseting game
function reset() {
  gamestate = PLAY
  peopleCount = 0
  peopleSaved = 0
  foodBar = 0
  lives = 5
  car.visible = true
  gameOver.visible = false
  restart.visible = false
  racetrack.velocityY = 5
}

