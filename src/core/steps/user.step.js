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
                model.setProperty('user_id', userStored.id, opts);
                model.setProperty('user_category', userStored.category, opts);
                model.setProperty('user_recognition', true, opts);
            }
            nextStep(pa, model, nextSteps);
        });
    }
}

export default userStep;
