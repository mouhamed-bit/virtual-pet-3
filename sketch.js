//Create variables here
var dog,dogImg,happyDog,foodS,foodStock;
var fedTime,lastFed,feed,addFood,food;
var garden,washroom,bedroom;
var currentTime,gameState,readState;
var database;

function preload(){
  //load images here
  dogImg = loadImage("dogImg.png");
  happyDog = loadImage("dogImg1.png");

  garden = loadImage("Garden.png");
  bedroom = loadImage("Bed Room.png");
  washroom = loadImage("Wash Room.png");
}

function setup() {
  createCanvas(1000, 400);
  database = firebase.database();

  food = new Food();

  foodStock = database.ref("food");
  foodStock.on("value", (data) => {
    foodS = data.val();
    food.updateFoodStock(foodS);
  });

  fedTime = database.ref("FeedTime");
  fedTime.on("value", (data) => {
    lastFed = data.val();
  });

  readState = database.ref("gameState");
  readState.on("value", (data) => {
    gameState = data.val();
  });

  dog = createSprite(800,200,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  feed = createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  textSize(20);
}


function draw() {  
  currentTime = hour();

  if(currentTime === lastFed + 1){
    update("playing");
    food.garden();
  }
  else if(currentTime === lastFed + 2){
    update("sleeping");
    food.bedroom();
  }
  else if(currentTime > lastFed + 2 && currentTime <= lastFed + 4){
    update("bathing");
    food.washroom();
  }
  else{
    update("hungry");
    food.display();
  }

  if(gameState !== "hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }

  drawSprites();
}

function feedDog(){
  dog.addImage(happyDog);

  food.deductFood();
  var stock = food.getFoodStock();
  food.updateFoodStock(stock);
  database.ref("/").update({
    food: stock,
    FeedTime: hour(),
    gameState: "hungry"
  });
}

function addFoods(){
  foodS ++;
  database.ref("/").update({
    food: foodS
  })
}

function update(state){
  database.ref("/").update({
    gameState: state
  });
}