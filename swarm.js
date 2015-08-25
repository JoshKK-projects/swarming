"use strict";
var canvas = document.getElementById('swarmcanvas');
var critterarr = new Array();
function init_critters(){
	for(var i = 0; i<50; i++){
		var critter = new Critter(Math.floor(Math.random()*1000),Math.floor(Math.random()*1000),500);
		critterarr.push(critter);
		var intervalTimer = setInterval(function(){loop()}, 100);
	}
}
function loop(){
	//canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
	for(var a in critterarr){
		critterarr[a].action(critterarr[a].x,critterarr[a].y);
		critterarr[a].set_new_pos(critterarr[a].x,critterarr[a].y);
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

	// this.getX = function(){
	// 	return x;
	// }

	// this.getY = function(){
	// 	return y;
	// }

	this.action = function(thisx,thisy){
		search(thisx,thisy);
		move_calc(head_towards(),thisx,thisy);
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
		var going  = upright;
		if(going.length < upleft.length){
			going = upleft;
		}
		if(going.length<downleft.length){
			going = downleft
		}
		if(going.length<downright.length){
			going = downright;
		}
		upleft = [];
		downleft = [];
		upright = [];
		downright = [];

		var random = Math.floor(Math.random()*going.length);
		var specific_critter = going[random];

		return specific_critter;
	}

	var move_calc = function(go_to_area,thisx,thisy){

		if(go_to_area != null){
			var abs_x_dif = Math.abs(thisx,go_to_area.x);
			var abs_y_dif = Math.abs(thisy,go_to_area.y);

			var abs_total_dif = abs_x_dif+abs_y_dif;

			var change_x = (abs_x_dif/abs_total_dif)*5;
			var change_y = (abs_y_dif/abs_total_dif)*5;

			if(thisx-go_to_area.x < 0){
				change_x *= -1;
			}
			if(thisy-go_to_area.y < 0){
				change_y *= -1;
			}


			going_to_x += change_x;
			going_to_y += change_y;
		}

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