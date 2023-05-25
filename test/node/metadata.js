describe('Metadata not in browser :', function () {
    let config = pa.cfg.cloneData();
    let globalPA;
    beforeEach(function () {
        Utility.clearStorage(pa);
        globalPA = new pa.PA(config);
    });
    afterEach(function () {
        globalPA = undefined;
        Utility.clearStorage(pa);
    });
    it('Should add event_collection_platform', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['event_collection_platform']).to.not.equal(undefined);
                expect(typeof model.build.data.events[0].data['event_collection_platform']).to.equal('string');
                expect(model.build.data.events[0].data['event_collection_platform']).to.equal('js-browserless');
                done();
            }
        });
    });
    it('Should add event_collection_version', function (done) {
        let regexSemVer = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['event_collection_version']).to.not.equal(undefined);
                expect(typeof model.build.data.events[0].data['event_collection_version']).to.equal('string');
                expect(regexSemVer.test(model.build.data.events[0].data['event_collection_version'])).to.equal(true);
                done();
            }
        });
    });
    it('Should add device_timestamp_utc', function (done) {
        let currentTimestamp = new Date().getTime();
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['device_timestamp_utc']).to.not.equal(undefined);
                expect(typeof model.build.data.events[0].data['device_timestamp_utc']).to.equal('number');
                expect(model.build.data.events[0].data['device_timestamp_utc']).to.greaterThanOrEqual(currentTimestamp);
                expect(model.build.data.events[0].data['device_timestamp_utc']).to.lessThanOrEqual(new Date().getTime());
                done();
            }
        });
    });
    it('Should not add device_screen_width', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['device_screen_width']).to.equal(undefined);
                done();
            }
        });
    });
    it('Should not add device_screen_height', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['device_screen_height']).to.equal(undefined);
                done();
            }
        });
    });
    it('Should not add device_display_width', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['device_display_width']).to.equal(undefined);
                done();
            }
        });
    });
    it('Should not add device_display_height', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['device_display_height']).to.equal(undefined);
                done();
            }
        });
    });
    it('Should not add browser_language', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['browser_language']).to.equal(undefined);
                done();
            }
        });
    });
    it('Should not add browser_language_local', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['browser_language_local']).to.equal(undefined);
                done();
            }
        });
    });
    it('Should not add previous_url', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['previous_url']).to.equal(undefined);
                done();
            }
        });
    });
    it('Should not add event_url_full', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['event_url_full']).to.equal(undefined);
                done();
            }
        });
    });
});
