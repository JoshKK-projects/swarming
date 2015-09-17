"use strict";

//Time per interval
var intervalTime = 40;//ms
//canvas to draw to
var canvas = document.getElementById('ecocanvas');
//age of world in loop cycles
var worldTime = 0; 

//PLANTS
//initial plants
var initialPlants = 12;
//current living plants
var livingPlants = 0;
//Max plants allowed alive
var maxLivingPlants = 0; //NOT IMPLEMENTED
//plant variables
var energyToDropSeed = 650;//needed to start dropping seeds
var energySpentOnSeed = 550;//energy depleted on dropping a seed
var seedDropRange = 400;//twice how far it can try to drop in any direction

//HERBIVORES
//initial herbivores
var initialHerbivores = 2;

//sub array referenced to draw to canvas
var subSystem = new Array();
for(var i = 0; i<1000; i++){
	var subArray = new Array();
	for(var a = 0; a < 1000; a++){
		subArray[a] = new Dirt();;
	}
	subSystem.push(subArray);
}
//populate initial world
function init_ecosystem(){
	//places the first plants
	for(var i = 0; i< initialPlants; i++){
		var startPlantLocationX = Math.floor(Math.random()*1000+1);
		var startPlantLocationY = Math.floor(Math.random()*1000+1);
		var newPlant = new Plant(startPlantLocationX,startPlantLocationY);
		allPlants.push(newPlant);
	}

	//places the first herbivors
	for(var i=0;i<initialHerbivores;i++){
		var startHerbivoreLocationX = Math.floor(Math.random()*1000+1);
		var startHerbivoreLocationY = Math.floor(Math.random()*1000+1);
		var newHerbivore = new Herbivore(startHerbivoreLocationX,startHerbivoreLocationY);
		allAnimals.push(newHerbivore);
		subSystem[startHerbivoreLocationX][startHerbivoreLocationY] = newHerbivore;
	}
	setInterval(function(){action_loop()}, intervalTime);
}
//holds all the plants
var allPlants = new Array();
//holds all the animals
var allAnimals = new Array();
//action loop
function action_loop(){
	//wipe the canvas
	for (var plant in allPlants){
		allPlants[plant].synthesize();
		allPlants[plant].grow();
	}
	for (var animal in allAnimals){
		allAnimals[animal].action();
	}
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	//plants go first, they can be in one loop since if both try to seed the same place, it doesnt actualy matter which one succeeds
	for (var plant in allPlants){
		allPlants[plant].draw();
	}
	for (var animal in allAnimals){
		allAnimals[animal].draw();
	}
	worldTime++;
}

