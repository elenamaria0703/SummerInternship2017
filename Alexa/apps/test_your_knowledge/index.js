var alexa 	= require("alexa-app");
var rp		= require("request-promise");
var quiz	= require("./test-your-knowledge");

module.change_code = 1;

var app = new alexa.app("test_your_knowledge");
app.id = require('./package.json').alexa.applicationId;



app.launch(function(request, response) {
	var helloTxt = quiz.getRandomText("start");
	var repromptText = quiz.getRandomText("reprompt");

	var session = request.getSession();
	session.set("gameData", false);

	quiz.reset();

	response
		.say(helloTxt)
		.reprompt(repromptText)
		.shouldEndSession(false);
});

app.intent("StartIntent", {
	slots: {},
	utterances: [
		"Start quiz",
		"Let's go"
	]
}, function(request, response) {
	var session = request.getSession();
	var repromptText = quiz.getRandomText("reprompt");

	if (typeof session.get("gameData") !== "undefined" && session.get("gameData")) {
		response
			.say("The game is already started.")
			.reprompt(repromptText)
			.shouldEndSession(false);

		return;
	}

	quiz.reset();

	// Send requests to obtain the questions.
	var x = y = z = [];

	return getEasyQ().then(function (result) {
		x = result.results;

		return getMediumQ().then(function (result) {
			y = result.results;

			return getHardQ().then(function (result) {
				z = result.results;

				quiz.setQuestions(x, y, z);

				var gameData = quiz.getGameStats();
				session.set("gameData", gameData);

				response
					.say(quiz.readQuestion())
					.reprompt(repromptText)
					.shouldEndSession(false);
			});
		});
	});
});

app.intent("AnswerIntent", {
	slots: {
		Answer: "ANSWERLIST"
	},
	utterances: [
		"{Answer}"
	]
}, function(request, response) {
	var session = request.getSession();
	var repromptText = quiz.getRandomText("reprompt");

	if (typeof session.get("gameData") == "undefined" || !session.get("gameData")) {
		response
			.say("Please start a game before answering unquestioned questions.")
			.reprompt(repromptText)
			.shouldEndSession(false);

		return;
	}

	quiz.init(session.get("gameData"));
	var answer = request.slot("Answer");

	quiz.questions[quiz.currentQuestion].answer = answer;
	var gameData = quiz.getGameStats();
	session.set("gameData", gameData);

	if (quiz.checkAnswer(answer)) {
		// Correct
		var txt = quiz.getRandomText("afterCorrectAnswer");
		response.say(txt + " ");

		if (quiz.currentQuestion == 14) {
			var winText = quiz.getRandomText("winner");
			response.say(winText);

			var endText = quiz.getRandomText('end');
			response.say(endText + " ")
				.reprompt(repromptText)
				.shouldEndSession(false);
		}
		else {
			var bnqText = quiz.getRandomText("beforeNextQuestion");
			response
				.say(bnqText)
				.reprompt(repromptText)
				.shouldEndSession(false);
		}

	}
	else {
		// Incorrect

		quiz.reset();
		session.set("gameData", false);

		var txt = quiz.getRandomText("afterIncorrectAnswer");
		response.say(txt + " ");

		if (quiz.currentQuestion > 4) {
			if (quiz.currentQuestion > 9) {
				quiz.currentQuestion = 9;
			}
			else {
				quiz.currentQuestion = 4;
			}

			var limitWinText = quiz.getRandomText('limitWin');
			response.say(limitWinText + " ");

			var endText = quiz.getRandomText('end');
			response.say(endText + " ")
				.reprompt(repromptText)
				.shouldEndSession(false);
		}
		else {
			var loseText = quiz.getRandomText('lose');
			response.say(loseText);

			var endText = quiz.getRandomText('end');
			response.say(endText + " ")
				.reprompt(repromptText)
				.shouldEndSession(false);
		}
	}
});

