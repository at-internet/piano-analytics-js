import {nextStep} from './utils/index';

function propertiesStep(pa, model, nextSteps) {
    const propsToDelete = [];
    for (const property in model.properties) {
        if (Object.prototype.hasOwnProperty.call(model.properties, property)) {
            let isAdded = false;
            for (const event of model.events) {
                if (
                    (model.properties[property].options.events && model.properties[property].options.events.indexOf(event.name) > -1)
                    || !model.properties[property].options.events
                ) {
                    event.data[property] = model.properties[property].value;
                    isAdded = true;
                }
            }
            if (isAdded && !model.properties[property].options.persistent) {
                propsToDelete.push(property);
            }
        }
    }
    for (const property of propsToDelete) {
        delete pa.properties[property];
    }
    nextStep(pa, model, nextSteps);
}

export default propertiesStep;
