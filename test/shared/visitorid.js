describe('Visitor id :', function () {
    let config = pa.cfg.cloneData();
    let globalPA;
    let regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    beforeEach(function () {
        Utility.clearStorage(pa);
        globalPA = new pa.PA(config);
    });
    afterEach(function () {
        globalPA = undefined;
        Utility.clearStorage(pa);
    });

    it('Should add a visitorId by default and store it', function (done) {
        globalPA.sendEvent('toto', {test: 'visitor'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(regexUUID.test(model.visitorId)).to.equal(true);
                globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored) {
                    expect(visitorIdStored).to.equal(model.visitorId);
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
                    expect(visitorIdStored).to.equal(testValue);
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
    it('Should allow to change visitor id storage duration', function (done) {
        globalPA.setConfiguration('storageLifetimeVisitor', 1 / 86400);
        globalPA.sendEvent('toto', {test: 'visitor'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(regexUUID.test(model.visitorId)).to.equal(true);
                globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored) {
                    expect(visitorIdStored).to.equal(model.visitorId);
                    setTimeout(function () {
                        globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored2) {
                            expect(visitorIdStored2).to.equal(null);
                            done();
                        });
                    }, 1100);
                });
            }
        });
    });
    it('Should allow to change visitorStorageMode (relative)', function (done) {
        globalPA.setConfiguration('storageLifetimeVisitor', (1 / 86400) * 3);
        globalPA.setConfiguration('visitorStorageMode', 'relative');
        globalPA.sendEvent('toto', {test: 'visitor'}, {
            onBeforeSend: function (pianoanalytics, model, next) {
                expect(regexUUID.test(model.visitorId)).to.equal(true);
                globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored) {
                    expect(visitorIdStored).to.equal(model.visitorId);
                    setTimeout(function () {
                        globalPA.sendEvent('tata', {test: 'visitor'}, {
                            onBeforeSend: function (pa2, model2) {
                                expect(model2.visitorId).to.equal(visitorIdStored);
                            }
                        });
                    }, 2000);
                    setTimeout(function () {
                        globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored2) {
                            expect(visitorIdStored2).to.equal(visitorIdStored);
                            done();
                        });
                    }, 3500);
                });
                next(false);
            }
        });
    });
    it('Should allow to change visitorStorageMode (fixed)', function (done) {
        globalPA.setConfiguration('storageLifetimeVisitor', (1 / 86400) * 3);
        globalPA.setConfiguration('visitorStorageMode', 'fixed');
        globalPA.sendEvent('toto', {test: 'visitor'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(regexUUID.test(model.visitorId)).to.equal(true);
                globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored) {
                    expect(visitorIdStored).to.equal(model.visitorId);
                    setTimeout(function () {
                        globalPA.sendEvent('tata', {test: 'visitor'}, {
                            onBeforeSend: function (pa2, model2) {
                                expect(model2.visitorId).to.equal(visitorIdStored);
                            }
                        });
                    }, 2000);
                    setTimeout(function () {
                        globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored2) {
                            expect(visitorIdStored2).to.equal(null);
                            done();
                        });
                    }, 3500);
                });
            }
        });
    });
    it('Should add "-NO" flag to the visitor ID if we can\'t store it because of external factors and uuid is enabled', function (done) {
        globalPA.storage.setItem = function (name, data, expiration, callback) {
            callback && callback();
        };
        globalPA.sendEvent('toto', {test: 'visitor'}, {
            onBeforeSend: function (pianoanalytics, model) {
                let visitorIdLenght = model.visitorId.length;
                let NOIndex = model.visitorId.indexOf('-NO');
                expect(NOIndex).to.equal(visitorIdLenght - 3);
                expect(regexUUID.test(model.visitorId.substring(0, visitorIdLenght - 3))).to.equal(true);
                done();
            }
        });
    });
    it('Should retrieve the previous visitor ID if present (atuserid), use it if needed, then delete it from storage', function (done) {
        globalPA.storage.setItem('atuserid', {
            name: 'atuserid',
            val: 'visitorIdTestRetrocompatValue'
        }, null, function () {
            globalPA.sendEvent('toto', {test: 'visitor'}, {
                onBeforeSend: function (pianoanalytics, model) {
                    expect(model.visitorId).to.equal('visitorIdTestRetrocompatValue');
                    globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored) {
                        expect(visitorIdStored).to.equal('visitorIdTestRetrocompatValue');
                        globalPA.storage.getItem('atuserid', function (visitorIdRetrocompatStored) {
                            expect(visitorIdRetrocompatStored).to.deep.equal({
                                name: 'atuserid',
                                val: 'visitorIdTestRetrocompatValue'
                            });
                            done();
                        });
                    });
                }
            });
        });
    });
});
