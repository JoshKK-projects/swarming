//PLANTS
//initial plants
var initialPlants = 10;
//current living plants
var livingPlants = 0;
//Max plants allowed alive
var maxLivingPlants = 0; //NOT IMPLEMENTED
//plant variables
var energyToDropSeed = 650;//needed to start dropping seeds
var energySpentOnSeed = 550;//energy depleted on dropping a seed
var seedDropRange = 400;//twice how far it can try to drop in any direction


function Plant(x,y){
	livingPlants++;
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
	console.log(livingPlants + " plants")
	return true;
}

//helper function to tell if something is in bounds
function in_bounds(initx,inity,addedx,addedy){
	if(initx+addedx < 0 || initx+addedx > 999 || inity+addedy < 0 || inity+addedy > 999){
		return false;
	}
	return true;
}