app.intent("ContinueGameIntent", {
	slots: {},
	utterances: [
		"next",
		"next question",
		"continue"
	]
}, function(request, response) {
	var session = request.getSession();
	var repromptText = quiz.getRandomText("reprompt");

	if (typeof session.get("gameData") == "undefined" || !session.get("gameData")) {
		response
			.say("Please start a game before answering unquestioned questions.")
			.reprompt(repromptText)
			.shouldEndSession(false);

		return;
	}

	quiz.init(session.get("gameData"));

	var q = quiz.getCurrentQuestion();
	if (q.answer == null) {
		response
			.say("Please answer the current question before going to the next. There is no place to cheat.")
			.reprompt(repromptText)
			.shouldEndSession(false);
	}
	else {
		quiz.nextQuestion();

		var gameData = quiz.getGameStats();
		session.set("gameData", gameData);

		var nqText = quiz.getRandomText('nextQuestion');
		response.say(nqText + " ");

		response
			.say(quiz.readQuestion())
			.reprompt(repromptText)
			.shouldEndSession(false);
	}
});

app.intent("TakeMoneyIntent", {
	slots: {},
	utterances: [
		"take the money"
	]
}, function(request, response) {
	var session = request.getSession();
	var repromptText = quiz.getRandomText("reprompt");

	if (typeof session.get("gameData") == "undefined" || !session.get("gameData")) {
		response
			.say("Please start a game before answering unquestioned questions.")
			.reprompt(repromptText)
			.shouldEndSession(false);

		return;
	}

	quiz.init(session.get("gameData"));

	var q = quiz.getCurrentQuestion();

	if (q.answer == null) {
		response
			.say("You can't take the money before winning it!")
			.reprompt(repromptText)
			.shouldEndSession(false);
	}
	else {
		var text = quiz.getRandomText('stopWin');
		response.say(text + " ");

		var endText = quiz.getRandomText('end');
		response.say(endText)
			.reprompt(repromptText)
			.shouldEndSession(false);
	}
});

app.intent("StopIntent", {
	slots: {},
	utterances: [
		"stop"
	]
}, function(request, response) {
	response.say("Goodbye.");
});

app.intent("WaitIntent", {
	slots: {},
	utterances: [
		"wait"
	]
}, function(request, response) {
	var repromptText = quiz.getRandomText("reprompt");
	response
		.say("Ok, I'll wait a little bit.")
		.reprompt(repromptText)
		.shouldEndSession(false);
});

app.intent("RepeatIntent", {
	slots: {},
	utterances: [
		"repeat"
	]
}, function(request, response) {
	var repromptText = quiz.getRandomText("reprompt");
	response
		.say("One more time. " + quiz.readQuestion())
		.reprompt(repromptText)
		.shouldEndSession(false);
});

app.intent("HelpIntent", {
	slots: {
		Help: "HELPLIST"
	},
	utterances: [
		"use {Help} help"
	]
}, function(request, response) {
	var session = request.getSession();
	var repromptText = quiz.getRandomText("reprompt");

	if (typeof session.get("gameData") == "undefined" || !session.get("gameData")) {
		response
			.say("Please start a game before answering unquestioned questions.")
			.reprompt(repromptText)
			.shouldEndSession(false);

		return;
	}

	quiz.init(session.get("gameData"));

	var help = request.slot("Help");
	var f = help + "Helper";

	if (typeof quiz[f] == "function") {
		var result = quiz[f]();

		if (!result) {
			response
				.say(help + " help is used already.")
				.reprompt(repromptText)
				.shouldEndSession(false);
		}
		else {
			var f2 = f + "Response";
			var text = quiz[f2](result);

			var gameData = quiz.getGameStats();
			session.set("gameData", gameData);

			response
				.say(text)
				.reprompt(repromptText)
				.shouldEndSession(false);
		}
	}
	else {
		response
			.say("There are no " + help + " help in system.")
			.reprompt(repromptText)
			.shouldEndSession(false);

		return;	
	}
});

function getEasyQ() {
	var options = {
		uri: "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple",
		json: true
	};
	return rp(options).then(function(resultE)
	{
		return resultE;

	});
}

function getMediumQ() {
	var options = {
		uri: "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple",
		json: true
	};
	return rp(options).then(function(resultM)
	{
		return resultM;
		
	});
}

function getHardQ() {
	var options = {
		uri: "https://opentdb.com/api.php?amount=5&difficulty=hard&type=multiple",
		json: true
	};
	return rp(options).then(function(resultH)
	{
		return resultH;
		
	});
}







module.exports = app;