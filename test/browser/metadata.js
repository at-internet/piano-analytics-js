describe('Metadata in browser :', function () {
    let config = pa.cfg.cloneData();
    let globalPA;
    beforeEach(function () {
        Utility.clearStorage(pa);
        globalPA = new pa.PA(config);
    });
    afterEach(function () {
        globalPA = undefined;
        Utility.clearStorage(pa);
        window._pac = undefined;
        window._paq = undefined;
    });
    it('Should add event_collection_platform', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['event_collection_platform']).to.not.equal(undefined);
                expect(typeof model.build.data.events[0].data['event_collection_platform']).to.equal('string');
                expect(model.build.data.events[0].data['event_collection_platform']).to.equal('js');
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
    it('Should add device_screen_width', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['device_screen_width']).to.not.equal(undefined);
                expect(typeof model.build.data.events[0].data['device_screen_width']).to.equal('number');
                expect(model.build.data.events[0].data['device_screen_width']).to.greaterThan(0);
                expect(model.build.data.events[0].data['device_screen_width']).to.lessThan(4000);
                done();
            }
        });
    });
    it('Should add device_screen_height', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['device_screen_height']).to.not.equal(undefined);
                expect(typeof model.build.data.events[0].data['device_screen_height']).to.equal('number');
                expect(model.build.data.events[0].data['device_screen_height']).to.greaterThan(0);
                expect(model.build.data.events[0].data['device_screen_height']).to.lessThan(4000);
                done();
            }
        });
    });
    it('Should add device_display_width', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['device_display_width']).to.not.equal(undefined);
                expect(typeof model.build.data.events[0].data['device_display_width']).to.equal('number');
                expect(model.build.data.events[0].data['device_display_width']).to.greaterThan(0);
                expect(model.build.data.events[0].data['device_display_width']).to.lessThan(4000);
                done();
            }
        });
    });
    it('Should add device_display_height', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['device_display_height']).to.not.equal(undefined);
                expect(typeof model.build.data.events[0].data['device_display_height']).to.equal('number');
                expect(model.build.data.events[0].data['device_display_height']).to.greaterThan(0);
                expect(model.build.data.events[0].data['device_display_height']).to.lessThan(4000);
                done();
            }
        });
    });
    it('Should add browser_language', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['browser_language']).to.not.equal(undefined);
                expect(typeof model.build.data.events[0].data['browser_language']).to.equal('string');
                done();
            }
        });
    });
    it('Should add browser_language_local', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['browser_language_local']).to.not.equal(undefined);
                expect(typeof model.build.data.events[0].data['browser_language_local']).to.equal('string');
                done();
            }
        });
    });
    it('Should add previous_url', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['previous_url']).to.not.equal(undefined);
                expect(typeof model.build.data.events[0].data['previous_url']).to.equal('string');
                expect(typeof model.build.data.events[0].data['previous_url']).to.not.equal('');
                done();
            }
        });
    });
    it('Should add page_url', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['page_url']).to.not.equal(undefined);
                expect(typeof model.build.data.events[0].data['page_url']).to.equal('string');
                expect(typeof model.build.data.events[0].data['page_url']).to.not.equal('');
                done();
            }
        });
    });
    it('Should add user agent data', function (done) {
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                // todo when we'll know what we have to do... lol
                done();
            }
        });
    });
    it('Should not add page_url when configuration addEventURL is false', function (done) {
        globalPA.setConfiguration('addEventURL', 'false')
        globalPA.sendEvent('toto', {test: 'test'}, {
            onBeforeSend: function (pianoanalytics, model) {
                expect(model.build.data.events[0].data['page_url']).to.equal(undefined);
                done();
            }
        });
    });
});
