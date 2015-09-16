var module = function (){
	var sum = 0;
	return {
		add: function(){
			sum += 1;
			return sum;
		},
		resett: function(){
			sum = 0;
			return sum;
		}
	}
}();