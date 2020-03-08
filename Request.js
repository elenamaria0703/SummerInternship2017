var http = require('http');

var options = {
	host: 'jsonplaceholder.typicode.com',
	path: '/todos'
};

http.createServer(function(req,res){
	callback =  function(response){
		var str = '';
		var nr = 0;
		var l = [];
		var v2=[];
		var o = {};
		response.on('data', function(chunk){
			str+=  chunk;
			l.push(chunk.length);
			nr++;
		});

		response.on('end',function(){
			response = JSON.parse(str);
			/*for(var i=0;i<response.length;i++){
				if(v2[response[i].postId]) {
					v2[response[i].postId]++;
				}
				else {
					v2[response[i].postId] = 1;	
				}
			}*/
			for(var i=0;i<response.length;i++){

				if(typeof o[response[i].userId] == 'undefined'){
					o[response[i].userId]=[0,0,0];
				}
				if(response[i].completed == false){
					o[response[i].userId][0]++;
				}
				if(response[i].completed == true){
					o[response[i].userId][1]++;
				}
				o[response[i].userId][2]= (100*o[response[i].userId][1])/(o[response[i].userId][0]+o[response[i].userId][1]);
				for(var i =1 ;i<response.length;i++)
				{
					res.write("Utilizatorul " + i + " : " + o[response[i].userId][2] + '%\n');
				}
			};
			console.log(o);
			//console.log(v2);
			res.write(str);
			res.end();
			
		});
	}
	http.request(options,callback).end();
}).listen(8081);
