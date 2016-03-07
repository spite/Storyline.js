(function( self ){

	var easings = new Array();

	var Storyline = function( story, duration ){

		return Storyline.methods.initialize(story, duration);

	};

	Storyline.methods = Storyline.prototype = {
		constructor: Storyline,
		initialize: function( story, duration ){

			this.storyboard = new Object();

			this.duration = (parseFloat(duration) || 1);

			for( var key in story ){

				for( var step in story[key] ){

					var parameters = story[key][step].split(/\s+/);
					var time = parseFloat(parameters[0]);
					var easing = Storyline.getEasing(parameters[1]);
					var value = parseFloat(parameters[3]);

					this.set(key, time, easing, value);

				};

			};

			return this;

		},
		set: function( key, time, easing, value ){

			if( this.storyboard[key] == undefined ){

				this.storyboard[key] = new Array();

			};

			this.storyboard[key].push([(time * this.duration), easing, value]);

			this.storyboard[key].sort(function( before, after ){

				return before[0] - after[0];

			});

			return this;

		},
		get: function( key, now ){

			if( this.storyboard[key] != undefined ){

				for( var stepMax = this.storyboard[key].length - 1, step = stepMax; step >= 0; step-- ){

					if( this.storyboard[key][step][0] <= now ){

						var timeDestination = this.storyboard[key][Math.min(step + 1, stepMax)][0];
						var easingDestination = this.storyboard[key][Math.min(step + 1, stepMax)][1];
						var valueDestination = this.storyboard[key][Math.min(step + 1, stepMax)][2];
						var valueDifference = valueDestination - this.storyboard[key][step][2];
						var elapsedTime = Math.min((now - this.storyboard[key][step][0]) / (timeDestination - this.storyboard[key][step][0]) || 0, 1);

						return this.storyboard[key][step][2] + (easings[easingDestination][1](elapsedTime, 1) * valueDifference);

					};

				};

			};

			return null;

		}
	};

	Storyline.registerEasing = function( name, easingFunction ){

		easings.push([name.toLowerCase(), easingFunction]);

	};

	Storyline.getEasing = function( name ){

		name = name.toLowerCase();

		for( var easing = 0, length = easings.length; easing < length; easing++ ){

			if( name == easings[easing][0] ){

				return easing;

			};

		};

		return null;

	};

	Storyline.registerEasing("cut", function( elapsed, duration ){

		return (elapsed < 1 ? 0 : 1);

	});

	Storyline.registerEasing("linear", function( elapsed, duration ){

		return (elapsed / duration);

	});

	Storyline.registerEasing("easein", function( elapsed, duration ){

		return elapsed * elapsed * elapsed;

	});

	Storyline.registerEasing("easeout", function( elapsed, duration ){

		return (elapsed -= 1) * elapsed * elapsed + 1;

	});

	Storyline.registerEasing("easeinout", function( elapsed, duration ){

		if( (elapsed /= duration / 2) < 1 ){

			return 0.5 * elapsed * elapsed * elapsed;

		}
		else {

			return 0.5 * ((elapsed -= 2) * elapsed * elapsed + 2);

		};

	});

	if( typeof define !== "undefined" && define instanceof Function && define.amd != undefined ){

		define(function(){

			return Storyline;

		});

	}
	else if( typeof module !== "undefined" && module.exports ){

		module.exports = Storyline;

	}
	else if( self != undefined ){

		self.Storyline = Storyline;

	};

})(self || {});