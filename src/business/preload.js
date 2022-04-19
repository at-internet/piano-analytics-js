function _functionCallFromString(root, target, params, context) {
    const _targetFunction = root[target[0]];
    if (target.length === 1) {
        _targetFunction.apply(context ? context : root, params);
    } else {
        _functionCallFromString(_targetFunction, target.slice(1), params, context);
    }
}

function preloadTagging(root, srcArray, isAsync) {
    const context = isAsync ? null : root;
    const configOverrideArray = srcArray || [];
    if (configOverrideArray.length > 0) {
        for (let i = 0; i < configOverrideArray.length; i++) {
            const paramsArray = configOverrideArray[i];
            _functionCallFromString(root, paramsArray[0].split('.'), paramsArray.slice(1), context);
        }
    }
    if (isAsync) {
        window._paq = {
            push: function (paramsArray) {
                _functionCallFromString(root, paramsArray[0].split('.'), paramsArray.slice(1));
            }
        };
    }

}

export {
    preloadTagging
};
