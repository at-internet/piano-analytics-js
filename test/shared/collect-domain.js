describe('Collect Domain :', function () {
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
    it('should not change protocol when https is already present in configuration', function (done) {
        globalPA.setConfiguration('collectDomain', 'https://subdomain.myendpoint.com');
        globalPA.sendEvent('page.display', {},
            {
                onBeforeSend: function (PianoAnalytics, model) {
                    Utility.promiseThrowCatcher(done, function () {
                        expect(model.build.url.startsWith('https://subdomain.myendpoint.com')).to.equal(true);
                        done();
                    });
                }
            });
    });
    it('should not change protocol when http is already present in configuration', function (done) {
        globalPA.setConfiguration('collectDomain', 'http://subdomain.myendpoint.com');
        globalPA.sendEvent('page.display', {},
            {
                onBeforeSend: function (PianoAnalytics, model) {
                    Utility.promiseThrowCatcher(done, function () {
                        expect(model.build.url.startsWith('http://subdomain.myendpoint.com')).to.equal(true);
                        done();
                    });
                }
            });
    });
    it('should add protocol https to collect domain when absent in configuration', function (done) {
        globalPA.setConfiguration('collectDomain', 'subdomain.myendpoint.com');
        globalPA.sendEvent('page.display', {},
            {
                onBeforeSend: function (PianoAnalytics, model) {
                    Utility.promiseThrowCatcher(done, function () {
                        expect(model.build.url.startsWith('https://subdomain.myendpoint.com')).to.equal(true);
                        done();
                    });
                }
            });
    });
});
