function PianoAnalyticsQueue(pa) {
    const _queue = [];
    const push = function (eventCall) {
        _queue.push(eventCall);
        if (_queue.length === 1) {
            pa[eventCall[0]].apply(pa, eventCall.slice(1));
        }
    };
    const next = function () {
        _queue.shift();
        if (_queue.length > 0) {
            const nextCall = _queue[0];
            pa[nextCall[0]].apply(pa, nextCall.slice(1));
        }
    };
    return {
        push: push,
        next: next
    };
}

export default PianoAnalyticsQueue;
