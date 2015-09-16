"use strict";
//1 = plants
//2 = herbivores
//3 = carnivores
//9 = rocks

//Time per interval
var intervalTime = 40;//ms
//canvas to draw to
var canvas = document.getElementById('ecocanvas');
//age of world in loop cycles
var worldTime = 0; 
//plant variables
var energyToDropSeed = 300;//needed to start dropping seeds
var energySpentOnSeed = 300;//energy depleted on dropping a seed
var seedDropRange = 400;//twice how far it can try to drop in any direction

//sub array referenced to draw to canvas
var subSystem = new Array();
for(var i = 0; i<1000; i++){
	var subArray = new Array();
	for(var a = 0; a < 1000; a++){
		subArray[a] = 0;
	}
	subSystem.push(subArray);
}
//populate initial world
function init_ecosystem(){
	//places the first plant
	var startPlantLocationX = Math.random()*1000+1;
	var startPlantLocationY = Math.random()*1000+1;
	allPlants.push(new Plant(startPlantLocationX,startPlantLocationY));
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
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	//plants go first, they can be in one loop since if both try to seed the same place, it doesnt actualy matter which one succeeds
	for (var plant in allPlants){
		allPlants[plant].draw();
	}
	worldTime++;
} 

function Plant(x,y){

	this.energy = 0;//used to grow
	this.x = Math.floor(x); //coordinates
	this.y = Math.floor(y);
	this.growRate = Math.floor((Math.random()*8)+1);

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
				if(subSystem[this.x+dropSeedX][this.y+dropSeedY] != 1 && subSystem[this.x+dropSeedX][this.y+dropSeedY] != 9 && this.x+dropSeedX <= 999 && this.x+dropSeedX >= 0 && this.y+dropSeedY <= 999 && this.y+dropSeedY >= 0 ){//will drop seed if no plan tin current area
					allPlants.push(new Plant(this.x+dropSeedX,this.y+dropSeedY));
					subSystem[this.x+dropSeedX][this.y+dropSeedY] = 1;
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
		ctx.strokeStyle = 'green';
		ctx.stroke();
	}

}
