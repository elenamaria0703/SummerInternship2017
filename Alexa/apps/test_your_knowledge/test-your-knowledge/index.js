
var GameController = {

	questions: [],
	currentQuestion: 0,
	helpers: {
		split: true,
		phone: true,
		crowd: true
	},

	answerLetters: ['A', 'B', 'C', 'D'],

	texts: {
		start:[
			"Welcome to Test Your Knowledge! Are u ready to win some money?",
			"Welcome to Test Your Knowledge, let's see how smart u are!",
			"Welcome to the best trivia game ever seen by man!",
			"Welcome to the best skill made for Alexa ever!",
			"Welcome to the the most awsome game ever!",
			"Welcome to the best game of the year!",
			"Greeting from the virtual world, are u ready for the journey of your life.",
			"Welcome to Test Your Knowledge! A game made by geniuses for geniuses!",
			"Do u believe yourself smart? Let us prove u otherwise!"
		],

		end: [
			"To start a new game, just say start!",
			"Do u want a new chance, just say start!",
			"Try again? just say start!",
			"You think u can better? just say start!"
		],

		reprompt: [
			"Sorry?",
	 		"I can't hear you.",
			"Is anybody out there?",
	 		"I'm listening",
	 		"Come on, don't be shy.",
			"Oh, come on, it's not so hard!",
			"Hey, buddy, wake up!",
	 		"Are u sleeping?",
	 		"Come on, this is not so hard!",
	 		"Come on, this is too easy!",
	 		"Hello, am I talking alone?",
	 		"Come on man, even my dog know the answer!",
	 		"Hope you are not searching the internet for the answer!",
	 		"Hope u are not trying to cheat!"
	 	],

		beforeNextQuestion: [
			"You have {prices} dollars, do u want to continue or do u want to take the money?",
			"So u have {prices} dollars, continue or leave?",
			"Do u want to take the {prices} dollars, or do you want to continue for more?",
			"Take the {prices} dollars, or continue?",
			"Are {prices} dollars enough? or do you want more?",
			"Are {prices} dollars enough? or are you greedy and want more?"
		],

		nextQuestion: [
			"The next question is for {prices} dollars.",
			"The question number {currentQuestionNr} is for {prices} dollars.",
			"Get ready for the next question!",
			"Get ready for the question number {currentQuestionNr}.",
			"Brace yourself, next question is coming!"
		],

		afterCorrectAnswer:[
			"Yay, it's correct!",
	  		"Your answer is... Correct!",
	  		"That's right!",
	  		"Corect, u are getting closer to the jackpot!",
	  		"Congratulations, you answered correctly!",
	  		"Correct answer, the money are on the way!",
	  		"Good job mate, u are quite smart!",
	  		"It's corect, hope u are not cheating!",
	  		"Correct answer, seems u are really good at cheating!"
  		],

		afterIncorrectAnswer:[
			"Sorry, but it's wrong.",
			"Your answer is... Wrong!",
			"No no, that's wrong!",
			"Oh, that is to bad, wrong answer!",
			"Seems like this is not your best day!",
			"Do u want another chance? Not today!",
			"Really? do u even try?",
			"Seems like this game is to hard for you!",
			"Ooooo... wrong answer!",
			"Wrong, do u even try?",
			"Hahahahahahahahahaha, this is so wrong!",
			"Lol, how can u get this wrong?" 
		],

		lose: [
			"Sorry mate, game over!",
			"Time to go home",
			"Maybe next time dude",
			"It seems that u failed!",
			"Seems like this game is to hard for you!",
			"Time to go back to school!",
			"Semms u are not that smart after all!"
		],

		limitWin: 
		[
			"I'm sorry, but you got the wrong answer. Just kidding, I'm not sorry. Anyway, you won {prices} dollars.",
			"That's what you get when you don't pay attention, you lose.",
			"I think today's not your lucky day, you better try again tomorrow. Congrats on your {prices} dollar win.",
			"You were almost there at the top but you missed it. You won {prices} dollars.",
			"See you next year. Now, you won {prices} dollars.",
			"Don't give up! Next time you'll do better. I have {prices} dollars for you."
		],
		stopWin: 
		[
			"Hmmm, I thought you could do better. ",
			"Oh finally, better later than never. You have {prices} dollars.",
			"Yeah, I know you're lazy, it's OK.",
			"I think you should drink more coffee. You accumulated {prices} dollars.",
			"I'm sorry you gave up before trying more."
		],
		winner: 
		[
			"Winner, winner, chicken dinner! You won the big prize!",
			"You won a million, you're one in a million!",
			"Congrats! You're the winner of the day. You won the big jackpot.",
			"Woah, you're a smart ass kid.",
			"Wow, you surprised me! You won our money.",
			"You did it! I'm proud of you!",
			"Your intelligence has no limits. Unfortunately, we don't have any more questions."
		]
	},

	prices: [
		100,
		200,
		300,
		500,
		1000,
		2000,
		4000,
		8000,
		16000,
		32000,
		64000,
		125000,
		250000,
		500000,
		1000000
	],

	reset: function() {
		this.questions = [];
		this.currentQuestion = 0;
		this.helpers = {
			split: true,
			phone: true,
			crowd: true
		};
	},

	init: function(gameData) {
		this.question = gameData.question;
		this.currentQuestion = gameData.currentQuestion;
		this.helpers = gameData.helpers;
	},

	getGameStats: function() {
		var gameStats = {
			questions: this.questions,
			currentQuestion: this.currentQuestion,
			helpers: this.helpers
		};
		return gameStats;
	},

	setQuestions: function(easyQ, mediumQ, hardQ) {
		var x = easyQ.concat(mediumQ.concat(hardQ));
		this.questions = [];

		for (var i = 0; i <  x.length; i++) {
			var everything = {};
			everything.question = x[i].question;

			var aux = x[i].incorrect_answers;
			aux.push(x[i].correct_answer);
			
			everything.correct_answer = x[i].correct_answer;
			var shuffle = this.getRandomAnswers(aux);
			everything.correctAnswerIndex = shuffle.indexOf(x[i].correct_answer);
			everything.answers = shuffle;
			everything.answer = null;

			this.questions.push(everything);
		}
	},

	getRandomAnswers: function(x) {
		var i,a,j;
		for(i = x.length; i>1; i--){
			j = Math.floor(Math.random() * i);
			a = x[i-1];
			x[i-1] = x[j];
			x[j] = a;
		}
		return x;
	},

	checkAnswer: function(answer) {
		answer = answer.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g,"");
		answer = answer.toUpperCase();
		var currentQuestion = this.getCurrentQuestion();
		return this.answerLetters.indexOf(answer) == currentQuestion.correctAnswerIndex;
	},

	getCurrentQuestion: function() {
		return this.questions[this.currentQuestion];
	},

	nextQuestion: function() {
		this.currentQuestion++;
	},

	getRandomText: function(param) {
		var randomIndex = Math.floor(Math.random() * this.texts[param].length); // Random Index position in the array 
		var txt = this.texts[param][randomIndex];

		// Replace prices and currentQuestionNr
		txt = txt
			.replace("{currentQuestionNr}", this.currentQuestion + 1)
			.replace("{prices}", this.prices[this.currentQuestion]);

		return txt;
	},

	splitHelper: function() {
		if(this.helpers.split == true) {  //nu a fost folosita varianta
			var q = this.getCurrentQuestion();
			var split = [];
			split.push(q.correctAnswerIndex);
			var incorrect = [];

			for(var i=0;i<4;i++) {
				if(i != q.correctAnswerIndex) {
					incorrect.push(i);
				}
			}

			var randomIndex = Math.floor(Math.random() * incorrect.length);
			split.push(incorrect[randomIndex]);
			
			for (var i = 0; i < q.answers.length; i++) {
				if (split.indexOf(i) == -1) {
					this.questions[this.currentQuestion].answers[i] = null;
				}
			}

			this.helpers.split=false;

			return true;
		}
		else {
			return false;
		}
	},

	phoneHelper: function() {
		if (!this.helpers.phone)
			return false;

		var chances = this.getChances(70);
		var decision = chances[this.rand(0, 99)];

		this.helpers.phone = false;

		return decision;
	},

	crowdHelper: function() {
		if (!this.helpers.crowd)
			return false;

		var crowdDecision = [0, 0, 0, 0];
		var crowdNr = 100;
		var chances = this.getChances(35);

		for (var i = 0; i < crowdNr; i++) {
			crowdDecision[chances[this.rand(0, 99)]]++;
		}

		this.helpers.crowd = false;

		return crowdDecision;
	},

	getChances: function(chance) {
		var chances = [];
		var q = this.getCurrentQuestion();
		var incorrect = [];
		for(var i=0;i<4;i++) {
			if(i != q.correctAnswerIndex) {
				incorrect.push(i);
			}
		}		

		for (var i = 0; i < chance; i++) {
			chances.push(q.correctAnswerIndex);
		}

		for (var j = 0; j < 100 - chance; j++) {
			chances.push(incorrect[this.rand(0, 2)]);
		}

		return chances;
	},

	rand: function(min, max) {
		return Math.round(min + Math.random() * (max - min));
	},

	readQuestion: function() {
		var question = this.getCurrentQuestion();
		var text = question.question + " ";

		console.log((this.currentQuestion + 1) + ") " + question.question);

		for (var i in question.answers) {
			if (question.answers[i] == null)
				continue;

			console.log(this.answerLetters[i] + ") " +
				question.answers[i]);

			text += this.answerLetters[i] + "; ";
			text += question.answers[i] + ". ";
		}

		console.log("Answer: " + question.correct_answer);

		return text;
	},

	phoneHelperResponse: function(result) {
		var text = "Hello, thanks for calling me. I think the correct answer is, " + this.answerLetters[result] + "!";
		return text;
	},

	crowdHelperResponse: function(result) {
		var text = "";
		
		text += "The crowd voted in favour of " + this.answerLetters[0] + " with the percentage of " + result[0] + ". ";
		text += "The crowd decided for " + this.answerLetters[1] + " in number of " + result[1] + ". ";
		text += "The percentage for " + this.answerLetters[2] + " is " + result[2] + ". ";
		text += "The number of people who voted for " + this.answerLetters[3] + " is " + result[3] + ". ";

		return text;
	},

	splitHelperResponse: function(response) {
		var q = this.getCurrentQuestion();
		console.log(q);
		var text = "";
		for (var i = 0; i < q.answers.length; i++) {
			if( q.answers[i] !== null) {
				text += this.answerLetters[i] + "; " + q.answers[i] + ". ";
			}
		}
		return "You used split helper, your remaining choices are: " + text;
	}
};

module.exports = GameController;