# Storyline.js - Multi-purpose sequencer

**Storyline.js** is a library to help define a storyboard using natural language.

This is the refined and polished version of the sytem created for [BEYOND](http://b-e-y-o-n-d.com/) and [cru·ci·form](http://www.clicktorelease.com/code/cruciform/).

Check out the example to see it in action: [Storyline.js with CSS 2D transforms](http://www.clicktorelease.com/tools/storylinejs/).

[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/mQVU3Lb0D-w/0.jpg)](http://www.youtube.com/watch?v=mQVU3Lb0D-w)

#### Using Storyline.js ####

There's two parts: Storyline.js is the parser and player, and then a storyboard source object that defines the story. A storyline source has this format:

```json
{
    "value1": [
        "0 cut to 10",
        "2 linear to 3"
    ],
    
    "value2": [
        "0 cut to 0",
        "4 easeinout to 1",
        "6 easeinout to 0"
    ]
}
```

This source object is a map of keys (each key is a value that you will be using in your code *x*, *angle*, *power*, etc.), and each key contains an array of entries. Each entry defines a point in time, and a storyline action, and has the following syntax:

```
{time in seconds} {action to perform} {value of action}
```

The actions are:

- *cut to* instanteously changes to {value}
- *linear to* will linearly interpolate from the last defined value to {value}
- *easein to* will ease in from the last defined value to {value}
- *easeout to* will ease out from the last defined value to {value}
- *easeinout to* will ease in and out from the last defined value to {value}

and you can register your own easing with the "registerEasing" method.

#### Minimal example ####

Include Storyline.js

```html
<script src="Storyline.js"></script>
```

Create a storyline from a structured storyboard source. By calling storyline.get you can get the updated value:

```js
var storyline = STORYLINE.parseStoryline( {

    "value1": [
        "0 cut to 0",
        "5 easeinout to 1",
        "10 easeinout to 0"
    ]
    
} );

function update() {
    
    requestAnimationFrame( update );
    console.log( storyline.get( 'value1', ( Date.now() / 1000 ) % 10 ) );
    
}

update();
```

#### External storyboard example ####

Simply export the storyline into its own file, and include it like a normal script.

```js
var storyline = new Storyline({

    "value1": [
        "0 cut to 0",
        "5 easeinout to 1",
        "10 easeinout to 0"
    ]
    
});
```

Or load the content with AJAX and parse it when it's loaded:

```js
var oReq = new XMLHttpRequest();
oReq.onload = function() {
	storyline = new Storyboard(this.responseText);
	/* ready to use */
};
oReq.open('get', 'storyboard.json', true);
oReq.send();
```

#### Register an easing function ####

```js
Storyline.registerEasing("easingname", function( elapsed, duration ){
   
   return elaped / duration; // linear easing

});
```

### Status ####

This is the first release. Next steps are to add syntax to control the easing functions, probably something like:

```
{time} ease to {value} { [ set of easing control points] }
```

Also, support specific functions to simplify animations:

```
{time} {wiggle|shake} {extent}
```

As always: forks, pull requests and code critiques are welcome!

#### License ####

MIT licensed

Copyright (C) 2015 Jaume Sanchez Elias, http://www.clicktorelease.com