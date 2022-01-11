const fs = require('fs');
const termination = require('../../dist');

const manFrames = [
    fs.readFileSync('./man1.txt', 'utf8'),
    fs.readFileSync('./man2.txt', 'utf8'),
    fs.readFileSync('./man3.txt', 'utf8'),
    fs.readFileSync('./man4.txt', 'utf8'),
    fs.readFileSync('./man5.txt', 'utf8')
];

const sunFrames = [
    fs.readFileSync('./sun1.txt', 'utf8'),
    fs.readFileSync('./sun2.txt', 'utf8')
];

const animation = new termination.Animation();

const sun = animation.add({
    x: 40,
    y: 0,
    content: sunFrames[0],
    replaceSpace: true,
    color: 'yellow'
});

const man = animation.add({
    x: 0,
    y: 10,
    content: manFrames[0],
    replaceSpace: true,
    color: 'green'
});

const manFramesTransition = man.transition([
    {
        props: { content: manFrames[1] },
        duration: 100
    },
    {
        props: { content: manFrames[2] },
        duration: 100
    },
    {
        props: { content: manFrames[3] },
        duration: 100
    },
    {
        props: { content: manFrames[4] },
        duration: 100
    }
], { loop: true, loopInterval: 100 });

const sunFramesTransition = sun.transition([
    {
        props: { content: sunFrames[1] },
        duration: 100
    }
], { loop: true, alternate: true });

const manMoveTransition = man.transition([
    {
        props: { x: 130 },
        duration: 5000,
        func: 'linear'
    }
], { loop: true });

animation.start();

manFramesTransition.run();
manMoveTransition.run();
sunFramesTransition.run();
