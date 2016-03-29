# Storyline.js - JavaScript Animation Sequencer

**Storyline.js** is a library to help define a storyboard using natural language.

[Check all the demos](http://jordandelcros.github.io/Storyline.js/)

### How to?

The Storyline class only come with two options :
 - storyboard: a simple object containing all keyframes.
 - timescale: (optional) multiply all key's time with it. 

```javascript
    var storyline = new Storyline(storyboard [, timescale]);
```

#### Storyboard hierarchy

 - name: the name of the animation.
 - time: the begining of the current value to the next one in milliseconds.
 - easing: the easing to use.
 - value: the value(s) to animate (multiple values are between parenthesis).

```javascript
    {
        {name}: [
            "{time} {easing} to {value}",
            "{time} {easing} to {value}",
            "{time} {easing} to {value}"
        ],
        {name}: [
            "{time} {easing} to ({value}, {value}, {value})",
            "{time} {easing} to ({value}, {value}, {value})"
        ]
    }
```

#### Timing

Each key times are in milliseconds.

```javascript
    var storyline = new Storyline({
        key1: [
            "0 cut to 0",
            "500 linear to 1",
            "1000 linear to 2"
        ]
    });
```

You may need to create animations with a limited duration, you can use the `timescale` option to do that.
Each time will be multiplied by the `timescale`.

```javascript

    var duration = 5000; // timescale of 5s

    var storyline = new Storyline({
        key1: [
            "0 cut to 0",
            "0.3 linear to 3",
            "1 linear to 4"
        ]
    }, duration);
```

#### Easing

There is already some basic easings:
 - cut: immediately switch to the value if the time is upper or equal to the key.
 - linear: linearly interpolate to the value.
 - easeIn: ease in from the previous value to the key value.
 - easeOut: ease out from the previous value to the key value.
 - easeInOut: ease in and out from the previous value to the key value.
 - easeInElastic: ease in elastic from the previous value to the key value.
 - easeOutElastic: ease out elastic from the previous value to the key value.
 - easeInOutElastic: ease in and out elastic from the previous value to the key value.
 - easeInBounce: ease in bounce from the previous value to the key value.
 - easeOutBounce: ease out bounce from the previous value to the key value.
 - easeInOutBounce: ease in and out bounce from the previous value to the key value.
 - quadratic(from,c,to): get value along a qaudratic bezier curve (see [stackoverflow explainations](http://stackoverflow.com/questions/5634460/quadratic-bezier-curve-calculate-point)).
 - cubic(from,cx,cy,to): get value along a cubic bezier curve (see [stackoverflow explainations](http://stackoverflow.com/questions/5634460/quadratic-bezier-curve-calculate-point)).

But you can also register your own easings:

```javascript
    Storyline.registerEasing(customEasingName, function( elapsed, duration, options ){

        return (elapsed / duration); // Linear easing

    });
```

 - elpsed: normalized elpased time (between 0 and 1).
 - duration: normalized duration (always 1...)
 - options: array of values, only if the easing take options (parenthesis with parameters).

#### Type

You can animate one or many values in each keys but you can also use types:
 - int: only returns integers.
 - bool: return true if the value is upper or equal to 1, else return false.
 - vec2: return the values with `.x` and `.y` getters.
 - vec3: return the values with `.x`, `.y` and `.z` getters.
 - color: return the values with `.r`, `.g`, `.b`, `hex` and `hexString` getters.

But you can also register your own types:

`Storyline.registerType(name, getter, setter)`

```javascript
    Storyline.registerType("invert", function( options, originOptions ){

        for( var option = 0, length = options.length; option < length; option++ ){

            options[option] *= -1;

        };

        return options;

    }, function( options, originString ){

        return options;

    });

```

### Examples

#### Simple

```javascript
   var storyline = new Storyline({
    key1: [
        "0 cut to 0",
        "500 easeIn to 360",
        "1000 linear to 180"
    ],
    key2: [
        "500 cut to 180",
        "1000 lienar to 0"
    ]
   });

   function update( now ){

       window.requestAnimationFrame(update);

       var key1 = storyline.get("key1", now);
       var key2 = storyline.get("key2", now);

   };

   window.requestAnimationFrame(update);
```

#### With fixed duration

```javascript
   var storyline = new Storyline({
    key1: [
        "0 cut to 0",
        "0.5 easeIn to 360",
        "1 linear to 180"
    ],
    key2: [
        "0.5 cut to 180",
        "1 lienar to 0"
    ]
   }, 1000);

   function update( now ){

       window.requestAnimationFrame(update);

       var key1 = storyline.get("key1", now);
       var key2 = storyline.get("key2", now);

   };

   window.requestAnimationFrame(update);
```

[Check all the demos/examples](http://jordandelcros.github.io/Storyline.js/)

#### License

MIT licensed

Original idea from [Jaume Sanchez Elias](http://www.clicktorelease.com)
Entirely rewrited by [Jordan Delcros](http://www.jordan-delcros.com)