import {nextStep} from './utils/index';

function userStep(pa, model, nextSteps) {
    if (typeof model.properties['user_id'] !== 'undefined') {
        nextStep(pa, model, nextSteps);
    } else {
        pa.getUser(function (userStored) {
            if (userStored !== null) {
                const opts = {
                    persistent: true
                };
                model.addEventsProperty('user_id', userStored.id, opts);
                model.addEventsProperty('user_category', userStored.category, opts);
                model.addEventsProperty('user_recognition', true, opts);
            }
            nextStep(pa, model, nextSteps);
        });
    }
}

export {userStep};
