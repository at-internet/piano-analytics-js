import {nextStep} from './utils/index';

function propertiesStep(pa, model, nextSteps) {
    const propsToDelete = [];
    for (const property in model.properties) {
        if (Object.prototype.hasOwnProperty.call(model.properties, property)) {
            let isAdded = false;
            for (const event of model.events) {
                let isEventOptionOk = false;
                const propertyEventsOption = model.properties[property].options.events;
                if (propertyEventsOption) {
                    if (propertyEventsOption.indexOf(event.name) > -1) {
                        isEventOptionOk = true;
                    } else {
                        for (const eventAllowed of propertyEventsOption) {
                            if (eventAllowed.charAt(eventAllowed.length - 1) === '*' && event.name.indexOf(eventAllowed.substring(0, eventAllowed.length - 1)) === 0) {
                                isEventOptionOk = true;
                                break;
                            }
                        }
                    }
                } else if (!propertyEventsOption) {
                    isEventOptionOk = true;
                }
                if (isEventOptionOk && typeof event.data[property] === 'undefined') {
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
        delete pa._properties[property];
    }
    if (!model.getConfiguration('sendEmptyProperties')) {
        for (const event of model.events) {
            for (const prop in event.data) {
                if (Object.prototype.hasOwnProperty.call(event.data, prop) && (event.data[prop] === '' || event.data[prop] === undefined)) {
                    delete event.data[prop];
                }
            }
        }
    }
    nextStep(pa, model, nextSteps);
}

export {propertiesStep};
