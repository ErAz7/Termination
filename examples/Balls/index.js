const BezierEasing = require('bezier-easing');
const { Animation } = require('../../dist');

const ball = `
 .ohmmds.
.NMMMMMMN-
.NMMMMMMN-
 .ohdmho.`;

const animation = new Animation({
    fps: 30
});

const ballsProps = [
    {
        label: 'linear',
        color: 'white',
        y: 0,
        func: 'linear'
    },
    {
        label: 'ease',
        color: 'red',
        y: 5,
        func: 'ease'
    },
    {
        label: 'ease-i',
        color: 'green',
        y: 10,
        func: 'ease-in'
    },
    {
        label: 'ease-ou',
        color: 'cyan',
        y: 15,
        func: 'ease-out'
    },
    {
        label: 'ease-in-out',
        color: 'yellow',
        y: 20,
        func: 'ease-in-out'
    },
    {
        label: 'cubic-bezier(0.89, -0.35, 0.46, 1.9)',
        color: 'gray',
        y: 25,
        func: t => new BezierEasing(0.89, -0.35, 0.46, 1.9)(t)
    }
];

ballsProps.map(ballProp => animation.add({
    x: 0,
    y: ballProp.y,
    content: ballProp.label + ':',
    color: ballProp.color
}));

const balls = ballsProps.map(ballProp => animation.add({
    x: 0,
    y: ballProp.y,
    content: ball,
    rplaceSpace: true,
    color: ballProp.color
}));

const transitions = balls.map((ballProp, index) => ballProp.transition([
    {
        props: { x: 60 },
        duration: 1000,
        func: ballsProps[index].func
    }
], { loop: true, alternate: true, loopInterval: 300 }));

animation.start();

transitions.forEach(transition => transition.run());
