describe('Asynchronous tagging :', function () {
    let config = pa.cfg.cloneData();
    let globalPA;
    beforeEach(function () {
        Utility.clearStorage(pa);
        window._paq = undefined;
        //globalPA = new pa.PA(config);
    });
    afterEach(function () {
        globalPA = undefined;
        Utility.clearStorage(pa);
        window._pac = undefined;
        window._paq = undefined;
    });
    it('Should work properly after pianoAnalytics is instancied', function (done) {
        window._paq = window._paq || [];
        _paq.push(['setConfiguration', 'collectDomain', 'collectDomainTestValue']);
        _paq.push(['setProperties', {
            'myProperty': 1,
            'myOtherProperty': 'two',
        }]);
        _paq.push(['sendEvent', 'toto', {
            'myThirdProp': 'three'
        }, {
            onBeforeSend: function (pianoAnalytics, model, next) {
                expect(model.build.data.events[0].data['myProperty']).to.equal(1);
                expect(model.build.data.events[0].data['myOtherProperty']).to.equal('two');
                expect(model.build.data.events[0].data['myThirdProp']).to.equal('three');
                expect(model.getConfiguration('collectDomain')).to.equal('collectDomainTestValue');
                window._paq = window._paq || [];
                _paq.push(['sendEvent', 'tata', {
                    'myOnlyProp': 'one'
                }, {
                    onBeforeSend: function (pianoAnalytics2, model2) {
                        expect(model2.build.data.events[0].data['myProperty']).to.equal(undefined);
                        expect(model2.build.data.events[0].data['myOtherProperty']).to.equal(undefined);
                        expect(model2.build.data.events[0].data['myThirdProp']).to.equal(undefined);
                        expect(model2.build.data.events[0].data['myOnlyProp']).to.equal('one');
                        expect(model2.getConfiguration('collectDomain')).to.equal('collectDomainTestValue');
                        done();
                    }
                }]);
                next(false);
            }
        }]);
        globalPA = new pa.PA(config);
    });
});
