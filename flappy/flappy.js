$(document).ready(function() {

	var Pipe = function(top, speed) {
		var selector = ".pipe";

		this.element = {
			upper: $(selector + ".upper").first().clone().appendTo(GameController.gameArea).show(),
			lower: $(selector + ".lower").first().clone().appendTo(GameController.gameArea).show(),
		},
		this.position = {
			top: top,
			right: -100
		}

		this.startMove = function(element) {
			$(element).animate({
				right: GameController.gameArea.width() + 100
			}, speed, "linear", function() {
				if (element.is('.upper'))
					GameController.removePipe();
			});
		};

		this.stop = function() {
			this.element.upper.stop();
			this.element.lower.stop();			
		};

		this.element.upper.css(this.position);
		this.element.lower.css(this.position);
		this.element.lower.css("top", this.position.top + this.element.upper.height() + 150);
		this.startMove(this.element.upper);
		this.startMove(this.element.lower);
	};
	var Flappy = {
		element: $('#flappy'),
		position: {
			top: 300,
			left: 500
		},
		jumpDistance: 60,
		jumpTime: 400,
		fallTime: 500,

		init: function() {
			this.element.css(this.position).show();

			this.fallFlappy();
		},

		goUpFlappy: function() {
			var self = this;

			this.element.stop().animate({
				"top": self.element.position().top - this.jumpDistance
			}, this.jumpTime, "easeOutCirc", function() {
				self.fallFlappy();
			});

			$({deg: -30}).animate({deg: 0}, {
		        duration: 500,
		        step: function(now){
		            self.element.css({
		                 transform: "rotate(" + now + "deg)"
		            });
		        }
		    });
		},

		fallFlappy: function() {
			var self = this;

			this.element.stop().animate({
				"top": self.element.position().top +  (GameController.gameArea.height() - self.element.position().top)
			}, this.fallTime, "easeInCirc", function() {
				GameController.gameOver();
			});

			$({deg: 0}).animate({deg: 30}, {
		        duration: 500,
		        step: function(now){
		            self.element.css({
		                 transform: "rotate(" + now + "deg)"
		            });
		        }
		    });
		},

		dieFlappy: function() {
			var self = this;

			self.element.stop().animate({
				"top": self.element.position().top +  (GameController.gameArea.height() - self.element.position().top)
			}, this.fallTime, "easeInBack");

			$({deg: 0}).animate({deg: -180}, {
		        duration: 500,
		        step: function(now){
		            self.element.css({
		                 transform: "rotate(" + now + "deg)"
		            });
		        }
		    });
		}
	};

	var GameController = {
		gameArea: $('#game-area'),
		player: Flappy,
		pipes: [],
		speed: 6500,
		timer: null,
		tick: null,
		started: false,
		currentPipe: null,
		score: 0,	

		generatePipe: function() {
			this.pipes.push(new Pipe(this.rnd(0, 150) * -1, this.speed));
		},

		start: function() {
			var self = this;
			
			if (!this.started) {
				self.score = 0;
				self.currentPipe = null;

				// Empty pipes
				while (self.pipes.length) {
					self.removePipe();
				}

				this.pipeGenerator();

				this.player.init();

				this.startTick();

				this.started = true;
			}
			else {
				this.player.goUpFlappy();
			}
		},

		startTick: function() {
			var self = this;

			self.tick = setInterval(function() {
				// If Flappy flies too height
				if (self.player.element.position().top <= 0) {
					self.gameOver();
				}

				if (self.pipes.length) {
					// Get current pipe
					for(var pipe in self.pipes) {
						if (self.pipes[pipe].element.upper.position().left > self.player.element.position().left - self.pipes[pipe].element.upper.width()) {

							if (self.currentPipe !== null && self.currentPipe != self.pipes[pipe]) {
								self.score++;
							}

							self.currentPipe = self.pipes[pipe];
							break;
						}
					}

					if (self.overlaps(self.player.element, self.currentPipe.element.upper) ||
						self.overlaps(self.player.element, self.currentPipe.element.lower)) {
						self.gameOver();
						var bestScore = getCookie("highscore");
						if(bestScore<self.score)	
						{
							setCookie("highscore",self.score,7);
						}
					}
				}

				$('#score').text(self.score);
				$('#high-score').text(getCookie("highscore"));
			}, 50);
		},

		gameOver: function() {
			var self = this;

			// Stop tick
			clearInterval(self.tick);

			// Stop pipe generating
			clearTimeout(self.timer);

			// Stop pipes moving
			for (var pipe in self.pipes) {
				self.pipes[pipe].stop();
			}

			// Kill Flappy
			self.player.dieFlappy();

			self.started = false;
		},

		pipeGenerator: function() {
			this.timer = setTimeout(function(self) {
				self.generatePipe();
				self.pipeGenerator();
			}, this.rnd(1, 3) * 1000, this);
		},

		removePipe: function() {
			this.pipes[0].element.upper.remove();
			this.pipes[0].element.lower.remove();
			this.pipes.splice(0, 1);
		},

		rnd: function(min, max) {
			return Math.round(min + Math.random() * (max - min));
		},

		overlaps: (function () {
		    function getPositions( elem ) {
		        var pos, width, height;
		        pos = $( elem ).position();
		        width = $( elem ).width();
		        height = $( elem ).height();
		        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
		    }

		    function comparePositions( p1, p2 ) {
		        var r1, r2;
		        r1 = p1[0] < p2[0] ? p1 : p2;
		        r2 = p1[0] < p2[0] ? p2 : p1;
		        return r1[1] > r2[0] || r1[0] === r2[0];
		    }

		    return function ( a, b ) {
		        var pos1 = getPositions( a ),
		            pos2 = getPositions( b );
		        return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
		    };
		})()
	};


	$(document).on("keypress", function(e) {
		if (e.which == 32) {
			GameController.start();
		}
	});	
});





function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return 0;
}