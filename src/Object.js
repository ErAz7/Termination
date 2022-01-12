import { definedOnly, merge } from './utils';

export default class Object {
    constructor(props, onRemove, onTransition) {
        const {
            x = 0,
            y = 0,
            content = '',
            visible = true,
            replaceSpace = false,
            color
        } = props;

        const finalContent = this.fixNewLine(content || '');

        const { lines, width, height } = this.getCalculatedContentProps(finalContent);

        this.state = {
            x: x,
            y: y,
            content: finalContent,
            lines: lines,
            width: width,
            height: height,
            color: color,
            replaceSpace: replaceSpace,
            visible: visible
        };
        this.onRemove = onRemove;
        this.onTransition = onTransition;
    }

    setState(data) {
        merge(this.state, definedOnly(data));
    }

    getCalculatedContentProps(content) {
        const lines = content ? content.split('\n') : [];

        const height = lines.length;
        const width = lines.reduce((max, line) => Math.max(max, line.length), 0);

        return {
            height,
            width,
            lines
        };
    }

    fixNewLine(str) {
        const out = str.replace(/\r\n/g, '\n');

        return out;
    }

    /**
     * External
     */

    update(props) {
        const { content = '' } = props;
        const { content: prevContent } = this.state;

        const finalContent = this.fixNewLine(content || prevContent || '');

        const { lines, width, height } = this.getCalculatedContentProps(finalContent);

        this.setState({
            ...definedOnly(props),
            content: finalContent,
            lines: lines,
            width: width,
            height: height
        });
    }

    remove(...args) {
        return this.onRemove(...args);
    }

    transition(...args) {
        return this.onTransition(...args);
    }
}
