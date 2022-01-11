export default class EventProxy {
    constructor(Source, Target, events) {
        this.events = events;
        this.Source = Source;
        this.Target = Target;

        this.handleNewListener = this.handleNewListener.bind(this);
        this.removeListener = this.removeListener.bind(this);

        Source.on('newListener', this.handleNewListener);
        Source.on('removeListener', this.removeListener);
    }

    handleNewListener(event, listener) {
        if (this.events.includes(event)) {
            this.Target.on(event, listener);
        }
    }

    removeListener(event, listener) {
        if (this.events.includes(event)) {
            this.Target.removeListener(event, listener);
        }
    }

    /**
     * External
     */

    end() {
        this.Source.removeListener('newListener', this.handleNewListener);
        this.Source.removeListener('removeListener', this.removeListener);
    }
}
