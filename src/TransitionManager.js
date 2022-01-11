import { v4 as uuidv4 } from 'uuid';
import Transition from './Transition';

export default class TransitionManager {
    constructor() {
        this.transitions = {};
    }

    callAll(method, ...args) {
        for (const transitionKey in this.transitions) {
            const TransitionInstance = this.transitions[transitionKey];

            TransitionInstance[method](...args);
        }
    }

    run(key, callBack) {
        return this.checkIfExists(key).run(callBack);
    }

    pause(key) {
        return this.checkIfExists(key).pause();
    }

    resume(key) {
        return this.checkIfExists(key).resume();
    }

    end(key) {
        this.checkIfExists(key).end();

        delete this.transitions[key];
    }

    checkIfExists(key) {
        const TransitionInstance = this.transitions[key];

        if (!TransitionInstance) {
            throw new Error('Transition not found');
        }

        return TransitionInstance;
    }

    remove = (key) => () => {
        delete this.transitions[key];
    };

    /**
     * External
     */

    Transition(...args) {
        const key = uuidv4();
        const TransitionInstance = new Transition(...args, this.remove(key));

        this.transitions[key] = TransitionInstance;

        return TransitionInstance;
    }

    applyAll(timePassed) {
        return this.callAll('apply', timePassed);
    }

    pauseAll(isAuto) {
        return this.callAll('pause', isAuto);
    }

    resumeAll(isAuto) {
        return this.callAll('resume', isAuto);
    }

    endAll() {
        return this.callAll('end');
    }
}
