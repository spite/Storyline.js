(function( self ){

	var KEY = {
		TIME: 0,
		EASING: 1,
		OPTIONS: 2,
		VALUE: 3
	};

	var easings = new Array();

	var Storyline = function( story, duration ){

		return new Storyline.methods.initialize(story, duration);

	};

	Storyline.methods = Storyline.prototype = {
		constructor: Storyline,
		initialize: function( story, duration ){

			this.storyboard = new Object();

			this.duration = (parseFloat(duration) || 1);

			for( var key in story ){

				for( var step in story[key] ){
					
					var time = parseFloat(story[key][step].match(/^\s*([0-9]+\.?[0-9]*)/g)[0]);

					var easing = story[key][step].match(/([a-z]+)(?:\((.*)\))?/);
					var easingMode = Storyline.getEasing(easing[1]);
					var easingOptions = (easing[2] != undefined ? easing[2].split(/\,/g) : null);

					var extractedValue = story[key][step].match(/(?:(\-?\s*[0-9]+\.?[0-9]*)|\(([^\)]+)\))$/g)[0].match(/(\-?\s*[0-9]+\.?[0-9]*)/g);
					var value = extractedValue.map(function( number ){

						return parseFloat(number);

					});

					this.set(key, time, easingMode, easingOptions, value);

				};

			};

			return this;

		},
		set: function( key, time, easing, options, value ){

			if( this.storyboard[key] == undefined ){

				this.storyboard[key] = new Array();

			};

			this.storyboard[key].push([(time * this.duration), easing, options, value]);

			this.storyboard[key].sort(function( before, after ){

				return before[0] - after[0];

			});

			return this;

		},
		get: function( key, now ){

			if( this.storyboard[key] != undefined ){

				for( var stepMax = this.storyboard[key].length - 1, step = stepMax; step >= 0; step-- ){

					if( this.storyboard[key][step][0] <= now ){

						var destinationTime = this.storyboard[key][Math.min(step + 1, stepMax)][KEY.TIME];
						var destinationEasing = this.storyboard[key][Math.min(step + 1, stepMax)][KEY.EASING];
						var destinationOptions = this.storyboard[key][Math.min(step + 1, stepMax)][KEY.OPTIONS];
						var destinationValues = this.storyboard[key][Math.min(step + 1, stepMax)][KEY.VALUE];

						var fromValues = this.storyboard[key][step][KEY.VALUE];

						var values = new Array();

						for( var valueIndex = 0, length = destinationValues.length; valueIndex < length; valueIndex++ ){

							var difference = destinationValues[valueIndex] - fromValues[valueIndex];

							var elapsed = Math.min(((now - fromValues[valueIndex]) / (destinationTime - fromValues[valueIndex]) || 0), 1);

							values[valueIndex] = fromValues[valueIndex] + (easings[destinationEasing][KEY.EASING](elapsed, 1, destinationOptions) * difference);

						};

						return (values.length == 1 ? values[0] : values);

					}
					else if( step == 0 ){

						var values = this.storyboard[key][step][KEY.VALUE];

						return (values.length == 1 ? values[0] : values);

					};

				};

			};

			return null;

		}
	};

	Storyline.methods.initialize.prototype = Storyline.methods;

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

	Storyline.registerEasing("cut", function( elapsed, duration, options ){

		return (elapsed < 1 ? 0 : 1);

	});

	Storyline.registerEasing("linear", function( elapsed, duration, options ){

		return (elapsed / duration);

	});

	Storyline.registerEasing("easein", function( elapsed, duration, options ){

		return elapsed * elapsed * elapsed;

	});

	Storyline.registerEasing("easeout", function( elapsed, duration, options ){

		return (elapsed -= 1) * elapsed * elapsed + 1;

	});

	Storyline.registerEasing("easeinout", function( elapsed, duration, options ){

		if( (elapsed /= duration / 2) < 1 ){

			return 0.5 * elapsed * elapsed * elapsed;

		}
		else {

			return 0.5 * ((elapsed -= 2) * elapsed * elapsed + 2);

		};

	});

	Storyline.registerEasing("quadratic", function( elapsed, duration, options ){

		var invertedElapsed = 1 - elapsed;
		var point1 = parseFloat(options[0]);
		var point2 = parseFloat(options[1]);
		var point3 = parseFloat(options[2]);

		return invertedElapsed * invertedElapsed * point1 + 2 * invertedElapsed * elapsed * point2 + elapsed * elapsed * point3;

	});

	Storyline.registerEasing("cubic", function( elapsed, duration, options ){

		var invertedElapsed = 1 - elapsed;
		var point1 = parseFloat(options[0]);
		var point2 = parseFloat(options[1]);
		var point3 = parseFloat(options[2]);
		var point4 = parseFloat(options[3]);

		return invertedElapsed * invertedElapsed * invertedElapsed * point1 + 3 * invertedElapsed * invertedElapsed * elapsed * point2 + 3 * invertedElapsed * elapsed * elapsed * point3 + elapsed * elapsed * elapsed * point4;

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