export function nextStep(pa, model, nextSteps, forceBreak) {
    if (forceBreak !== false && nextSteps.length > 0 && typeof nextSteps[0] === 'function') {
        nextSteps[0](pa, model, nextSteps.slice(1));
    } else {
        pa._queue.next();
    }
}
