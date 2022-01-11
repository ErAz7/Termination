import { EventEmitter } from 'events';

export const EVENTS = {
    RESIZE: 'resize'
};

export default class Terminal extends EventEmitter {
    constructor() {
        super();

        this.handleResize = this.handleResize.bind(this);

        this.subscribeListeners();
        this.lastWritten = '';
    }

    subscribeListeners() {
        process.stdout.on('resize', this.handleResize);
    }

    removeListeners() {
        process.stdout.removeListener('resize', this.handleResize);
    }

    handleResize(...args) {
        this.emit(EVENTS.RESIZE, ...args);
    }

    /**
     * External
     */

    clear() {
        const split = this.lastWritten.split('\n');
        const cols = split[0].length;
        const rows = split.length - 1;

        process.stdout.moveCursor(-cols, -rows);
        process.stdout.clearScreenDown();
    }

    write(str) {
        process.stdout.write(str);
        this.lastWritten = str;
    }

    refresh(str) {
        this.clear();
        this.write(str);
    }

    getHeight() {
        return process.stdout.rows;
    }

    getWidth() {
        return process.stdout.columns;
    }

    getSize() {
        return {
            width: process.stdout.columns,
            height: process.stdout.rows
        };
    }

    setCursorVisibility(isVisible) {
        if (isVisible) {
            process.stdout.write('\x1B[?25h');
        } else {
            process.stdout.write('\x1B[?25l');
        }
    }

    end() {
        this.removeListeners();
    }
}
