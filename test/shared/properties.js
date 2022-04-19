describe('Properties :', function () {
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
            globalPA.setProperty('custom', true, {'events': ['toto', 'tata']});
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
                'events': ['toto', 'tata']
            });
            globalPA.sendEvent('toto', {}, {
                onBeforeSend: function (pianoanalytics, model, next) {
                    expect(model.build.data.events[0].data['custom']).to.equal(true);
                    globalPA.sendEvent('tutu', {}, {
                        onBeforeSend: function (pianoanalytics2, model2, next2) {
                            expect(model2.build.data.events[0].data['custom']).to.equal(undefined);
                            globalPA.sendEvent('tata', {}, {
                                onBeforeSend: function (pianoanalytics3, model3) {
                                    expect(model3.build.data.events[0].data['custom']).to.equal(true);
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
            globalPA.setProperty('custom', true, {'events': ['toto', 'tata']});
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
                'events': ['toto', 'tata']
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
            globalPA.setProperty('visitor_privacy_consent', false);
            globalPA.sendEvent('toto', {}, {
                onBeforeSend: function (pianoanalytics, model) {
                    expect(model.build.data.events[0].data['visitor_privacy_consent']).to.equal(true);
                    expect(model.build.data.events[0].data['visitor_privacy_mode']).to.equal('optin');
                    done();
                }
            });
        });
        it('Should not override values of metadata specific properties', function (done) {
            globalPA.setProperty('event_collection_platform', '1');
            globalPA.setProperty('event_collection_version', '2');
            globalPA.setProperty('device_timestamp_utc', '3');
            globalPA.sendEvent('toto', {}, {
                onBeforeSend: function (pianoanalytics, model) {
                    expect(model.build.data.events[0].data['event_collection_platform']).to.not.equal('1');
                    expect(model.build.data.events[0].data['event_collection_platform']).to.not.equal(undefined);
                    expect(model.build.data.events[0].data['event_collection_version']).to.not.equal('2');
                    expect(model.build.data.events[0].data['event_collection_version']).to.not.equal(undefined);
                    expect(model.build.data.events[0].data['device_timestamp_utc']).to.not.equal('3');
                    expect(model.build.data.events[0].data['device_timestamp_utc']).to.not.equal(undefined);
                    done();
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
            }, {'events': ['toto', 'tata']});
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
                'events': ['toto', 'tata']
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
                                onBeforeSend: function (pianoanalytics3, model3) {
                                    expect(model3.build.data.events[0].data['custom']).to.equal(true);
                                    expect(model3.build.data.events[0].data['another']).to.equal('1');
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
            }, {'events': ['toto', 'tata']});
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
                'events': ['toto', 'tata']
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
                'visitor_privacy_consent': false,
                'visitor_privacy_mode': 'test'
            });
            globalPA.sendEvent('toto', {}, {
                onBeforeSend: function (pianoanalytics, model) {
                    expect(model.build.data.events[0].data['visitor_privacy_consent']).to.equal(true);
                    expect(model.build.data.events[0].data['visitor_privacy_mode']).to.equal('optin');
                    done();
                }
            });
        });
        it('Should not override values of metadata specific properties', function (done) {
            globalPA.setProperties({
                'event_collection_platform': '1',
                'event_collection_version': '2',
                'device_timestamp_utc': '3'
            });
            globalPA.sendEvent('toto', {}, {
                onBeforeSend: function (pianoanalytics, model) {
                    expect(model.build.data.events[0].data['event_collection_platform']).to.not.equal('1');
                    expect(model.build.data.events[0].data['event_collection_platform']).to.not.equal(undefined);
                    expect(model.build.data.events[0].data['event_collection_version']).to.not.equal('2');
                    expect(model.build.data.events[0].data['event_collection_version']).to.not.equal(undefined);
                    expect(model.build.data.events[0].data['device_timestamp_utc']).to.not.equal('3');
                    expect(model.build.data.events[0].data['device_timestamp_utc']).to.not.equal(undefined);
                    done();
                }
            });
        });
    });
    it('Should delete a property', function () {
        globalPA.setProperty('custom', true);
        expect(globalPA.properties['custom']).to.deep.equal({
            'options': {},
            'value': true
        });
        globalPA.deleteProperty('custom', true);
        expect(globalPA.properties['custom']).to.equal(undefined);
    });
});
