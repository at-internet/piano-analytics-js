describe('Visitor id :', function () {
    let config = pa.cfg.cloneData();
    let globalPA;
    const checkVisitorId = function (value) {
        expect(typeof value).to.equal('string');
        expect(value.length).to.be.greaterThan(0);
        expect(value).to.not.equal('OPT-OUT');
        expect(value).to.not.equal('no-consent');
        expect(value).to.not.equal('no-storage');
    }
    beforeEach(function () {
        Utility.clearStorage(pa);
        config = pa.cfg.cloneData();
        globalPA = new pa.PA(config);
    });
    afterEach(function () {
        config = undefined;
        globalPA = undefined;
        Utility.clearStorage(pa);
    });

    it('Should add a visitorId without storing it (datalayer now)', function (done) {
        globalPA.sendEvent('toto', {test: 'visitor'}, {
            onBeforeSend: function (pianoanalytics, model) {
                globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored) {
                    expect(visitorIdStored).to.equal(null);
                    checkVisitorId(model.visitorId);
                    done();
                });
            }
        });
    });
    it('Should use the forced value for visitor id instead of the standard behavior', function (done) {
        let testValue = 'testforcedvalue';
        globalPA.setVisitorId(testValue);
        globalPA.sendEvent('toto', {test: 'visitor'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.visitorId).to.equal(testValue);
                globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored) {
                    expect(visitorIdStored).to.equal('testforcedvalue');
                    expect(testValue).to.equal('testforcedvalue');
                    done();
                });
            }
        });
    });
    it('Should not set a visitor id if configuration isVisitorClientSide has been set to false', function (done) {
        globalPA.setConfiguration('isVisitorClientSide', false);
        globalPA.sendEvent('toto', {test: 'visitor'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.visitorId).to.equal(null);
                globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored) {
                    expect(visitorIdStored).to.equal(null);
                    done();
                });
            }
        });
    });
});
