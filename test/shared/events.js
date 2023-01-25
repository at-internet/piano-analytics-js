describe('Events :', function () {
    let config = pa.cfg.cloneData();
    let globalPA;
    beforeEach(function () {
        Utility.clearStorage(pa);
        (typeof window !== 'undefined') && (window.pdl = undefined);
        globalPA = new pa.PA(config);
    });
    afterEach(function () {
        globalPA = undefined;
        Utility.clearStorage(pa);
    });
    describe('Options :', function () {
        it('Should use callback onBeforeBuild if present', function (done) {
            globalPA.sendEvent('page.display', {},
                {
                    onBeforeBuild: function (PianoAnalytics, model) {
                        expect(model.build.data);
                        done();
                    }
                });
        });
        it('Should use callback onBeforeSend if present', function (done) {
            globalPA.sendEvent('page.display', {},
                {
                    onBeforeSend: function (PianoAnalytics, model) {
                        expect(model.build.data);
                        done();
                    }
                });
        });
    });
    describe('Model modifications :', function () {
        it('Should change the collectDomain only for this sendEvent', function (done) {
            globalPA.sendEvent('page.display', {},
                {
                    onBeforeBuild: function (PianoAnalytics, model, next) {
                        model.setConfiguration('collectDomain', 'https://thisisatestingvalue.test');
                        next();
                    },
                    onBeforeSend: function (PianoAnalytics, model, next) {
                        expect(model.build.url.indexOf('https://thisisatestingvalue.test') === 0).to.equal(true);
                        expect(PianoAnalytics.getConfiguration('collectDomain')).to.equal('');
                        globalPA.sendEvent('page.display', {},
                            {
                                onBeforeSend: function (PianoAnalytics, model) {
                                    expect(model.build.url.indexOf('https://thisisatestingvalue.test') < 0).to.equal(true);
                                    expect(PianoAnalytics.getConfiguration('collectDomain')).to.equal('');
                                    done();
                                }
                            });
                        next(false);
                    }
                });
        });
        it('Should change the path only for this sendEvent', function (done) {
            globalPA.sendEvent('page.display', {},
                {
                    onBeforeBuild: function (PianoAnalytics, model, next) {
                        model.setConfiguration('path', 'pathtestingvalue');
                        next();
                    },
                    onBeforeSend: function (PianoAnalytics, model, next) {
                        expect(model.build.url.indexOf('/pathtestingvalue') === 0).to.equal(true);
                        expect(PianoAnalytics.getConfiguration('path')).to.equal('event');
                        globalPA.sendEvent('page.display', {},
                            {
                                onBeforeSend: function (PianoAnalytics, model) {
                                    expect(model.build.url.indexOf('/pathtestingvalue') < 0).to.equal(true);
                                    expect(PianoAnalytics.getConfiguration('path')).to.equal('event');
                                    done();
                                }
                            });
                        next(false);
                    }
                });
        });
        it('Should change the site only for this sendEvent', function (done) {
            globalPA.sendEvent('page.display', {},
                {
                    onBeforeBuild: function (PianoAnalytics, model, next) {
                        model.setConfiguration('site', 410501);
                        next();
                    },
                    onBeforeSend: function (PianoAnalytics, model, next) {
                        expect(model.build.url.indexOf('/event?s=410501') === 0).to.equal(true);
                        expect(PianoAnalytics.getConfiguration('site')).to.equal('');
                        globalPA.sendEvent('page.display', {},
                            {
                                onBeforeSend: function (PianoAnalytics, model) {
                                    expect(model.build.url.indexOf('/event?s=410501') < 0).to.equal(true);
                                    expect(PianoAnalytics.getConfiguration('site')).to.equal('');
                                    done();
                                }
                            });
                        next(false);
                    }
                });
        });
    });
});
