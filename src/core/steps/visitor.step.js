import {nextStep} from './utils/index';
import {uuid} from '../../utils/index';

function visitorStep(pa, model, nextSteps) {
    pa.storage.getItem(model.getConfiguration('storageVisitor'), function (storedValue) {
        if (model.getConfiguration('isVisitorClientSide')) {
            pa.storage.getItem('atuserid', function (retrocompatVisitorIdStored) {
                let retrocompatVisitorIDStoredValue = null;
                if (retrocompatVisitorIdStored !== null) {
                    retrocompatVisitorIDStoredValue = retrocompatVisitorIdStored.val;
                }
                model.visitorId = model.getConfiguration('visitorId') || retrocompatVisitorIDStoredValue || storedValue || uuid.v4();
                if (model.visitorId !== storedValue || model.getConfiguration('visitorStorageMode') === 'relative') {
                    const expirationDate = new Date();
                    expirationDate.setTime(expirationDate.getTime() + (model.getConfiguration('storageLifetimeVisitor') * 24 * 60 * 60 * 1000));
                    pa.privacy.setItem(model.getConfiguration('storageVisitor'), model.visitorId, expirationDate, function () {
                        pa.storage.getItem(model.getConfiguration('storageVisitor'), function (visitorIdStored) {
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
            });

        } else {
            nextStep(pa, model, nextSteps);
        }
    });
}

export default visitorStep;
