var alexa = require('alexa-app');
var rp = require('request-promise');

module.change_code = 1;

var gameElements=[
'rock','paper','scissor'
];

var  winnerTabel = [
	2,0,1
];

//define alexa app
var app = new alexa.app('elena_maria');
app.id = require('./package.json').alexa.applicationId;

app.launch(function(request,response){
	response
	.say("Welcome to Rock,paper,scissor!Say let's go to begin.")
	.reprompt("I'm waiting")
	.shouldEndSession(false);
});

app.intent('StartGameIntent',{
	"slots":{},
	"utterances":[
		"let's go"
	]
},function(request,response){
	var choosenElement = rand(0,2);
	var session = request.getSession();
	session.set("choosenElement",choosenElement);

	response
		.say("3. 2. 1. GO!")
		.reprompt("What is your choice?")
		.shouldEndSession(false);
});


app.intent("AnswerIntent",{
	"slots":{
		"Response":"RPSList"
	},
	"utterances":[
	"{Response}"
	]
}, function(request,response){
	var session = request.getSession();
	var decision = request.slot("Response");
	var alexaDecision= session.get("choosenElement");

	if(typeof alexaDecision == "undefined"){
		response
			.say('Please, start a game before answering.')
			.reprompt("I'm waiting")
			.shouldEndSession(false);
		return;
	}

	if(gameElements.IndexOf(decision) == -1){
		response
			.say('Not a correct answer,please,try again.')
			.reprompt("I'm waiting")
			.shouldEndSession(false);
	}
	else
	{
		if(decision == gameElements[alexaDecision]){
			response.say(alexaDecision+ '. '+ "It's a draw!");
		}	
		else
		{
			var i = gameElements.indexOf(decision);
			if(winnerTable[i] == alexaDecision){
				//Win
				response.say(gameElements[alexaDecision]+'. '+"You win!");
			}
			else{
				//Lose
				response.say(gameElements[alexaDecision]+'. '+"You lose!");
			}
		}
	}

});



/*app.intent("HelloWorldIntent",{
	"slots":{},
	"utterances":[
	"Say hallo world"
	],
},function(request,response){
	response.say("Hello world!");
});

app.intent("RepeatIntent",{
	"slots":{
		"WORDS":"LITERAL"
	},
	"utterances":[
	"repeat {how are you|WORDS}"
	],
},function(request,response){
	var words = request.slot("WORDS");
	response.say(words);
});


app.intent("NewsIntent",{
	"slots":{},
	"utterances":[
	"tell me the news"
	],
},function(request,response){
	return getFeed().then(function(result){
		var s = ' ';
		for(var i=0;i<3;i++)
		{
			s+=result.items[i].title;
			if(s.lastIndexOf('.')!=s.length-1){
				s+=".";
			}

			s+=" ";
			s+=result.items[i].description + ".";
			if(s.lastIndexOf('.')!=s.length-1){
				s+=".";
			}

			s+=" ";
		}

		response.say(s);
	});
});
*/

module.exports = app;


/*function getFeed(){
	var options = {
		uri:"https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/rss.xml",
		json:true
	};
	return rp(options).then(function(result){
		return result;
	});
	*/

function rand(min,max){
	return Math.round(min+Math.random()*(max-min));
}