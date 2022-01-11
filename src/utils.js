/**
 * convert object to array of values
 * @param  {Object} obj
 * @returns {Array}
 */
export function objToArray(obj) {
    return Object.keys(obj).map(key => obj[key]);
}

/**
 * return only defined properties of object
 * @param  {Object} obj
 * @returns {obj}
 */
export function definedOnly(obj) {
    const copy = { ...obj };

    for (const key in copy) {
        if (copy[key] === undefined) {
            delete copy[key];
        }
    }

    return copy;
}

/**
 * Promise that resolves after duration seconds
 * @param  {Number} duration
 * @returns {Promise}
 */
export function wait(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Throw error if value not instance of validInstance
 * @param  {Any} value
 * @param  {Any} validInstance
 * @param  {Boolean} noError
 * @returns {Boolean}
 */
export function validateInstance(value, validInstance, noError) {
    const isInstance = typeof validInstance === 'function' && value instanceof validInstance;

    if (!isInstance && !noError) {
        throw new Error(`Expected instance of ${validInstance.name}`);
    }

    return isInstance;
}

/**
 * returns first defined argument
 * @param  {...Any} args [description]
 * @returns {Any}         [description]
 */
export function firstDefined(...args) {
    for (const arg of args) {
        if (arg !== undefined) {
            return arg;
        }
    }

    return undefined;
}

/**
 * dynamically select specific props of objects
 * @param  {Object} obj
 * @param  {Array} propNames
 * @returns {obj}
 */
export function selectProps(obj, propNames) {
    const copy = { ...obj };
    const out = {};

    for (const key of propNames) {
        out[key] = copy[key];
    }

    return out;
}

/**
 * merge props into an object without creating new object
 * @param  {Object} obj
 * @param  {...Object} objectsToMerge
 * @param  {Object} props
 */
export function merge(obj, ...objectsToMerge) {
    for (const objectToMerge of objectsToMerge) {
        for (const key in objectToMerge) {
            obj[key] = objectToMerge[key];
        }
    }
}
