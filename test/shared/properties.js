describe('Properties :', function () {
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
    describe('setProperty :', function () {
        it('Should add a property for the next sendEvent (prop without options)', function (done) {
            globalPA.setProperty('custom', true);
            globalPA.sendEvent('toto', {}, {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    globalPA.sendEvent('tata', {}, {
                        onBeforeSend: function (pianoanalytics2, model2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(undefined);
                            done();
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should add a property for the next sendEvent(s) (prop with persistent option)', function (done) {
            globalPA.setProperty('custom', true, {'persistent': true});
            globalPA.sendEvent('toto', {}, {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    globalPA.sendEvent('tata', {}, {
                        onBeforeSend: function (pianoanalytics2, model2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(true);
                            done();
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should add a property for the next sendEvent (prop with events option)', function (done) {
            globalPA.setProperty('custom', true, {'events': ['to*', 'tata']});
            globalPA.sendEvent('another', {}, {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(undefined);
                    globalPA.sendEvent('toto', {}, {
                        onBeforeSend: function (pianoanalytics2, model2, next2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(true);
                            globalPA.sendEvent('tata', {}, {
                                onBeforeSend: function (pianoanalytics3, model3) {
                                    expect(model3.build.data.events[0].data['custom']).to.equal(undefined);
                                    done();
                                }
                            });
                            next2(false);
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should add a property for the next sendEvent (prop with events and persistent option)', function (done) {
            globalPA.setProperty('custom', true, {
                'persistent': true,
                'events': ['toto', 'ta*']
            });
            globalPA.sendEvent('toto', {}, {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    globalPA.sendEvent('tutu', {}, {
                        onBeforeSend: function (pianoanalytics2, model2, next2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(undefined);
                            globalPA.sendEvent('tata', {}, {
                                onBeforeSend: function (pianoanalytics3, model3, next3) {
                                    expect(model3.build.data.events[0].data['custom']).to.equal(true);
                                    globalPA.sendEvent('taco', {}, {
                                        onBeforeSend: function (pianoanalytics4, model4) {
                                            expect(model4.build.data.events[0].data['custom']).to.equal(true);
                                            done();
                                        }
                                    });
                                    next3(false);
                                }
                            });
                            next2(false);
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should add a property for the next sendEvents (prop without options)', function (done) {
            globalPA.setProperty('custom', true);
            globalPA.sendEvents([
                {name: 'toto', data: {}},
                {name: 'another', data: {}}
            ], {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    expect(model.build.data.events[1].data['custom']).to.equal(true);
                    globalPA.sendEvents([
                        {name: 'tata', data: {}},
                        {name: 'another2', data: {}}
                    ], {
                        onBeforeSend: function (pianoanalytics2, model2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(undefined);
                            expect(model2.build.data.events[1].data['custom']).to.equal(undefined);
                            done();
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should add a property for the next sendEvents(s) (prop with persistent option)', function (done) {
            globalPA.setProperty('custom', true, {'persistent': true});
            globalPA.sendEvents([
                {name: 'toto', data: {}},
                {name: 'another', data: {}}
            ], {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    expect(model.build.data.events[1].data['custom']).to.equal(true);
                    globalPA.sendEvents([
                        {name: 'tata', data: {}},
                        {name: 'another2', data: {}}
                    ], {
                        onBeforeSend: function (pianoanalytics2, model2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(true);
                            expect(model2.build.data.events[1].data['custom']).to.equal(true);
                            done();
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should add a property for the next sendEvents (prop with events option)', function (done) {
            globalPA.setProperty('custom', true, {'events': ['to*', 'tata']});
            globalPA.sendEvents([
                {name: 'toto', data: {}},
                {name: 'another', data: {}}
            ], {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    expect(model.build.data.events[1].data['custom']).to.equal(undefined);
                    globalPA.sendEvents([
                        {name: 'tata', data: {}},
                        {name: 'another2', data: {}}
                    ], {
                        onBeforeSend: function (pianoanalytics2, model2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(undefined);
                            expect(model2.build.data.events[1].data['custom']).to.equal(undefined);
                            done();
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should add a property for the next sendEvents (prop with events and persistent option)', function (done) {
            globalPA.setProperty('custom', true, {
                'persistent': true,
                'events': ['to*', 'ta*']
            });
            globalPA.sendEvents([
                {name: 'toto', data: {}},
                {name: 'another', data: {}}
            ], {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    expect(model.build.data.events[1].data['custom']).to.equal(undefined);
                    globalPA.sendEvents([
                        {name: 'tata', data: {}},
                        {name: 'another2', data: {}}
                    ], {
                        onBeforeSend: function (pianoanalytics2, model2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(true);
                            expect(model2.build.data.events[1].data['custom']).to.equal(undefined);
                            done();
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should not override values of privacy specific properties', function (done) {
            globalPA.setProperty('visitor_privacy_consent', 'myconsent');
            globalPA.setProperty('visitor_privacy_mode', 'test');
            globalPA.sendEvent('toto', {'visitor_privacy_mode': 'mymode'}, {
                onBeforeSend: function (pianoanalytics, model) {
                    Utility.promiseThrowCatcher(done, function () {
                        expect(model.build.data.events[0].data['visitor_privacy_consent']).to.equal('myconsent');
                        expect(model.build.data.events[0].data['visitor_privacy_mode']).to.equal('mymode');
                        done();
                    });
                }
            });
        });
        it('Should not override values of metadata specific properties', function (done) {
            globalPA.setProperty('event_collection_platform', '1');
            globalPA.setProperty('event_collection_version', '22');
            globalPA.sendEvent('toto', {
                'event_collection_version': '2',
                'device_timestamp_utc': '3'
            }, {
                onBeforeSend: function (pianoanalytics, model) {
                    Utility.promiseThrowCatcher(done, function () {
                        expect(model.build.data.events[0].data['event_collection_platform']).to.equal('1');
                        expect(model.build.data.events[0].data['event_collection_version']).to.equal('2');
                        expect(model.build.data.events[0].data['device_timestamp_utc']).to.equal('3');
                        done();
                    });
                }
            });
        });
    });
    describe('setProperties :', function () {
        it('Should add properties for the next sendEvent (props without options)', function (done) {
            globalPA.setProperties({
                'custom': true,
                'another': '1',
            });
            globalPA.sendEvent('toto', {}, {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    expect(model.build.data.events[0].data['another']).to.equal('1');
                    globalPA.sendEvent('tata', {}, {
                        onBeforeSend: function (pianoanalytics2, model2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(undefined);
                            expect(model2.build.data.events[0].data['another']).to.equal(undefined);
                            done();
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should add properties for the next sendEvent(s) (props with persistent option)', function (done) {
            globalPA.setProperties({
                'custom': true,
                'another': '1',
            }, {'persistent': true});
            globalPA.sendEvent('toto', {}, {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    expect(model.build.data.events[0].data['another']).to.equal('1');
                    globalPA.sendEvent('tata', {}, {
                        onBeforeSend: function (pianoanalytics2, model2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(true);
                            expect(model2.build.data.events[0].data['another']).to.equal('1');
                            done();
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should add properties for the next sendEvent (props with events option)', function (done) {
            globalPA.setProperties({
                'custom': true,
                'another': '1'
            }, {'events': ['to*', 'tata']});
            globalPA.sendEvent('toto', {}, {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    expect(model.build.data.events[0].data['another']).to.equal('1');
                    globalPA.sendEvent('tata', {}, {
                        onBeforeSend: function (pianoanalytics2, model2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(undefined);
                            expect(model2.build.data.events[0].data['another']).to.equal(undefined);
                            done();
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should add properties for the next sendEvent (props with events and persistent option)', function (done) {
            globalPA.setProperties({
                'custom': true,
                'another': '1'
            }, {
                'persistent': true,
                'events': ['toto', 'ta*']
            });
            globalPA.sendEvent('toto', {}, {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    expect(model.build.data.events[0].data['another']).to.equal('1');
                    globalPA.sendEvent('tutu', {}, {
                        onBeforeSend: function (pianoanalytics2, model2, next2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(undefined);
                            expect(model2.build.data.events[0].data['another']).to.equal(undefined);
                            globalPA.sendEvent('tata', {}, {
                                onBeforeSend: function (pianoanalytics3, model3, next3) {
                                    expect(model3.build.data.events[0].data['custom']).to.equal(true);
                                    expect(model3.build.data.events[0].data['another']).to.equal('1');
                                    globalPA.sendEvent('taco', {}, {
                                        onBeforeSend: function (pianoanalytics4, model4) {
                                            expect(model4.build.data.events[0].data['custom']).to.equal(true);
                                            expect(model4.build.data.events[0].data['another']).to.equal('1');
                                            done();
                                        }
                                    });
                                    next3(false);
                                }
                            });
                            next2(false);
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should add properties for the next sendEvents (props without options)', function (done) {
            globalPA.setProperties({
                'custom': true,
                'another': '1'
            });
            globalPA.sendEvents([
                {name: 'toto', data: {}},
                {name: 'another', data: {}}
            ], {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    expect(model.build.data.events[0].data['another']).to.equal('1');
                    expect(model.build.data.events[1].data['custom']).to.equal(true);
                    expect(model.build.data.events[1].data['another']).to.equal('1');
                    globalPA.sendEvents([
                        {name: 'tata', data: {}},
                        {name: 'another2', data: {}}
                    ], {
                        onBeforeSend: function (pianoanalytics2, model2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(undefined);
                            expect(model2.build.data.events[0].data['another']).to.equal(undefined);
                            expect(model2.build.data.events[1].data['custom']).to.equal(undefined);
                            expect(model2.build.data.events[1].data['another']).to.equal(undefined);
                            done();
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should add properties for the next sendEvents(s) (props with persistent option)', function (done) {
            globalPA.setProperties({
                'custom': true,
                'another': '1'
            }, {'persistent': true});
            globalPA.sendEvents([
                {name: 'toto', data: {}},
                {name: 'another', data: {}}
            ], {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    expect(model.build.data.events[0].data['another']).to.equal('1');
                    expect(model.build.data.events[1].data['custom']).to.equal(true);
                    expect(model.build.data.events[1].data['another']).to.equal('1');
                    globalPA.sendEvents([
                        {name: 'tata', data: {}},
                        {name: 'another2', data: {}}
                    ], {
                        onBeforeSend: function (pianoanalytics2, model2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(true);
                            expect(model2.build.data.events[0].data['another']).to.equal('1');
                            expect(model2.build.data.events[1].data['custom']).to.equal(true);
                            expect(model2.build.data.events[1].data['another']).to.equal('1');
                            done();
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should add properties for the next sendEvents (props with events option)', function (done) {
            globalPA.setProperties({
                'custom': true,
                'another': '1'
            }, {'events': ['to*', 'tata']});
            globalPA.sendEvents([
                {name: 'toto', data: {}},
                {name: 'another', data: {}}
            ], {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    expect(model.build.data.events[0].data['another']).to.equal('1');
                    expect(model.build.data.events[1].data['custom']).to.equal(undefined);
                    expect(model.build.data.events[1].data['another']).to.equal(undefined);
                    globalPA.sendEvents([
                        {name: 'tata', data: {}},
                        {name: 'another2', data: {}}
                    ], {
                        onBeforeSend: function (pianoanalytics2, model2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(undefined);
                            expect(model2.build.data.events[0].data['another']).to.equal(undefined);
                            expect(model2.build.data.events[1].data['custom']).to.equal(undefined);
                            expect(model2.build.data.events[1].data['another']).to.equal(undefined);
                            done();
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should add properties for the next sendEvents (props with events and persistent option)', function (done) {
            globalPA.setProperties({
                'custom': true,
                'another': '1'
            }, {
                'persistent': true,
                'events': ['to*', 'ta*']
            });
            globalPA.sendEvents([
                {name: 'toto', data: {}},
                {name: 'another', data: {}}
            ], {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    expect(model.build.data.events[0].data['another']).to.equal('1');
                    expect(model.build.data.events[1].data['custom']).to.equal(undefined);
                    expect(model.build.data.events[1].data['another']).to.equal(undefined);
                    globalPA.sendEvents([
                        {name: 'tata', data: {}},
                        {name: 'another2', data: {}}
                    ], {
                        onBeforeSend: function (pianoanalytics2, model2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(true);
                            expect(model2.build.data.events[0].data['another']).to.equal('1');
                            expect(model2.build.data.events[1].data['custom']).to.equal(undefined);
                            expect(model2.build.data.events[1].data['another']).to.equal(undefined);
                            done();
                        }
                    });
                    next(false);
                }
            });
        });
        it('Should not override values of privacy specific properties', function (done) {
            globalPA.setProperties({
                'visitor_privacy_consent': 'myconsent',
                'visitor_privacy_mode': 'test'
            });
            globalPA.sendEvent('toto', {'visitor_privacy_mode': 'mymode'}, {
                onBeforeSend: function (pianoanalytics, model) {
                    Utility.promiseThrowCatcher(done, function () {
                        expect(model.build.data.events[0].data['visitor_privacy_consent']).to.equal('myconsent');
                        expect(model.build.data.events[0].data['visitor_privacy_mode']).to.equal('mymode');
                        done();
                    });
                }
            });
        });
        it('Should not override values of metadata specific properties', function (done) {
            globalPA.setProperties({
                'event_collection_platform': '1',
            }, {events: ['tata']});
            globalPA.setProperties({
                'event_collection_version': '2',
                'device_timestamp_utc': 'test'
            }, {events: ['toto']});
            globalPA.setProperties({
                'device_local_hour': '4'
            }, {events: ['to*']});
            globalPA.sendEvent('toto', {'device_timestamp_utc': '3'}, {
                onBeforeSend: function (pianoanalytics, model) {
                    Utility.promiseThrowCatcher(done, function () {
                        expect(model.build.data.events[0].data['event_collection_platform']).to.not.equal('1');
                        expect(model.build.data.events[0].data['event_collection_platform']).to.not.equal(undefined);
                        expect(model.build.data.events[0].data['event_collection_version']).to.equal('2');
                        expect(model.build.data.events[0].data['device_timestamp_utc']).to.equal('3');
                        expect(model.build.data.events[0].data['device_local_hour']).to.equal('4');
                        done();
                    });
                }
            });
        });
    });
    it('Should delete a property', function () {
        globalPA.setProperty('custom', true);
        expect(globalPA._properties['custom']).to.deep.equal({
            'options': {},
            'value': true
        });
        globalPA.deleteProperty('custom', true);
        expect(globalPA._properties['custom']).to.equal(undefined);
    });
});
