import { EOL } from 'os';
import { EventEmitter } from 'events';
import Terminal, { EVENTS as TERMINAL_EVENTS } from './Terminal';
import ObjectsManagerClass from './ObjectsManager';
import { objToArray, validateInstance } from './utils';
import 'colors';

const BASE_TIMER_KEY = 'BASE';

export const EVENTS = {
    WILL_RENDER: 'willrender',
    RENDER: 'render'
};

export default class Render extends EventEmitter {
    constructor(ObjectsManager, props = {}) {
        super();

        const { fps = this.defaults.fps, maxSize = this.defaults.maxSize, speed = 1, bg = {} } = props;

        validateInstance(ObjectsManager, ObjectsManagerClass);

        this.renderExecutor = this.renderExecutor.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.Terminal = new Terminal();
        this.ObjectsManager = ObjectsManager;

        this.fps = fps;
        this.speed = speed;
        this.maxSize = maxSize;
        this.bg = bg;
        this.isPlaying = false;
        this.lastPrinted = '';
        this.timers = {};

        this.Terminal.setCursorVisibility(true);
    }

    defaults = {
        fps: 30,
        maxSize: {}
    };

    cleanUp() {
        this.Terminal.removeListener(TERMINAL_EVENTS.RESIZE, this.handleResize);
        objToArray(this.timers).forEach(timer => clearTimeout(timer));
    }

    subscribeListeners() {
        this.Terminal.on(TERMINAL_EVENTS.RESIZE, this.handleResize);
    }

    handleResize(width, height) {
        this.setSize(width, height, true);
    }

    setSize(width = this.Terminal.getWidth(), height = this.Terminal.getHeight()) {
        const { height: maxHeight, width: maxWidth } = this.maxSize;
        const finalHeight = maxHeight ? Math.min(height, maxHeight) : height;
        const finalWidth = maxWidth ? Math.min(width, maxWidth) : width;

        this.size = {
            width: finalWidth,
            height: finalHeight
        };
    }

    renderExecutor(noClear) {
        this.render(noClear);

        if (this.isPlaying) {
            clearTimeout(this.timers[BASE_TIMER_KEY]);
            this.timers[BASE_TIMER_KEY] = setTimeout(this.renderExecutor, parseInt(1000 / this.fps));
        }
    }

    getRenderMap() {
        const out = {};
        const timePassed = this.speed * 1000 / this.fps;
        const objects = this.ObjectsManager.getObjects(timePassed);

        for (const objKey in objects) {
            const object = objects[objKey];
            const replaceSpace = object.state.replaceSpace;

            if (!object) {
                continue;
            }

            const { x, y, lines, color } = object.state;

            for (let lineIndex in lines) {
                lineIndex = parseInt(lineIndex);
                const line = lines[lineIndex];

                for (let i = 0; i < line.length; i++) {
                    if (replaceSpace && line[i] === ' ') {
                        continue;
                    }

                    this.setRenderMapCell(out, x + i, y + lineIndex, line[i], color);
                }
            }
        }

        return out;
    }

    setRenderMapCell(obj, x, y, chr, color) {
        const roundX = Math.round(x);
        const roundY = Math.round(y);

        if (!obj[roundY]) {
            obj[roundY] = {};
        }

        obj[roundY][roundX] = color ? chr[color] : chr;
    }

    render(noClear) {
        this.emit(EVENTS.WILL_RENDER);

        const { height, width } = this.size;
        const renderMap = this.getRenderMap();
        let renderString = '';

        const bgChar = this.bg.char || ' ';
        const color = this.bg.color;
        const coloredBgChar = (bgChar && bgChar.trim() && color) ? bgChar[color] : bgChar;

        for (let y = 0; y < height; y++) {
            const isLastLine = y === height - 1;

            for (let x = 0; x < width; x++) {
                const chr = renderMap[y]
                    ? renderMap[y][x] || coloredBgChar
                    : coloredBgChar;

                renderString += chr;
            }

            if (!isLastLine) {
                renderString += EOL;
            }
        }

        this.paint(renderString, noClear);

        this.emit(EVENTS.RENDER, renderString);
    }

    paint(str, noClear) {
        if (str === this.lastPrinted) {
            return;
        }

        if (!noClear) {
            this.Terminal.clear();
        }

        this.Terminal.write(str);
        this.lastPrinted = str;
    }

    /**
     * External
     */

    config({ fps = this.fps, maxSize = this.maxSize, speed = this.speed, bg = {} }) {
        this.fps = fps;
        this.maxSize = maxSize;
        this.speed = speed;
        this.bg = {
            ...this.bg,
            ...bg
        };
    }

    resume(append) {
        if (this.isPlaying) {
            return;
        }

        this.isPlaying = true;
        this.Terminal.setCursorVisibility(false);
        this.setSize();
        this.subscribeListeners();
        this.renderExecutor(append);
    }

    pause(clear) {
        if (!this.isPlaying) {
            return;
        }

        this.isPlaying = false;
        this.Terminal.setCursorVisibility(true);
        this.cleanUp();

        if (clear) {
            this.Terminal.clear();
        }
    }

    end(clear) {
        this.isPlaying = false;
        this.cleanUp();
        this.timers = {};
        this.Terminal.setCursorVisibility(true);

        if (clear) {
            this.Terminal.clear();
        } else {
            this.Terminal.write(EOL);
        }
    }
}
