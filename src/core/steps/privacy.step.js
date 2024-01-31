import {nextStep} from './utils/index';

function privacyStep(pa, model, nextSteps) {
    pa._privacy.call('filterEvents', model.events);
    pa._privacy.call('filterProps', model.properties);
    const _events = model.events;
    for (let i = 0; i < _events.length; i++) {
        pa._privacy.call('filterProps', _events[i].data, _events[i].name);
        let metadata = pa._privacy.call('getModeMetadata') || {};
        for (const property in metadata) {
            if (Object.prototype.hasOwnProperty.call(metadata, property)) {
                model.addEventsProperty(property, metadata[property]);
            }
        }
    }
    nextStep(pa, model, nextSteps);
}

export {privacyStep};
