import { v4 as uuidv4 } from 'uuid';
import TransitionManager from './TransitionManager';
import Object from './Object';

export default class ObjectsManager {
    constructor() {
        this.TransitionManager = new TransitionManager();
        this.objects = {};
    }

    remove = (key) => () => {
        delete this.objects[key];
    };

    transition = (key) => (steps, options) => {
        const object = this.objects[key];

        return this.TransitionManager.Transition(object, steps, options);
    };

    /**
     * External
     */

    getObjects(timePassed) {
        this.TransitionManager.applyAll(timePassed);

        return this.objects;
    }

    add(...args) {
        const key = uuidv4();
        const ObjectInstance = new Object(...args, this.remove(key), this.transition(key));

        this.objects[key] = ObjectInstance;

        return ObjectInstance;
    }

    pause() {
        return this.TransitionManager.pauseAll(true);
    }

    resume() {
        return this.TransitionManager.resumeAll(true);
    }

    pauseAllTransitions() {
        return this.TransitionManager.pauseAll();
    }

    resumeAllTransitions() {
        return this.TransitionManager.resumeAll();
    }

    end() {
        return this.TransitionManager.endAll();
    }
}
