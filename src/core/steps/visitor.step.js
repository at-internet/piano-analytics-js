import {nextStep} from './utils/index';
import {uuid} from '../../utils/index';
import {dataLayer} from '../../business/data-layer/data-layer';

function visitorStep(pa, model, nextSteps) {
    pa._storage.getItem(model.getConfiguration('storageVisitor'), function (storedValue) {
        if (model.getConfiguration('isVisitorClientSide')) {
            model.visitorId = model.getConfiguration('visitorId') || (BUILD_BROWSER ? dataLayer.get('browserId') : (storedValue || uuid.v4()));
            if(BUILD_BROWSER){
                if(!model.getConfiguration('isLegacyPrivacy') && pa.consent.getMode() === 'opt-out'){
                    model.visitorId = 'OPT-OUT';
                }
            }
            const isNotForcedValue = model.visitorId !== 'OPT-OUT' && model.visitorId !== 'no-consent' && model.visitorId !== 'no-storage' && model.visitorId !== model.getConfiguration('visitorId');
            if (BUILD_BROWSER) {
                if (model.visitorId !== dataLayer.get('browserId')
                    && isNotForcedValue) {
                    model.visitorId = model.visitorId + '-NO';
                }
                nextStep(pa, model, nextSteps);
            } else {
                if ((model.visitorId !== storedValue || model.getConfiguration('visitorStorageMode') === 'relative')
                    && isNotForcedValue) {
                    const expirationDate = new Date();
                    expirationDate.setTime(expirationDate.getTime() + (model.getConfiguration('storageLifetimeVisitor') * 24 * 60 * 60 * 1000));
                    pa._privacy.call('setItem', model.getConfiguration('storageVisitor'), model.visitorId, expirationDate, function () {
                        pa._storage.getItem(model.getConfiguration('storageVisitor'), function (visitorIdStored) {
                            const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                            if (visitorIdStored === null && regexUUID.test(model.visitorId)) {
                                model.visitorId = model.visitorId + '-NO';
                            }
                            nextStep(pa, model, nextSteps);
                        });
                    });
                } else {
                    nextStep(pa, model, nextSteps);
                }
            }
        } else {
            nextStep(pa, model, nextSteps);
        }
    });
}

export {visitorStep};
