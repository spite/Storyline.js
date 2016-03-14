(function( self ){

	var KEY = {
		TIME: 0,
		EASING: 1,
		OPTION: 2,
		VALUE: 3,
		TYPE: 4
	};

	var types = new Array();
	var easings = new Array();

	var Storyline = function( story, timeScale ){

		return new Storyline.methods.initialize(story, timeScale);

	};

	Storyline.methods = Storyline.prototype = {
		constructor: Storyline,
		initialize: function( story, timeScale ){

			this.storyboard = new Object();

			this.timeScale = (parseFloat(timeScale) || 1);

			this.duration = 0;

			for( var key in story ){

				for( var step in story[key] ){

					var time = parseFloat(story[key][step].match(/^\s*([0-9]+\.?[0-9]*)/g)[0]);

					var easing = story[key][step].match(/([a-z]+)(?:\((.*)\))?/i);
					var easingMode = Storyline.getEasing(easing[1]);
					var easingOptions = (easing[2] != undefined ? easing[2].split(/\,/g) : null);

					var type = Storyline.getType((story[key][step].match(/([a-z0-9]+)\([^\)]+\)$/) || "")[1]);
					var extractedValue = story[key][step].match(/(?:(\-?\s*[0-9]+\.?[0-9]*)|\(([^\)]+)\))$/g)[0].match(/(\-?\s*[0-9]+\.?[0-9]*)/g);
					var value = extractedValue.map(function( number ){

						return parseFloat(number);

					});

					this.set(key, time, easingMode, easingOptions, value, type);

				};

			};

			return this;

		},
		set: function( key, time, easing, options, value, type ){

			time *= this.timeScale;

			this.duration = Math.max(this.duration, time);

			if( this.storyboard[key] == undefined ){

				this.storyboard[key] = new Array();

			};

			this.storyboard[key].push([time, easing, options, value, type]);

			this.storyboard[key].sort(function( before, after ){

				return before[0] - after[0];

			});

			return this;

		},
		get: function( key, now ){

			if( this.storyboard[key] != undefined ){

				var type = null;
				var values = new Array();

				for( var stepMax = this.storyboard[key].length - 1, step = stepMax; step >= 0; step-- ){

					type = (types[this.storyboard[key][step][KEY.TYPE]] || null);

					if( this.storyboard[key][step][KEY.TIME] <= now ){

						var from = this.storyboard[key][step];
						var to = this.storyboard[key][Math.min(step + 1, stepMax)];

						for( var valueIndex = 0, length = to[KEY.VALUE].length; valueIndex < length; valueIndex++ ){

							var difference = to[KEY.VALUE][valueIndex] - from[KEY.VALUE][valueIndex];
							var duration = to[KEY.TIME] - from[KEY.TIME];

							var elapsed = Math.min((((now - from[KEY.TIME]) / duration) || 0), 1);

							values[valueIndex] = from[KEY.VALUE][valueIndex] + (easings[to[KEY.EASING]][1](elapsed, 1, to[KEY.OPTION]) * difference);

						};

						break;

					}
					else if( step == 0 ){

						values = this.storyboard[key][step][KEY.VALUE];

						break;

					};

				};

				if( type != null ){

					values = type[1](values);

				};

				return (values.length == 1 ? values[0] : values);

			};

			return null;

		}
	};

	Storyline.methods.initialize.prototype = Storyline.methods;

	Storyline.registerType = function( name, typeFunction ){

		types.push([name, typeFunction]);

	};

	Storyline.getType = function( name ){

		for( var type = 0, length = types.length; type < length; type++ ){

			if( name == types[type][0] ){

				return type;

			};

		};

		return null;

	};

	Storyline.registerType("int", function( options ){

		for( var option = 0, length = options.length; option < length; option++ ){

			options[option] = parseInt(options[option]);

		};

		return options;

	});

	Storyline.registerType("bool", function( options ){

		for( var option = 0, length = options.length; option < length; option++ ){

			options[option] = (parseInt(options[option]) ? true : false);

		};

		return options;

	});

	Storyline.registerType("vec2", function( options ){

		options.x = options[0];
		options.y = options[1];

		return options;

	});

	Storyline.registerType("vec3", function( options ){

		options.x = options[0];
		options.y = options[1];
		options.z = options[2];

		return options;

	});

	Storyline.registerEasing = function( name, easingFunction ){

		easings.push([name, easingFunction]);

	};

	Storyline.getEasing = function( name ){

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

	Storyline.registerEasing("easeIn", function( elapsed, duration, options ){

		return elapsed * elapsed * elapsed;

	});

	Storyline.registerEasing("easeOut", function( elapsed, duration, options ){

		return (elapsed -= 1) * elapsed * elapsed + 1;

	});

	Storyline.registerEasing("easeInOut", function( elapsed, duration, options ){

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