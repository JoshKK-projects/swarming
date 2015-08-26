"use strict";
var canvas = document.getElementById('swarmcanvas');
var critterarr = new Array();
var pantry = new Array();
function init_critters(){
	var fuds = new Food(500,500);
	pantry.push(fuds);
	for(var i = 0; i<50; i++){
		var critter = new Critter(Math.floor(Math.random()*1000),Math.floor(Math.random()*1000),500);
		critterarr.push(critter);
	}
	var intervalTimer = setInterval(function(){loop(fuds)}, 10);
}
function loop(fuds){
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	fuds.update();
	for(var a in critterarr){
		critterarr[a].action(critterarr[a].x,critterarr[a].y,fuds.x,fuds.y);
		critterarr[a].set_new_pos(critterarr[a].x,critterarr[a].y);
	}
	
}
function Food(x,y){

	this.x = x;
	this.y = y;

	this.x_dir = ((Math.random()-.5)*2);
	this.y_dir = ((Math.random()-.5)*2);



	this.update = function(){
		if(this.x+this.x_dir>=1000 || this.x+this.x_dir <= -1){
			this.x_dir*=-1;
		}
		if(this.y+this.y_dir>=1000 || this.y+this.y_dir <= -1){
			this.y_dir*=-1;
		}
		this.x += this.x_dir*1.5;
		this.y += this.y_dir*1.5;

		var try_change_x = (Math.random()*50)+1;
		var try_change_y = (Math.random()*50)+1;

		if(try_change_x == 25 ){
			this.x_dir = ((Math.random()-.5)*.5);
		}
		if(try_change_y == 25 ){
			this.y_dir = ((Math.random()-.5)*.5);
		}
		draw(this.x,this.y);

	}
	var draw = function(thisx,thisy){
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.rect(thisx,thisy,10,10);
		ctx.stroke();
	}

}


function Critter(x,y,distance){

	this.x = x;
	this.y = y;

	var going_to_x = x;
	var going_to_y = y;

	var upleft = [];
	var upright = [];
	var downleft = [];
	var downright = [];
	var distance = distance;

	var switcher = 1;
	var avoidance = 0;

	// this.getX = function(){
	// 	return x;
	// }

	// this.getY = function(){
	// 	return y;
	// }

	this.action = function(thisx,thisy,fudsx,fudsy){
		search(thisx,thisy);
		move_calc(head_towards(),thisx,thisy,fudsx,fudsy);
	}

	this.set_new_pos = function(thisx,thisy){
		this.x = going_to_x;
		this.y = going_to_y;
		draw(thisx,thisy);
	}

	var draw = function(thisx,thisy){
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.arc(thisx,thisy,5,0,2*Math.PI);
		ctx.stroke();
	}

	var head_towards = function(){
		var all_sides = new Array();
		
		if(!upleft.length<downleft.length || !upleft.length<upright.length  || !upleft.length<downright.length ){
			all_sides.push(upleft);
		}
		if(!upright.length<downleft.length  || !upright.length<upleft.length  || !upright.length<downright.length ){
			all_sides.push(upright);
		}
		if(!downleft.length<upright.length  || !downleft.length<upleft.length  || !downleft.length<downright.length ){
			all_sides.push(downleft);
		}
		if(!downright.length<upright.length  || !downright.length<upleft.length  || !downright.length<downleft.length ){
			all_sides.push(downright);
		}
		var going =  all_sides[Math.floor(Math.random()*all_sides.length)];
		upleft = [];
		downleft = [];
		upright = [];
		downright = [];
		var random = Math.floor(Math.random()*going.length);
		var specific_critter = going[random];

		return specific_critter;
	}

	var move_calc = function(go_to_area,thisx,thisy,fudsx,fudsy){


		var abs_food_dif_x = Math.abs(thisx-fudsx);
		var abs_food_dif_y = Math.abs(thisy-fudsy);

		var total_abs_food_dif = abs_food_dif_y+abs_food_dif_x;

		var food_change_x = (abs_food_dif_x/total_abs_food_dif)*1;
		var food_change_y = (abs_food_dif_y/total_abs_food_dif)*1;

		if(go_to_area != null){
			var abs_x_dif = Math.abs(thisx-go_to_area.x);
			var abs_y_dif = Math.abs(thisy-go_to_area.y);

			var abs_total_dif = abs_x_dif+abs_y_dif;

			var change_x = (abs_x_dif/abs_total_dif)*1;
			var change_y = (abs_y_dif/abs_total_dif)*1;

			change_x = (change_x+food_change_x)/2;
			change_y = (change_y+food_change_y)/2;

			if(thisx-go_to_area.x > 0){
				change_x *= -1;
			}
			if(thisy-go_to_area.y > 0){
				change_y *= -1;
			}
			
			if(going_to_x+change_x>=1000 || going_to_x+change_x<=-1 ){
				change_x *= -1;

			}
			if(going_to_y+change_y>=1000 || going_to_y+change_y<=-1 ){
				change_y *= -1;

			}
			if(Math.floor(going_to_x+change_x) == Math.floor(go_to_area.x) && Math.floor(going_to_y+change_y) == Math.floor(go_to_area.y)){

				avoidance = 300;
				switcher*=-1;
			 }
			 if(thisx>=1000 || thisx<=-1 ){
				going_to_x = 500;
			}
			if(thisy>=1000 || thisy<=-1 ){
				going_to_y = 500;
			}
			
			avoidance--;
			if(avoidance<=0){
				switcher = 1;
			}
			going_to_x += change_x*switcher;
			going_to_y += change_y*switcher;
			return;
		}
		if(going_to_x+food_change_x>=1000 || going_to_x+food_change_x<=-1 ){
			change_x *= -1;

		}
		if(going_to_y+food_change_y>=1000 || going_to_y+food_change_y<=-1 ){
			change_y *= -1;

		}
		 going_to_x += food_change_x;
		 going_to_y += food_change_y;

	}

	var search = function(thisx,thisy){
		for(var other_critter in critterarr){
			 
			if(thisx != critterarr[other_critter].x || thisy != critterarr[other_critter].y){
				var other_critter_x = critterarr[other_critter].x;
				var other_critter_y = critterarr[other_critter].y;
				var rel_other_x = Math.abs(thisx-other_critter_x);
				var rel_other_y = Math.abs(thisy-other_critter_y);
				if( ( Math.pow(rel_other_x, 2) + Math.pow(rel_other_y, 2) ) <= Math.pow(distance,2) ){
					var actual_x_dif = thisx-other_critter_x;
					var actual_y_dif = thisy-other_critter_y;

					if(actual_x_dif<0 && actual_y_dif<0){
						upleft.push(critterarr[other_critter]);
					}
					if(actual_x_dif>=0 && actual_y_dif<0){
						upright.push(critterarr[other_critter]);
					}
					if(actual_x_dif<0 && actual_y_dif>=0){
						downleft.push(critterarr[other_critter])
					}
					else{
						downright.push(critterarr[other_critter]);
					}

				}
			}
		}
	}

}