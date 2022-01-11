const { Animation } = require('../../dist');

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
    / \\`
];

// create animation instance
const animation = new Animation({
    fps: 30,
    maxSize: {
        width: 80,
        height: 10
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

const stickman = animation.add({
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
    }
], { loop: true });

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
setTimeout(() => stickman.update({ x: 0, y: 0 }), 5000);
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
    bg: { char: '.', color: 'gray' }
}), 12000);

// end animation
setTimeout(() => animation.end(), 20000);
