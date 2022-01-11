import BezierEasing from 'bezier-easing';
import { definedOnly, selectProps } from './utils';

export default class Transition {
    constructor(object, steps, { loop = false, alternate = false, loopInterval = 0 }, onFinish) {
        this.state = {
            isRunning: false,
            loop: loop,
            alternate: alternate,
            loopInterval: loopInterval,
            promise: {},
            callBack: null,
            object: object,
            steps: steps,
            currentStep: {
                index: 0,
                loaded: false
            }
        };
        this.onFinish = onFinish;
    }

    DEFAULT_FUNCTIONS = {
        linear: () => {
            return t => t;
        },
        ease: () => {
            const ease = new BezierEasing(0.25, 0.1, 0.25, 1.0);

            return t => ease(t);
        },
        'ease-in': () => {
            const ease = new BezierEasing(0.42, 0.0, 1.0, 1.0);

            return t => ease(t);
        },
        'ease-out': () => {
            const ease = new BezierEasing(0.0, 0.0, 0.58, 1.0);

            return t => ease(t);
        },
        'ease-in-out': () => {
            const ease = new BezierEasing(0.42, 0.0, 0.58, 1.0);

            return t => ease(t);
        }
    };

    setState(data) {
        const newState = {
            ...this.state,
            ...definedOnly(data)
        };

        this.state = newState;

        return newState;
    }

    applySteps(timePassed) {
        const { object, steps, currentStep, isRunning, loop, alternate, loopInterval } = this.state;

        if (!isRunning || isRunning === -1) {
            return;
        }

        let newCurrentStep = currentStep;

        if (!newCurrentStep.loaded) {
            const step = steps[newCurrentStep.index];
            const { duration, func: generalFunc, props: stepProps } = step;
            const propNames = Object.keys(stepProps);
            const current = selectProps(object.state, propNames);
            const final = selectProps(stepProps, propNames);

            const transformers = [];

            for (const key in final) {
                const finalProp = final[key];
                const currentProp = current[key];

                if ((!finalProp.func && !generalFunc) || finalProp.noFunc) {
                    continue;
                }

                const finalValue = finalProp.value || finalProp;
                const currentValue = currentProp.value || currentProp;

                const coef = finalValue - currentValue;
                const func = finalProp.func || generalFunc;

                let validatedFunc;

                if (typeof func === 'string') {
                    validatedFunc = this.DEFAULT_FUNCTIONS[func]();
                } else if (typeof func === 'function') {
                    validatedFunc = func;
                } else {
                    throw new Error('Invalid transition function');
                }

                transformers[key] = t => {
                    const seconds = t / duration;

                    return validatedFunc(seconds) * coef;
                };
            }

            newCurrentStep = {
                ...newCurrentStep,
                loaded: true,
                time: 0,
                duration: duration,
                current: current,
                final: final,
                transformers: transformers
            };

            if (steps[0] && steps[0].isDelay ? newCurrentStep.index === 1 : newCurrentStep.index === 0) {
                newCurrentStep.initial = current;
            }

            this.setState({
                currentStep: newCurrentStep
            });
        }

        const { transformers, initial, final, time, current, duration, index: stepIndex } = newCurrentStep;

        const newTime = time + timePassed;

        const transformedProps = {};

        for (const key in transformers) {
            const transformer = transformers[key];
            const diff = transformer(newTime);

            if (!diff) {
                continue;
            }

            transformedProps[key] = current[key] + diff;
        }

        if (newTime >= duration) {
            const nexStepIndex = stepIndex + 1;
            const isFinished = !steps[nexStepIndex];
            let newLoop = loop;
            let newSteps = steps;

            object.update(final);

            if (isFinished) {
                newSteps = steps.filter(step => !step.isDelay);

                if (loop === true || loop > 1) {
                    if (alternate) {
                        const prevSteps = [...newSteps];
                        const length = prevSteps.length;

                        newSteps = newSteps.slice(0, -1).reverse();
                        newSteps.push({ props: initial });
                        newSteps = newSteps.map((step, stepIndex) => ({
                            ...prevSteps[length - 1 - stepIndex],
                            props: step.props
                        }));
                    }

                    newSteps = [
                        {
                            props: alternate ? {} : initial,
                            duration: loopInterval,
                            isDelay: true
                        },
                        ...newSteps
                    ];

                    if (loop && typeof loop === 'number') {
                        newLoop = loop - 1;
                    }
                } else {
                    this.end();

                    return;
                }
            }

            this.setState({
                currentStep: {
                    ...newCurrentStep,
                    index: isFinished ? 0 : nexStepIndex,
                    loaded: false
                },
                loop: newLoop,
                steps: newSteps
            });

            return;
        }

        object.update(transformedProps);
        this.setState({
            currentStep: {
                ...newCurrentStep,
                time: newTime
            }
        });
    }

    runTransition(callBack) {
        const { isRunning } = this.state;

        if (isRunning === true) {
            throw new Error('Already running');
        }

        const promise = new Promise((resolve, reject) => {
            this.setState({
                promise: {
                    resolve,
                    reject
                },
                callBack: callBack,
                isRunning: true
            });
        });

        return promise;
    }

    pauseTransition(isAuto) {
        const { isRunning } = this.state;

        if (!isRunning || isRunning === -1) {
            return;
        }

        this.setState({
            isRunning: isAuto ? -1 : false
        });
    }

    resumeTransition(isAuto) {
        const { isRunning } = this.state;

        if (isRunning === true) {
            return;
        }

        if (isAuto && isRunning !== -1) {
            return;
        }

        this.setState({
            isRunning: true
        });
    }

    endTransition() {
        const { promise, callBack } = this.state;

        if (promise && promise.resolve) {
            promise.resolve();
        }

        if (callBack) {
            callBack();
        }

        if (this.onFinish) {
            this.onFinish();
        }
    }

    /**
     * External
     */

    apply(timePassed) {
        return this.applySteps(timePassed);
    }

    run(callBack) {
        return this.runTransition(callBack);
    }

    pause(isAuto) {
        return this.pauseTransition(isAuto);
    }

    resume(isAuto) {
        return this.resumeTransition(isAuto);
    }

    end() {
        return this.endTransition();
    }
}
