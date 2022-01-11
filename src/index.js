import { EventEmitter } from 'events';
import EventProxy from './EventProxy';
import Render, { EVENTS as RENDER_EVENTS } from './Render';
import ObjectsManager from './ObjectsManager';
import { objToArray } from './utils';

export class Animation extends EventEmitter {
    constructor(props = {}) {
        super();

        this.ObjectsManager = new ObjectsManager();
        this.Render = new Render(this.ObjectsManager, {
            fps: props.fps,
            maxSize: props.maxSize,
            speed: props.speed,
            bg: props.bg
        });
        this.EventProxy = new EventProxy(this, this.Render, objToArray(RENDER_EVENTS));
    }

    /**
     * External
     */

    config(options) {
        return this.Render.config(options);
    }

    start() {
        this.Render.resume();
    }

    resume({ append } = {}) {
        this.Render.resume(append);
        this.ObjectsManager.resume();
    }

    pause({ clear } = {}) {
        this.Render.pause(clear);
        this.ObjectsManager.pause();
    }

    pauseAllTransitions() {
        this.ObjectsManager.pauseAllTransitions();
    }

    resumeAllTransitions() {
        this.ObjectsManager.resumeAllTransitions();
    }

    add(props) {
        return this.ObjectsManager.add(props);
    }

    end({ clear } = {}) {
        this.EventProxy.end();
        this.Render.end(clear);
        this.ObjectsManager.end();
    }
}
