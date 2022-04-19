import {nextStep} from './utils/index';

function privacyStep(pa, model, nextSteps) {
    pa.privacy.filterEvents(model.events);
    pa.privacy.filterProps(model.properties);
    const _events = model.events;
    for (let i = 0; i < _events.length; i++) {
        pa.privacy.filterProps(_events[i].data, _events[i].name);
        const includes = pa.privacy.modes[pa.privacy.getMode()].properties.include || {};
        for (const property in includes) {
            if (Object.prototype.hasOwnProperty.call(includes, property)) {
                model.setProperty(property, includes[property]);
            }
        }
    }
    nextStep(pa, model, nextSteps);
}

export default privacyStep;
