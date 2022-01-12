# Termination [![npm-shield]][npm]
> Terminal animation done right!

## Demo
### The Man
[Source Code][demo-source-man]

[demo-video-man]

### Packman
[Source Code][demo-source-packman]

[demo-video-packman]

### Newton Cradle
[Source Code][demo-source-newton-cradle]

[demo-video-newton-cradle]

### Easing Transition
[Source Code][demo-source-easing]

[demo-video-easing]

__Any contribution to demo section is very welcome. To add your demos, you can create a PR for `/examples`__

## Features

- Promise based API
- Transition tools
- Built in easing transition functions
- Animation can be paused, log some thing in console and then continue without touching original CLI logs

## Installation

```
npm i termination
```
or
```
yarn add termination
```

## Usage

These are some basic use cases, for complete API check [API section](#api) 

```js
import { Animation } from 'termination';

// object frames
const cradleFrames = [
    '╔════╤╤╤╤════╗\n' +
    '║    │││ \\   ║\n' +
    '║    │││  O  ║\n' +
    '║    OOO     ║',

    '╔════╤╤╤╤════╗\n' +
    '║    ││││    ║\n' +
    '║    ││││    ║\n' +
    '║    OOOO    ║',

    '╔════╤╤╤╤════╗\n' +
    '║   / │││    ║\n' +
    '║  O  │││    ║\n' +
    '║     OOO    ║',

    '╔════╤╤╤╤════╗\n' +
    '║    ││││    ║\n' +
    '║    ││││    ║\n' +
    '║    OOOO    ║'
];

 
const stickmanFrames = [
`    
     O
     │
    / \\`,
`    
     O
     │
     |`,
`    
     O
     │
    / \\`,
]


// create animation instance
const animation = new Animation({
    fps: 30,
    maxSize: {
        width: 80,
        height: 10,
    }
});

// create objects
const cradle = animation.add({
    x: 0,
    y: 0,
    content: cradleFrames[0],
    replaceSpace: true,
    color: 'cyan'
});

let stickman = animation.add({
    x: -20,
    y: 0,
    content: stickmanFrames[0],
    replaceSpace: true,
    color: 'green'
});

// create content transition, can be useful
// if the object has different frames
// loop option means transtion will loop,
// loop interval is the interval between loops
const cradleFramesTransition = cradle.transition([
    {
        props: { content: cradleFrames[1] },
        duration: 300
    },
    {
        props: { content: cradleFrames[2] },
        duration: 300
    },
    {
        props: { content: cradleFrames[3] },
        duration: 300
    }
], { loop: true, loopInterval: 300 });

const stickmanFramesTransition = stickman.transition([
    {
        props: { content: stickmanFrames[1] },
        duration: 100
    },
    {
        props: { content: stickmanFrames[2] },
        duration: 100
    }
], { loop: true, loopInterval: 100 });

// create movement transition, check API section
// for available transition functions. You can also
// use any custom transition function
// alternate means it will repeat back and forth
const cradleMoveTransition = cradle.transition([
    {
        props: { x: 60 },
        duration: 1500,
        func: 'ease'
    }
], { loop: true, alternate: true }); 

const stickmanMoveTransition = stickman.transition([
    {
        props: { x: 80 },
        duration: 5000,
        func: 'linear'
    },
], {loop: true})

// start renering frames
animation.start();

// run transitions, this will return a promis that resolves 
// when transition is completed
cradleFramesTransition.run();
cradleMoveTransition.run();

// pause cradle movement transition
setTimeout(() => cradleMoveTransition.pause(), 2000);
// resume cradle movement transition
setTimeout(() => cradleMoveTransition.resume(), 4000);

// set stickman object props
setTimeout(() => stickman.update({x: 0, y: 0}), 5000);
// start stickman transitions
setTimeout(() => stickmanMoveTransition.run(), 6000);
setTimeout(() => stickmanFramesTransition.run(), 6000);



// pause animation
setTimeout(() => animation.pause(), 8000);
// resume animation
setTimeout(() => animation.resume(), 10000);

// update animation config
// set background character and color, 
// playback speed (creating slow motion effect) and fps
setTimeout(() => animation.config({
    fps: 60,
    speed: 0.5,
    bg: {char: '.', color: 'gray'}
}), 12000);

// end animation
setTimeout(() => animation.end(), 20000);
```

## API

- [Class: Animation([options])](#class-animationoptions)
    - [Event: 'willrender'](#event-willrender)
    - [Event: 'render'](#event-render)
    - [Animation.config([options])](#animationconfigoptions)
    - [Animation.start()](#animationstart)
    - [Animation.pause([options])](#animationpause)
    - [Animation.resume([options])](#animationresume)
    - [Animation.add([props])](#animationadd)
    - [Animation.pauseAllTransitions()](#animationpauseAllTransitions)
    - [Animation.resumeAllTransitions()](#animationresumeAllTransitions)
    - [Animation.end([options])](#animationend)

- [Class: AnimationObject](#class-animationbbject)
    - [AnimationObject.update(props)](#animationObjectupdateprops)
    - [AnimationObject.transition(steps[, options])](#animationObjecttransitionsteps-options)
    - [AnimationObject.remove()](#animationObjectremove)

- [Class: Transition](#class-transition)
    - [Transition.run([callback])](#transitionruncallback)
    - [Transition.pause()](#transitionpause)
    - [Transition.resume()](#transitionresume)
    - [Transition.end()](#transitionend)

### Class: Animation([options])

The base class for animation
- __`options`__ `<Object>`
    - __`fps`__ `<number>` frames per second, default is `30`
    - __`maxSize`__ `<Object>` 
        - __`height`__ `<number>`
        - __`width`__ `<number>`
    - __`speed`__ `<number>` playback speed
    - __`bg`__ `<Object>`
        - __`char`__ `<string>` character to fill background, default is ` `
        - __`color`__ `<string>` background character color, default is `white`

<br />

   #### Event: 'willrender'
   emitted right before starting render calculations
   
   #### Event: 'render'
   emitted right after painting

   #### Animation.config([options])
   change animation configuration. options are same as Animation [constructor](#)

   #### Animation.start()
   start rendering animation frames

   #### Animation.pause([options])
   pause rendering animation frames
   - __`options`__ `<Object>`
       - __`clear`__ `<boolean>` if `true`, will remove animation canvas after pausing the animation

   #### Animation.resume([options])
   resume rendering animation frames
   - __`options`__ `<Object>`
       - __`append`__ `<boolean>` if `true`, will not clear animation canvas before resuming render

   #### Animation.add([props])
   add an object to animation
   - __`props`__ `<Object>`
       - __`x`__ `<number>` 
       - __`y`__ `<number>` 
       - __`content`__ `<string>` object content
       - __`color`__ `<string>` object color, default is `white`
       - __`replaceSpace`__ `<boolean>` if `true`, spaces in content will be ignored. default is `false`
       - __`visible`__ `<boolean>`
   - __Returns__: `<AnimationObject>` 
    
   #### Animation.pauseAllTransitions()
   pause all transitions

   #### Animation.resumeAllTransitions()
   resume all transitions

   #### Animation.end([options])
   end animation 
   - __`options`__ `<Object>`
       - __`clear`__ `<boolean>` if `true`, will remove animation canvas after pausing the animation

   
### Class: AnimationObject
Each object in animation is an instance of this class

   #### AnimationObject.update(props)
   update object props
   - __`props`__ `<Object>`
       - __`x`__ `<number>` 
       - __`y`__ `<number>` 
       - __`content`__ `<string>` object content
       - __`color`__ `<string>` object color, default is `white`
       - __`replaceSpace`__ `<boolean>` if `true`, spaces in content will be ignored. default is `false`
       - __`visible`__ `<boolean>`

   #### AnimationObject.transition(steps[, options])
   create transition for object props
   - __`steps`__ `<array>` array of step objects
       - __`props`__ `<Object>` object containing any valid object props
       - __`duration`__ `<number>` duration of transition to props of this step
   - __`options`__ `<Object>`
       - __`loop`__ `<boolean> | <number>` if `true`, will loop forever. if number, will loop `number` times
       - __`loopInterval`__ `<number>` delay between loops
       - __`alternate`__ `<boolean>` if `true`, transition direction will be reversed after each cycle
   - __Returns__: `<Transition>`

   #### AnimationObject.remove()
   remove the object from animation

### Class: Transition
Transition of any props of an object

   #### Transition.run([callback])
   start the transition, will return a promise that resolves once transition is finished
   - __`callback`__ `<Function>`
   - __Returns__: `<Promise>`

   #### Transition.pause()

   #### Transition.resume()

   #### Transition.end()
   will end the transition. callback will be called and promise will resolve

## Contribution

Any contribution is welcome. Especially for Readme and Demos. To see the list of priority features, [check here][todo]

[npm]: https://www.npmjs.com/package/termination
[npm-shield]: https://img.shields.io/badge/npm-1.0.3-green?style=flat-square
[demo-video-man]: https://user-images.githubusercontent.com/46329768/149027935-b6af7a4d-2659-4b00-a9d5-6cc4a1a9a295.mp4
[demo-video-packman]: https://user-images.githubusercontent.com/46329768/149027691-9afbac16-7685-47be-89bc-66595b7921d8.mp4
[demo-video-newton-cradle]: https://user-images.githubusercontent.com/46329768/149027721-7bd02dc8-d512-42bb-bd3e-e8c1f1f14105.mp4
[demo-video-easing]: https://user-images.githubusercontent.com/46329768/149027561-ff9df0b6-5071-4fdb-9275-50a53349c80a.mp4
[demo-source-man]: /examples/Man
[demo-source-packman]: /examples/Packman
[demo-source-newton-cradle]: /examples/CradleMan
[demo-source-easing]: /examples/Easing
[todo]: /TODO.md
