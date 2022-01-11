const fs = require('fs');
const termination = require('../../dist');

const frames = [
    fs.readFileSync('./pman1.txt', 'utf8'),
    fs.readFileSync('./pman2.txt', 'utf8'),
    fs.readFileSync('./pman3.txt', 'utf8')
];

const animation = new termination.Animation({
    fps: 30,
    maxSize: {
        height: 40,
        width: 300
    }
});

const packman = animation.add({
    x: 100,
    y: 0,
    content: frames[0],
    color: 'yellow'
});

const packmanFrames = packman.transition([
    {
        props: { content: frames[1] },
        duration: 40
    },
    {
        props: { content: frames[2] },
        duration: 40
    }
], { loop: true, alternate: true });

const packmanMove = packman.transition([
    {
        props: { x: -60 },
        duration: 1500,
        func: 'linear'
    }
], { loop: true });

animation.start();

packmanFrames.run();
packmanMove.run();
