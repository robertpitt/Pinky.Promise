/**
 * 
 */
var Pinky = require('../index.js');

function initial() {
	return Pinky.Promise(function(done){setTimeout(function(){done({a: 0});}, 1000);})
}

function increment(value, done) {
	console.log("increment", value)
	value.a = value.a + 1;
}

initial()
	.then(increment)
	.and(increment)
	.and(increment)