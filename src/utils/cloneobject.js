const cloneObject = function (original, delUndefined) {
    if (typeof original !== 'object' || original === null || original instanceof Date) {
        return original;
    }
    const copy = new original.constructor;
    for (const i in original) {
        if (Object.prototype.hasOwnProperty.call(original, i)) {
            if (i !== undefined && (!delUndefined || original[i] !== undefined)) {
                copy[i] = cloneObject(original[i]);
            }
        }
    }
    return copy;
};

export {cloneObject};
