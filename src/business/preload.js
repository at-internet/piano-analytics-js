function _functionCallFromString(root, target, params, context) {
    const _targetFunction = root[target[0]];
    if (typeof _targetFunction === 'undefined') {
        return true;
    } else if (target.length === 1) {
        _targetFunction.apply(context ? context : root, params);
        return false;
    } else {
        return _functionCallFromString(_targetFunction, target.slice(1), params, context);
    }
}

function preloadTagging(root, srcArray, isAsync, asyncArrayName) {
    const context = isAsync ? null : root;
    const _queue = srcArray || [];
    let _paTaggingActive = false;
    let _unknownTaggingActive = false;
    if (_queue.length > 0) {
        for (let i = 0; i < _queue.length; i++) {
            const paramsArray = _queue[i];
            const tagType = _functionCallFromString(root, paramsArray[0].split('.'), paramsArray.slice(1), context);
            if(tagType){
                _unknownTaggingActive = true;
            } else {
                _paTaggingActive = true;
            }
        }
        if(_unknownTaggingActive && _paTaggingActive){
            console.error(`Piano Analytics SDK - window.${asyncArrayName} is used for Piano Analytics integration and somewhere else. Please check "queueVarName" configuration if needed.`);
        }
    }
    if (isAsync) {
        window[asyncArrayName] = {
            push: function (paramsArray) {
                _functionCallFromString(root, paramsArray[0].split('.'), paramsArray.slice(1));
            }
        };
    }

}

export {
    preloadTagging
};
