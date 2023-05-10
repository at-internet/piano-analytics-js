describe('Configuration override tagging :', function () {
    let config = pa.cfg.cloneData();
    let globalPA;
    beforeEach(function () {
        Utility.clearStorage(pa);
        window.pdl = undefined;
    });
    afterEach(function () {
        globalPA = undefined;
        Utility.clearStorage(pa);
        window._pac = undefined;
        window._paq = undefined;
    });
    it('Should work properly', function (done) {
        window._pac = window._pac || {privacy: []};
        _pac.site = 99999999;
        _pac.collectDomain = 'collectDomainTestValue';
        _pac.path = 'path/value.test';

        const PATemp = new pa.PA(config);
        PATemp.sendEvent('testEvent', {},
            {
                onBeforeSend: function (PianoAnalytics, model) {
                    Utility.promiseThrowCatcher(done, function () {
                        expect(model.build.url.indexOf('https://collectDomainTestValue/path/value.test?s=99999999')).to.equal(0);
                        done();
                    });
                }
            });
    });
});
