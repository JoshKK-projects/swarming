"use strict";
//Time per interval
var intervalTime = 40;//ms
//canvas to draw to
var canvas = document.getElementById('ecocanvas');
//age of world in loop cycles
var worldTime = 0; 
//to skip a turn to make sure herbivores hibernate before plants repop
var tillPlantRepop;
//so till repop only triggers once
var waitingToRepop = false;
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
	populate_plants();
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

function populate_plants(){
	for(var i = 0; i< initialPlants; i++){
		var startPlantLocationX = Math.floor(Math.random()*1000+1);
		var startPlantLocationY = Math.floor(Math.random()*1000+1);
		var newPlant = new Plant(startPlantLocationX,startPlantLocationY);
		allPlants.push(newPlant);
	}
	console.log("repopulating plants");
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
	//If all the plants have died
	if(allPlants <= 0 && !waitingToRepop){
		tillPlantRepop = worldTime+2;
		waitingToRepop = true;
	}
	if(tillPlantRepop == worldTime){
		populate_plants();
		waitingToRepop = false;
	}
	worldTime++;
}

//Dirt, plants can grow in it
function Dirt(){
	this.type = 'Dirt';
	//add plant nutrients sometime, affect distribution of plants
}
