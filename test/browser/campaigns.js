describe('Campaigns :', function () {
    let config = pa.cfg.cloneData();
    let globalPA;
    var baseURL = window.location.href + '#';
    beforeEach(function () {
        window.pdl = undefined;
        Utility.clearStorage(pa);
        globalPA = new pa.PA(config);
        window.location.href = baseURL;
    });
    afterEach(function () {
        globalPA = undefined;
        Utility.clearStorage(pa);
        window._pac = undefined;
        window._paq = undefined;
        if (window.location.href.indexOf('#') !== -1) {
            window.location.href = baseURL.replace(/\#.*/g, '#');
        }
    });
    it('Should add a campaign from querystring', function (done) {
        window.location.href = baseURL + '&at_source=mysource&at_medium=mymedium&at_campaign=mycampaign&at_platform=myplatform&at_creation=mycreation&at_variant=myvariant&at_network=mynetwork&at_term=myterm';
        globalPA.sendEvent('toto', {}, {
            onBeforeSend: function (pa, model) {
                Utility.promiseThrowCatcher(done, function () {
                    expect(model.build.data.events[0].data['src_source']).to.equal('mysource');
                    expect(model.build.data.events[0].data['src_medium']).to.equal('mymedium');
                    expect(model.build.data.events[0].data['src_campaign']).to.equal('mycampaign');
                    expect(model.build.data.events[0].data['src_platform']).to.equal('myplatform');
                    expect(model.build.data.events[0].data['src_creation']).to.equal('mycreation');
                    expect(model.build.data.events[0].data['src_variant']).to.equal('myvariant');
                    expect(model.build.data.events[0].data['src_network']).to.equal('mynetwork');
                    expect(model.build.data.events[0].data['src_term']).to.equal('myterm');
                    expect(model.build.data.events[0].data['utm_source']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_medium']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_campaign']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_platform']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_creation']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_variant']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_network']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_term']).to.equal(undefined);
                    done();
                });
            }
        });
    });
    it('Should add a campaign from querystring with empty values', function (done) {
        window.location.href = baseURL + '&at_source=&at_medium=mymedium&at_campaign=mycampaign&at_platform=&at_creation=&at_variant=myvariant&at_network=&at_term=myterm';
        globalPA.sendEvent('toto', {}, {
            onBeforeSend: function (pa, model) {
                Utility.promiseThrowCatcher(done, function () {
                    expect(model.build.data.events[0].data['src_source']).to.equal('');
                    expect(model.build.data.events[0].data['src_medium']).to.equal('mymedium');
                    expect(model.build.data.events[0].data['src_campaign']).to.equal('mycampaign');
                    expect(model.build.data.events[0].data['src_platform']).to.equal('');
                    expect(model.build.data.events[0].data['src_creation']).to.equal('');
                    expect(model.build.data.events[0].data['src_variant']).to.equal('myvariant');
                    expect(model.build.data.events[0].data['src_network']).to.equal('');
                    expect(model.build.data.events[0].data['src_term']).to.equal('myterm');
                    expect(model.build.data.events[0].data['utm_source']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_medium']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_campaign']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_platform']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_creation']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_variant']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_network']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_term']).to.equal(undefined);
                    done();
                });
            }
        });
    });
    it('Should add a campaign from querystring with uri encoded-decoded values', function (done) {
        window.location.href = baseURL + '&at_source=mysource%26%C3%A9%22(-%C3%A8_%C3%A7%C3%A0)%3D%7D%5D%40%5E%60%7C%5B%7B%23~%C2%B2%2C%3B%3A!%C3%B9*%5E%24%3F.%2F%C2%A7%25%C2%B5%C2%A8%C2%A3%2B%C2%B0encodedvalue&at_medium=mymedium&at_campaign=mycampaign%26%C3%A9%22(-%C3%A8_%C3%A7%C3%A0)%3D%7D%5D%40%5E%60%7C%5B%7B%23~%C2%B2%2C%3B%3A!%C3%B9*%5E%24%3F.%2F%C2%A7%25%C2%B5%C2%A8%C2%A3%2B%C2%B0encodedvalue&at_platform=myplatform&at_creation=mycreation&at_variant=myvariant&at_network=mynetwork&at_term=myterm%26%C3%A9%22(-%C3%A8_%C3%A7%C3%A0)%3D%7D%5D%40%5E%60%7C%5B%7B%23~%C2%B2%2C%3B%3A!%C3%B9*%5E%24%3F.%2F%C2%A7%25%C2%B5%C2%A8%C2%A3%2B%C2%B0encodedvalue';
        globalPA.sendEvent('toto', {}, {
            onBeforeSend: function (pa, model) {
                Utility.promiseThrowCatcher(done, function () {
                    expect(model.build.data.events[0].data['src_source']).to.equal('mysource&é"(-è_çà)=}]@^`|[{#~²,;:!ù*^$?./§%µ¨£+°encodedvalue');
                    expect(model.build.data.events[0].data['src_medium']).to.equal('mymedium');
                    expect(model.build.data.events[0].data['src_campaign']).to.equal('mycampaign&é"(-è_çà)=}]@^`|[{#~²,;:!ù*^$?./§%µ¨£+°encodedvalue');
                    expect(model.build.data.events[0].data['src_platform']).to.equal('myplatform');
                    expect(model.build.data.events[0].data['src_creation']).to.equal('mycreation');
                    expect(model.build.data.events[0].data['src_variant']).to.equal('myvariant');
                    expect(model.build.data.events[0].data['src_network']).to.equal('mynetwork');
                    expect(model.build.data.events[0].data['src_term']).to.equal('myterm&é"(-è_çà)=}]@^`|[{#~²,;:!ù*^$?./§%µ¨£+°encodedvalue');
                    expect(model.build.data.events[0].data['utm_source']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_medium']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_campaign']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_platform']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_creation']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_variant']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_network']).to.equal(undefined);
                    expect(model.build.data.events[0].data['utm_term']).to.equal(undefined);
                    done();
                });
            }
        });
    });
    it('Should add a campaign from querystring with another prefix', function (done) {
        window.location.href = baseURL + '&test_source=mysource&test_medium=mymedium&test_campaign=mycampaign&test_platform=myplatform&test_creation=mycreation&test_variant=myvariant&test_network=mynetwork&test_term=myterm';
        globalPA.setConfiguration('campaignPrefix', ['test_']);
        globalPA.sendEvent('toto', {}, {
            onBeforeSend: function (pa, model) {
                Utility.promiseThrowCatcher(done, function () {
                    expect(model.build.data.events[0].data['src_source']).to.equal('mysource');
                    expect(model.build.data.events[0].data['src_medium']).to.equal('mymedium');
                    expect(model.build.data.events[0].data['src_campaign']).to.equal('mycampaign');
                    expect(model.build.data.events[0].data['src_platform']).to.equal('myplatform');
                    expect(model.build.data.events[0].data['src_creation']).to.equal('mycreation');
                    expect(model.build.data.events[0].data['src_variant']).to.equal('myvariant');
                    expect(model.build.data.events[0].data['src_network']).to.equal('mynetwork');
                    expect(model.build.data.events[0].data['src_term']).to.equal('myterm');
                    done();
                });
            }
        });
    });
    it('Should add a campaign from querystring with multiple prefixes configured (only the first found)', function (done) {
        window.location.href = baseURL + '&test_second=mysecond&at_source=mysource&at_medium=mymedium&at_campaign=mycampaign&at_platform=myplatform&at_creation=mycreation&at_variant=myvariant&at_network=mynetwork&at_term=myterm';
        globalPA.setConfiguration('campaignPrefix', ['at_', 'test_']);
        globalPA.sendEvent('toto', {}, {
            onBeforeSend: function (pa, model) {
                Utility.promiseThrowCatcher(done, function () {
                    expect(model.build.data.events[0].data['src_source']).to.equal('mysource');
                    expect(model.build.data.events[0].data['src_medium']).to.equal('mymedium');
                    expect(model.build.data.events[0].data['src_campaign']).to.equal('mycampaign');
                    expect(model.build.data.events[0].data['src_platform']).to.equal('myplatform');
                    expect(model.build.data.events[0].data['src_creation']).to.equal('mycreation');
                    expect(model.build.data.events[0].data['src_variant']).to.equal('myvariant');
                    expect(model.build.data.events[0].data['src_network']).to.equal('mynetwork');
                    expect(model.build.data.events[0].data['src_term']).to.equal('myterm');
                    expect(model.build.data.events[0].data['test_second']).to.equal(undefined);
                    done();
                });
            }
        });
    });
    it('Should add an utm campaign from querystring', function (done) {
        window.location.href = baseURL + '&utm_source=mysource&utm_medium=mymedium&utm_campaign=mycampaign&utm_platform=&utm_creation=mycreation&utm_variant=&utm_network=mynetwork&utm_term=myterm';
        globalPA.sendEvent('toto', {}, {
            onBeforeSend: function (pa, model) {
                Utility.promiseThrowCatcher(done, function () {
                    expect(model.build.data.events[0].data['utm_source']).to.equal('mysource');
                    expect(model.build.data.events[0].data['utm_medium']).to.equal('mymedium');
                    expect(model.build.data.events[0].data['utm_campaign']).to.equal('mycampaign');
                    expect(model.build.data.events[0].data['utm_platform']).to.equal('');
                    expect(model.build.data.events[0].data['utm_creation']).to.equal('mycreation');
                    expect(model.build.data.events[0].data['utm_variant']).to.equal('');
                    expect(model.build.data.events[0].data['utm_network']).to.equal('mynetwork');
                    expect(model.build.data.events[0].data['utm_term']).to.equal('myterm');
                    expect(model.build.data.events[0].data['src_source']).to.equal(undefined);
                    expect(model.build.data.events[0].data['src_medium']).to.equal(undefined);
                    expect(model.build.data.events[0].data['src_campaign']).to.equal(undefined);
                    expect(model.build.data.events[0].data['src_platform']).to.equal(undefined);
                    expect(model.build.data.events[0].data['src_creation']).to.equal(undefined);
                    expect(model.build.data.events[0].data['src_variant']).to.equal(undefined);
                    expect(model.build.data.events[0].data['src_network']).to.equal(undefined);
                    expect(model.build.data.events[0].data['src_term']).to.equal(undefined);
                    done();
                });
            }
        });
    });
    it('Should add a campaign and an utm campaign from querystring', function (done) {
        window.location.href = baseURL
            + '&at_source=mysource&at_medium=mymedium&at_campaign=mycampaign&at_platform=myplatform&at_creation=mycreation&at_variant=myvariant&at_network=mynetwork&at_term=myterm'
            + '&utm_source=myutmsource&utm_medium=myutmmedium&utm_campaign=myutmcampaign&utm_platform=myutmplatform&utm_creation=myutmcreation&utm_variant=myutmvariant&utm_network=myutmnetwork&utm_term=myutmterm';
        globalPA.sendEvent('toto', {}, {
            onBeforeSend: function (pa, model) {
                Utility.promiseThrowCatcher(done, function () {
                    expect(model.build.data.events[0].data['src_source']).to.equal('mysource');
                    expect(model.build.data.events[0].data['src_medium']).to.equal('mymedium');
                    expect(model.build.data.events[0].data['src_campaign']).to.equal('mycampaign');
                    expect(model.build.data.events[0].data['src_platform']).to.equal('myplatform');
                    expect(model.build.data.events[0].data['src_creation']).to.equal('mycreation');
                    expect(model.build.data.events[0].data['src_variant']).to.equal('myvariant');
                    expect(model.build.data.events[0].data['src_network']).to.equal('mynetwork');
                    expect(model.build.data.events[0].data['src_term']).to.equal('myterm');
                    expect(model.build.data.events[0].data['utm_source']).to.equal('myutmsource');
                    expect(model.build.data.events[0].data['utm_medium']).to.equal('myutmmedium');
                    expect(model.build.data.events[0].data['utm_campaign']).to.equal('myutmcampaign');
                    expect(model.build.data.events[0].data['utm_platform']).to.equal('myutmplatform');
                    expect(model.build.data.events[0].data['utm_creation']).to.equal('myutmcreation');
                    expect(model.build.data.events[0].data['utm_variant']).to.equal('myutmvariant');
                    expect(model.build.data.events[0].data['utm_network']).to.equal('myutmnetwork');
                    expect(model.build.data.events[0].data['utm_term']).to.equal('myutmterm');
                    done();
                });
            }
        });
    });
    it('Should add a campaign with another prefix and an utm campaign from querystring', function (done) {
        window.location.href = baseURL
            + '&test_source=mysource&test_medium=mymedium&test_campaign=mycampaign&test_platform=myplatform&test_creation=mycreation&test_variant=myvariant&test_network=mynetwork&test_term=myterm'
            + '&utm_source=myutmsource&utm_medium=myutmmedium&utm_campaign=myutmcampaign&utm_platform=myutmplatform&utm_creation=myutmcreation&utm_variant=myutmvariant&utm_network=myutmnetwork&utm_term=myutmterm';
        globalPA.setConfiguration('campaignPrefix', ['test_']);
        globalPA.sendEvent('toto', {}, {
            onBeforeSend: function (pa, model) {
                Utility.promiseThrowCatcher(done, function () {
                    expect(model.build.data.events[0].data['src_source']).to.equal('mysource');
                    expect(model.build.data.events[0].data['src_medium']).to.equal('mymedium');
                    expect(model.build.data.events[0].data['src_campaign']).to.equal('mycampaign');
                    expect(model.build.data.events[0].data['src_platform']).to.equal('myplatform');
                    expect(model.build.data.events[0].data['src_creation']).to.equal('mycreation');
                    expect(model.build.data.events[0].data['src_variant']).to.equal('myvariant');
                    expect(model.build.data.events[0].data['src_network']).to.equal('mynetwork');
                    expect(model.build.data.events[0].data['src_term']).to.equal('myterm');
                    expect(model.build.data.events[0].data['utm_source']).to.equal('myutmsource');
                    expect(model.build.data.events[0].data['utm_medium']).to.equal('myutmmedium');
                    expect(model.build.data.events[0].data['utm_campaign']).to.equal('myutmcampaign');
                    expect(model.build.data.events[0].data['utm_platform']).to.equal('myutmplatform');
                    expect(model.build.data.events[0].data['utm_creation']).to.equal('myutmcreation');
                    expect(model.build.data.events[0].data['utm_variant']).to.equal('myutmvariant');
                    expect(model.build.data.events[0].data['utm_network']).to.equal('myutmnetwork');
                    expect(model.build.data.events[0].data['utm_term']).to.equal('myutmterm');
                    done();
                });
            }
        });
    });
    it('Should add a campaign and an utm campaign from querystring without overriding already set properties', function (done) {
        window.location.href = baseURL
            + '&at_source=mysource&at_medium=mymedium&at_campaign=mycampaign&at_platform=myplatform&at_creation=mycreation&at_variant=myvariant&at_network=mynetwork&at_term=myterm'
            + '&utm_source=myutmsource&utm_medium=myutmmedium&utm_campaign=myutmcampaign&utm_platform=myutmplatform&utm_creation=myutmcreation&utm_variant=myutmvariant&utm_network=myutmnetwork&utm_term=myutmterm';
        globalPA.setProperties({
            src_campaign: 'myothercampaign',
            src_creation: 'myothercreation',
            src_variant: 'myothervariant',
            src_term: 'myotherterm',
            utm_source: 'myothersource',
            utm_platform: 'myotherplatform',

        });
        globalPA.sendEvent('toto', {}, {
            onBeforeSend: function (pa, model) {
                Utility.promiseThrowCatcher(done, function () {
                    expect(model.build.data.events[0].data['src_source']).to.equal('mysource');
                    expect(model.build.data.events[0].data['src_medium']).to.equal('mymedium');
                    expect(model.build.data.events[0].data['src_campaign']).to.equal('myothercampaign');
                    expect(model.build.data.events[0].data['src_platform']).to.equal('myplatform');
                    expect(model.build.data.events[0].data['src_creation']).to.equal('myothercreation');
                    expect(model.build.data.events[0].data['src_variant']).to.equal('myothervariant');
                    expect(model.build.data.events[0].data['src_network']).to.equal('mynetwork');
                    expect(model.build.data.events[0].data['src_term']).to.equal('myotherterm');
                    expect(model.build.data.events[0].data['utm_source']).to.equal('myothersource');
                    expect(model.build.data.events[0].data['utm_medium']).to.equal('myutmmedium');
                    expect(model.build.data.events[0].data['utm_campaign']).to.equal('myutmcampaign');
                    expect(model.build.data.events[0].data['utm_platform']).to.equal('myotherplatform');
                    expect(model.build.data.events[0].data['utm_creation']).to.equal('myutmcreation');
                    expect(model.build.data.events[0].data['utm_variant']).to.equal('myutmvariant');
                    expect(model.build.data.events[0].data['utm_network']).to.equal('myutmnetwork');
                    expect(model.build.data.events[0].data['utm_term']).to.equal('myutmterm');
                    done();
                });
            }
        });
    });
});