function Herbivore(x,y){
	this.tiredOrFull = 25;
	this.energy = 1100+(Math.floor((Math.random()*400)+1));//depletes
	this.x = Math.floor(x);//coordinates
	this.y = Math.floor(y);
	this.speed = (Math.floor(Math.random()*3)+3)//animal run speed
	this.closestFood = null;
	this.closestPredator = null;//maybe should be array, run away from them in vector
	this.unique_id = Math.random() + Math.random(); //maybe hash something
	this.weakend = 1;//if one, fine, if 2, weakend
	this.eating = false;


	//what it does each turn
	this.action = function(){
		//should be a gate here, run from predators or ...
		this.energy-=6;	//if its hungry, and its it's turn, and it has no food nearby, look for food
		if(this.tiredOrFull>0 && !this.eating){
			this.tiredOrFull--;
		}
		else if(this.tiredOrFull > 0 ){
			this.endEat();
		}
		else if(this.energy > 2000 ){
			this.tiredOrFull+=30;
			this.reproduce();
		}
		else if(this.energy>500) {
			this.weakend = 1;
			this.move_to_food(this.food_scan());
		}
		else if(this.energy > 0){
			this.weakend = 2;
			this.move_to_food(this.food_scan());
		}
		else{
			console.log("DIE");
			this.starve();
		}
	}
	//scans for closest food
	this.food_scan = function(){
		var smallestDist = 1000000;
		for(var plant in allPlants){
			var plantDist = Math.sqrt( Math.pow((Math.abs(this.x-allPlants[plant].x)),2) + Math.pow((Math.abs(this.y-allPlants[plant].y)),2) );
			if(plantDist < smallestDist && !allPlants[plant].gettingEaten){
				smallestDist = plantDist;
				this.closestFood = allPlants[plant];
			}
		}
		return smallestDist;
	}
	//moves to nearest food
	this.move_to_food = function(abs_food_dist){
		if(this.closestFood != null){

			var relFoodX = this.x-this.closestFood.x;
			var relFoodY = this.y-this.closestFood.y;
			if(abs_food_dist <= this.speed){
				this.x = this.closestFood.x;
				this.y = this.closestFood.y;
				this.startEat();
			}
			else{
				this.x += (this.speed/this.weakend) * ((this.closestFood.x-this.x) / abs_food_dist);
				this.y += (this.speed/this.weakend) * ((this.closestFood.y-this.y) / abs_food_dist);
			}
		}//else random
	}
	//starts to eat a plant to gain energy
	this.startEat = function(){
		this.closestFood.gettingEaten = true;
		this.eating = true;
		this.tiredOrFull+=10;
	}
	//done eating, kill plant
	this.endEat = function(){
		subSystem[this.closestFood.x][this.closestFood.y] = new Dirt();
		var index = allPlants.indexOf(this.closestFood);
		allPlants.splice(index,1);
		this.energy+= 400;		
		this.closestFood = null;
		this.eating = false;
	}
	//reproduce, if you don't get how it works, go ask your parents, or look below
	this.reproduce = function(){
		var newAnimal = new Herbivore(this.x,this.y);
		allAnimals.push(newAnimal);
		this.energy-=1000;

	}
	//starve to death
	this.starve = function(){
		//subSystem[this.x][this.y] = new Dirt();not whole numbers - gotta round it all
		var index = allAnimals.indexOf(this);
		allAnimals.splice(index,1);
		if(this.closestFood != null){
			this.closestFood.gettingEaten = false;
		}		
	}
	//draws the animal
	this.draw = function(){
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.rect(this.x,this.y,10,10);
		ctx.fillStyle = 'blue';
		ctx.strokeStyle = 'blue';
		if(this.weakend>1){
			ctx.fillStyle = 'red';
			ctx.strokeStyle = 'red';
		}
		ctx.fill();
		ctx.stroke();
	}

}

function Plant(x,y){

	this.type = 'Plant';//Type, should probs prototype this out somehow later
	this.energy = 0;//used to grow
	this.x = Math.floor(x); //coordinates
	this.y = Math.floor(y);
	this.growRate = Math.floor((Math.random()*8)+1);
	this.unique_id = Math.random() + Math.random(); //maybe hash something
	subSystem[x][y] = this;
	this.gettingEaten = false; //pretty self explanatory
	this.synthesize = function(){//called each round
		this.energy+=this.growRate;
	}


	//called each round
	this.grow = function(){
		if(this.energy >= energyToDropSeed){
			var canGrow = (Math.random()*50)+(this.energy-50);//every energy above 50 gives it a higher chance of growing
			if(canGrow>=energyToDropSeed-1){//tries to drop a see near it
				var dropSeedX = Math.floor((Math.random()*seedDropRange)-(seedDropRange/2));
				var dropSeedY = Math.floor((Math.random()*seedDropRange)-(seedDropRange/2));
				if(in_bounds(this.x,this.y,dropSeedX,dropSeedY) && seed_take_root(this.x,this.y,dropSeedX,dropSeedY)){//will drop seed if no plant in current area
					var newPlant = new Plant(this.x+dropSeedX,this.y+dropSeedY);
					allPlants.push(newPlant);
					subSystem[this.x+dropSeedX][this.y+dropSeedY] = newPlant;
					livingPlants++;
				}
				this.energy-=energySpentOnSeed;//spends some energy dropping the seed
			}
		}
	}
	//draws the plant
	this.draw = function(){
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(this.x,this.y,5,0,2*Math.PI);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.strokeStyle = 'green';
		ctx.stroke();
	}

}
//specific if plant can grow rules
function seed_take_root(initx,inity,addedx,addedy){
	if(subSystem[initx+addedx][inity+addedy].type != 'Dirt'){
		return false;
	}
	return true;
}

//helper function to tell if something is in bounds
function in_bounds(initx,inity,addedx,addedy){
	if(initx+addedx < 0 || initx+addedx > 999 || inity+addedy < 0 || inity+addedy > 999){
		return false;
	}
	return true;
}
//Dirt, plants can grow in it
function Dirt(){
	this.type = 'Dirt';
	//add plant nutrients sometime, affect distribution of plants
}
