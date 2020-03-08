var http = require('http');

var cars = [
	{
		brand: "Maseratti",
		model: "1",
		year: 2017,
		price:937000
	},
	{
		brand: "Dacia",
		model: "1310",
		year: 1987,
		price:5
	},
	{
		brand: "Audi",
		model: "A7",
		year: 2017,
		price:70000
	},
	{
		brand: "Lada",
		model: "2",
		year: 1950,
		price:10
	},
	{
		brand: "Tesla",
		model: "S",
		year: 2014,
		price:160000

	}
]

http.createServer(function(req,res){
	res.write(JSON.stringify(cars));
	res.end();
}).listen(4040);

var s =[{"brand":"Maseratti","model":"1","year":2017,"price":937000},{"brand":"Dacia","model":"1310","year":1987,"price":5},{"brand":"Audi","model":"A7","year":2017,"price":70000},{"brand":"Lada","model":"2","year":1950,"price":10},{"brand":"Tesla","model":"S","year":2014,"price":160000}];

console.log(JSON.parse(s));