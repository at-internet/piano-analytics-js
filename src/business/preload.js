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
    let _conflictDetected = false;
    if (_queue.length > 0) {
        for (let i = 0; i < _queue.length; i++) {
            _callFromStringWrapper(_queue[i], context);
        }
        _checkConflict();
    }
    if (isAsync) {
        const _push = window[asyncArrayName].push.bind(window[asyncArrayName]);
        window[asyncArrayName].push = function (params) {
            _callFromStringWrapper(params);
            _checkConflict();
            _push(params);
        };
    }

    function _callFromStringWrapper(_paramsArray, _context) {
        try {
            const tagType = _functionCallFromString(root, _paramsArray[0].split('.'), _paramsArray.slice(1), _context);
            if (tagType) {
                _unknownTaggingActive = true;
            } else {
                _paTaggingActive = true;
            }
        } catch (e) {
            _unknownTaggingActive = true;
        }
    }
    function _checkConflict() {
        if (_unknownTaggingActive && _paTaggingActive && !_conflictDetected) {
            console.error(`Piano Analytics SDK - window.${asyncArrayName} is used for Piano Analytics integration and somewhere else. Please check "queueVarName" configuration if needed.`);
            _conflictDetected = true;
        }
    }
}


export {
    preloadTagging
};
