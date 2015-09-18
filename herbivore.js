//HERBIVORES
//initial herbivores
var initialHerbivores = 2;
//How long must idle after birth
var initialTirerOrFull = 25;
//initial base energy
var initialBaseEnergy = 1100;
//initial possible bonus energy
var initalPossibleBonusEnergy = 400;
//energy use per turn
var energyBurn = 6;
//hibernation time
var hibernationTime = 100;
//hibernation energy divisor
var savedEngery = 3;

function Herbivore(x,y){
	this.tiredOrFull = initialTirerOrFull;
	this.energy = initialBaseEnergy+(Math.floor((Math.random()*initalPossibleBonusEnergy)+1));//depletes
	this.x = Math.floor(x);//coordinates
	this.y = Math.floor(y);
	this.speed = (Math.floor(Math.random()*3)+3)//animal run speed
	this.closestFood = null;
	this.closestPredator = null;//maybe should be array, run away from them in vector
	this.unique_id = Math.random() + Math.random(); //maybe hash something
	this.weakendMultiplier = 1;//if one, fine, if 2, weakend
	this.eating = false;
	this.energyBurn = energyBurn;
	this.savedEngery = savedEngery;
	this.hibernating = false;


	//what it does each turn
	this.action = function(){
		//should be a gate here, run from predators or ...
		this.energy-=energyBurn;	//if its hungry, and its it's turn, and it has no food nearby, look for food
		if(this.tiredOrFull>0){
			this.tiredOrFull--;
		}
		else if(this.tiredOrFull <= 0 && this.hibernating){
			this.hibernating = false;
		}
		else if(this.tiredOrFull <= 0 && this.eating ){
			this.endEat();
		}
		else if(this.energy > 2000 ){
			this.tiredOrFull+=30;
			this.reproduce();
		}
		else if(livingPlants <= 0 && !this.hibernating){
			this.energyBurn /= this.savedEngery;
			this.tiredOrFull = hibernationTime;
			this.hibernating = true;
		}
		else if(this.energy>500) {
			this.weakendMultiplier = 1;
			this.move_to_food(this.food_scan());
		}
		else if(this.energy > 0 && !this.hibernating){
			this.weakendMultiplier = 2;
			this.move_to_food(this.food_scan());
		}
		else{
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
			subSystem[this.x][this.y] = null;
			if(abs_food_dist <= this.speed){
				this.x = this.closestFood.x;
				this.y = this.closestFood.y;
				this.startEat();
			}
			else{
				this.x += Math.ceil((this.speed/this.weakendMultiplier) * ((this.closestFood.x-this.x) / abs_food_dist));
				this.y += Math.ceil((this.speed/this.weakendMultiplier) * ((this.closestFood.y-this.y) / abs_food_dist));
			}
		}
		subSystem[this.x][this.y] = this;
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
		livingPlants--;
		this.eating = false;
	}
	//reproduce, if you don't get how it works, go ask your parents, or look below
	this.reproduce = function(){
		var newAnimal = new Herbivore(this.x,this.y);
		allAnimals.push(newAnimal);
		this.energy-=1000;
		console.log(allAnimals.length + " animals");

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
		if(this.weakendMultiplier == 2){
			ctx.fillStyle = 'red';
			ctx.strokeStyle = 'red';
		}
		if(this.hibernating){
			ctx.fillStyle = 'purple';
			ctx.strokeStyle = 'purple';
		}
		ctx.fill();
		ctx.stroke();
	}

}