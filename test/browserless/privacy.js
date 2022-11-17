describe('Privacy not in Browser :', function () {
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
    describe('user cases :', function () {
        let checkAndForceDynamicPropertiesToStaticTestingValues = function (events, propsUndefined, propsToForce) {
            for (let prop of propsUndefined) {
                for (let evt of events) {
                    expect(evt.data[prop]).to.equal(undefined);
                }
            }
            for (let prop of propsToForce) {
                for (let evt of events) {
                    expect(evt.data[prop]).to.not.equal(undefined);
                    evt.data[prop] = 'forced_value_for_test';
                }
            }
        };
        let testEvents;
        let regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        beforeEach(function () {
            testEvents = [
                {
                    name: 'custom.specific.event', data: {
                        'custom.specific.event': 'custom.specific.event',
                        'customprop1_sub1': '11',
                        'customprop1_sub1_deep1': '111',
                        'customprop1_sub1_deep2': '112',
                        'customprop1_sub2': '12',
                        'customprop1_sub2_deep1': '121',
                        'customprop1_sub2_deep2': '122',
                        'customprop1_sub3': '13',
                        'customprop1_sub3_deep1': '131',
                        'customprop1_sub3_deep2': '132',
                        'customprop2_sub1': '21',
                        'customprop2_sub1_deep1': '211',
                        'customprop2_sub1_deep2': '212',
                        'customprop2_sub2': '22',
                        'customprop2_sub2_deep1': '221',
                        'customprop2_sub2_deep2': '222',
                        'customprop2andmore1': '2a1',
                        'customprop2andmore1_sub1': '2a1',
                        'customprop2andmore1_sub2': '2a2',
                        'customprop2andmore2': '2a2',
                        'customprop3': '3',
                        'customprop3_sub1': '31',
                        'customprop3_sub1_deep1': '311',
                        'customprop3_sub1_deep2': '312',
                        'customprop3_sub2': '32',
                        'customprop3_sub2_deep1': '321',
                        'customprop3_sub2_deep2': '322',
                        'customprop3andmore1': '3a1',
                        'customprop3andmore2': '3a2'
                    }
                },
                {
                    name: 'custom.all.one', data: {
                        'custom.all.one': 'custom.all.one',
                        'customprop1_sub1': '11',
                        'customprop1_sub1_deep1': '111',
                        'customprop1_sub1_deep2': '112',
                        'customprop1_sub2': '12',
                        'customprop1_sub2_deep1': '121',
                        'customprop1_sub2_deep2': '122',
                        'customprop1_sub3': '13',
                        'customprop1_sub3_deep1': '131',
                        'customprop1_sub3_deep2': '132',
                        'customprop2_sub1': '21',
                        'customprop2_sub1_deep1': '211',
                        'customprop2_sub1_deep2': '212',
                        'customprop2_sub2': '22',
                        'customprop2_sub2_deep1': '221',
                        'customprop2_sub2_deep2': '222',
                        'customprop2andmore1': '2a1',
                        'customprop2andmore1_sub1': '2a1',
                        'customprop2andmore1_sub2': '2a2',
                        'customprop2andmore2': '2a2',
                        'customprop3': '3',
                        'customprop3_sub1': '31',
                        'customprop3_sub1_deep1': '311',
                        'customprop3_sub1_deep2': '312',
                        'customprop3_sub2': '32',
                        'customprop3_sub2_deep1': '321',
                        'customprop3_sub2_deep2': '322',
                        'customprop3andmore1': '3a1',
                        'customprop3andmore2': '3a2'
                    }
                },
                {
                    name: 'custom.all.two', data: {
                        'custom.all.two': 'custom.all.two',
                        'customprop1_sub1': '11',
                        'customprop1_sub1_deep1': '111',
                        'customprop1_sub1_deep2': '112',
                        'customprop1_sub2': '12',
                        'customprop1_sub2_deep1': '121',
                        'customprop1_sub2_deep2': '122',
                        'customprop1_sub3': '13',
                        'customprop1_sub3_deep1': '131',
                        'customprop1_sub3_deep2': '132',
                        'customprop2_sub1': '21',
                        'customprop2_sub1_deep1': '211',
                        'customprop2_sub1_deep2': '212',
                        'customprop2_sub2': '22',
                        'customprop2_sub2_deep1': '221',
                        'customprop2_sub2_deep2': '222',
                        'customprop2andmore1': '2a1',
                        'customprop2andmore1_sub1': '2a1',
                        'customprop2andmore1_sub2': '2a2',
                        'customprop2andmore2': '2a2',
                        'customprop3': '3',
                        'customprop3_sub1': '31',
                        'customprop3_sub1_deep1': '311',
                        'customprop3_sub1_deep2': '312',
                        'customprop3_sub2': '32',
                        'customprop3_sub2_deep1': '321',
                        'customprop3_sub2_deep2': '322',
                        'customprop3andmore1': '3a1',
                        'customprop3andmore2': '3a2'
                    }
                },
                {
                    name: 'custom.allisgreen', data: {
                        'custom.allisgreen': 'custom.allisgreen',
                        'customprop1_sub1': '11',
                        'customprop1_sub1_deep1': '111',
                        'customprop1_sub1_deep2': '112',
                        'customprop1_sub2': '12',
                        'customprop1_sub2_deep1': '121',
                        'customprop1_sub2_deep2': '122',
                        'customprop1_sub3': '13',
                        'customprop1_sub3_deep1': '131',
                        'customprop1_sub3_deep2': '132',
                        'customprop2_sub1': '21',
                        'customprop2_sub1_deep1': '211',
                        'customprop2_sub1_deep2': '212',
                        'customprop2_sub2': '22',
                        'customprop2_sub2_deep1': '221',
                        'customprop2_sub2_deep2': '222',
                        'customprop2andmore1': '2a1',
                        'customprop2andmore1_sub1': '2a1',
                        'customprop2andmore1_sub2': '2a2',
                        'customprop2andmore2': '2a2',
                        'customprop3': '3',
                        'customprop3_sub1': '31',
                        'customprop3_sub1_deep1': '311',
                        'customprop3_sub1_deep2': '312',
                        'customprop3_sub2': '32',
                        'customprop3_sub2_deep1': '321',
                        'customprop3_sub2_deep2': '322',
                        'customprop3andmore1': '3a1',
                        'customprop3andmore2': '3a2'
                    }
                },
                {
                    name: 'click.exit', data: {
                        'click': 'click exit',
                        'click_chapter1': 'click chapter 1',
                        'click_chapter2': 'click chapter 2',
                        'click_chapter3': 'click chapter 3',
                        'page': 'page name',
                        'page_chapter1': 'chapter 1',
                        'page_chapter2': 'chapter 2',
                        'page_chapter3': 'chapter 3',
                        'customprop1_sub1': '11',
                        'customprop1_sub1_deep1': '111',
                        'customprop1_sub1_deep2': '112',
                        'customprop1_sub2': '12',
                        'customprop1_sub2_deep1': '121',
                        'customprop1_sub2_deep2': '122',
                        'customprop1_sub3': '13',
                        'customprop1_sub3_deep1': '131',
                        'customprop1_sub3_deep2': '132',
                        'customprop2_sub1': '21',
                        'customprop2_sub1_deep1': '211',
                        'customprop2_sub1_deep2': '212',
                        'customprop2_sub2': '22',
                        'customprop2_sub2_deep1': '221',
                        'customprop2_sub2_deep2': '222',
                        'customprop2andmore1': '2a1',
                        'customprop2andmore1_sub1': '2a1',
                        'customprop2andmore1_sub2': '2a2',
                        'customprop2andmore2': '2a2',
                        'customprop3': '3',
                        'customprop3_sub1': '31',
                        'customprop3_sub1_deep1': '311',
                        'customprop3_sub1_deep2': '312',
                        'customprop3_sub2': '32',
                        'customprop3_sub2_deep1': '321',
                        'customprop3_sub2_deep2': '322',
                        'customprop3andmore1': '3a1',
                        'customprop3andmore2': '3a2'
                    }
                },
                {
                    name: 'click.navigation', data: {
                        'click': 'click navigation',
                        'click_chapter1': 'click chapter 1',
                        'click_chapter2': 'click chapter 2',
                        'click_chapter3': 'click chapter 3',
                        'page': 'page name',
                        'page_chapter1': 'chapter 1',
                        'page_chapter2': 'chapter 2',
                        'page_chapter3': 'chapter 3',
                        'customprop1_sub1': '11',
                        'customprop1_sub1_deep1': '111',
                        'customprop1_sub1_deep2': '112',
                        'customprop1_sub2': '12',
                        'customprop1_sub2_deep1': '121',
                        'customprop1_sub2_deep2': '122',
                        'customprop1_sub3': '13',
                        'customprop1_sub3_deep1': '131',
                        'customprop1_sub3_deep2': '132',
                        'customprop2_sub1': '21',
                        'customprop2_sub1_deep1': '211',
                        'customprop2_sub1_deep2': '212',
                        'customprop2_sub2': '22',
                        'customprop2_sub2_deep1': '221',
                        'customprop2_sub2_deep2': '222',
                        'customprop2andmore1': '2a1',
                        'customprop2andmore1_sub1': '2a1',
                        'customprop2andmore1_sub2': '2a2',
                        'customprop2andmore2': '2a2',
                        'customprop3': '3',
                        'customprop3_sub1': '31',
                        'customprop3_sub1_deep1': '311',
                        'customprop3_sub1_deep2': '312',
                        'customprop3_sub2': '32',
                        'customprop3_sub2_deep1': '321',
                        'customprop3_sub2_deep2': '322',
                        'customprop3andmore1': '3a1',
                        'customprop3andmore2': '3a2'
                    }
                },
                {
                    name: 'page.display', data: {
                        'page': 'page name',
                        'page_chapter1': 'chapter 1',
                        'page_chapter2': 'chapter 2',
                        'page_chapter3': 'chapter 3',
                        'customprop1_sub1': '11',
                        'customprop1_sub1_deep1': '111',
                        'customprop1_sub1_deep2': '112',
                        'customprop1_sub2': '12',
                        'customprop1_sub2_deep1': '121',
                        'customprop1_sub2_deep2': '122',
                        'customprop1_sub3': '13',
                        'customprop1_sub3_deep1': '131',
                        'customprop1_sub3_deep2': '132',
                        'customprop2_sub1': '21',
                        'customprop2_sub1_deep1': '211',
                        'customprop2_sub1_deep2': '212',
                        'customprop2_sub2': '22',
                        'customprop2_sub2_deep1': '221',
                        'customprop2_sub2_deep2': '222',
                        'customprop2andmore1': '2a1',
                        'customprop2andmore1_sub1': '2a1',
                        'customprop2andmore1_sub2': '2a2',
                        'customprop2andmore2': '2a2',
                        'customprop3': '3',
                        'customprop3_sub1': '31',
                        'customprop3_sub1_deep1': '311',
                        'customprop3_sub1_deep2': '312',
                        'customprop3_sub2': '32',
                        'customprop3_sub2_deep1': '321',
                        'customprop3_sub2_deep2': '322',
                        'customprop3andmore1': '3a1',
                        'customprop3andmore2': '3a2'
                    }
                }
            ];
        });
        it('Should work properly using default mode (optin)', function (done) {
            globalPA.privacy.exclude.properties(
                [
                    'event_collection_*',
                    'customprop1_sub1_deep1',
                    'customprop1_sub2_deep2',
                    'customprop2*',
                    'customprop3_sub1_*',
                    'user_category'
                ],
                null,
                ['page.display', 'click.action', 'custom.*']
            );
            globalPA.privacy.exclude.events(['custom.specific.event', 'custom.all.*', 'click.exit']);
            globalPA.privacy.exclude.storageKeys(['pa_user']);
            globalPA.setUser('123', '456789');
            globalPA.sendEvents(testEvents,
                {
                    onBeforeSend: function (PianoAnalytics, model) {
                        globalPA.storage.getItem(globalPA.getConfiguration('storageUser'), function (userDataStored) {
                            globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored) {
                                globalPA.storage.getItem(globalPA.getConfiguration('privacy').storageKey, function (privacyStored) {
                                    expect(userDataStored).to.equal(null);
                                    expect(privacyStored).to.equal('optin');
                                    expect(regexUUID.test(visitorIdStored)).to.equal(true);
                                    expect(visitorIdStored).to.equal(model.visitorId);

                                    checkAndForceDynamicPropertiesToStaticTestingValues(
                                        model.build.data.events,
                                        [
                                            'event_collection_platform',
                                            'event_collection_version',
                                            'browser_language',
                                            'browser_language_local',
                                            'device_display_height',
                                            'device_display_width',
                                            'device_screen_height',
                                            'device_screen_width',
                                            'previous_url',
                                        ],
                                        [
                                            'device_timestamp_utc',
                                            'device_local_hour',
                                            'device_hour',
                                        ]
                                    );
                                    expect(model.build.data).to.deep.equal({
                                        'events': [
                                            {
                                                'data': {
                                                    'custom.allisgreen': 'custom.allisgreen',
                                                    'customprop1_sub1': '11',
                                                    'customprop1_sub1_deep2': '112',
                                                    'customprop1_sub2': '12',
                                                    'customprop1_sub2_deep1': '121',
                                                    'customprop1_sub3': '13',
                                                    'customprop1_sub3_deep1': '131',
                                                    'customprop1_sub3_deep2': '132',
                                                    'customprop3': '3',
                                                    'customprop3_sub1': '31',
                                                    'customprop3_sub2': '32',
                                                    'customprop3_sub2_deep1': '321',
                                                    'customprop3_sub2_deep2': '322',
                                                    'customprop3andmore1': '3a1',
                                                    'customprop3andmore2': '3a2',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'user_id': '123',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'optin'
                                                },
                                                'name': 'custom.allisgreen'
                                            },
                                            {
                                                'data': {
                                                    'click': 'click navigation',
                                                    'click_chapter1': 'click chapter 1',
                                                    'click_chapter2': 'click chapter 2',
                                                    'click_chapter3': 'click chapter 3',
                                                    'page': 'page name',
                                                    'page_chapter1': 'chapter 1',
                                                    'page_chapter2': 'chapter 2',
                                                    'page_chapter3': 'chapter 3',
                                                    'customprop1_sub1': '11',
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub1_deep2': '112',
                                                    'customprop1_sub2': '12',
                                                    'customprop1_sub2_deep1': '121',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop1_sub3': '13',
                                                    'customprop1_sub3_deep1': '131',
                                                    'customprop1_sub3_deep2': '132',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3': '3',
                                                    'customprop3_sub1': '31',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'customprop3_sub2': '32',
                                                    'customprop3_sub2_deep1': '321',
                                                    'customprop3_sub2_deep2': '322',
                                                    'customprop3andmore1': '3a1',
                                                    'customprop3andmore2': '3a2',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'user_id': '123',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'optin'
                                                },
                                                'name': 'click.navigation'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1': '11',
                                                    'customprop1_sub1_deep2': '112',
                                                    'customprop1_sub2': '12',
                                                    'customprop1_sub2_deep1': '121',
                                                    'customprop1_sub3': '13',
                                                    'customprop1_sub3_deep1': '131',
                                                    'customprop1_sub3_deep2': '132',
                                                    'customprop3': '3',
                                                    'customprop3_sub1': '31',
                                                    'customprop3_sub2': '32',
                                                    'customprop3_sub2_deep1': '321',
                                                    'customprop3_sub2_deep2': '322',
                                                    'customprop3andmore1': '3a1',
                                                    'customprop3andmore2': '3a2',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'page': 'page name',
                                                    'page_chapter1': 'chapter 1',
                                                    'page_chapter2': 'chapter 2',
                                                    'page_chapter3': 'chapter 3',
                                                    'user_id': '123',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'optin'
                                                },
                                                'name': 'page.display'
                                            }
                                        ]
                                    });
                                    done();
                                });
                            });
                        });
                    }
                });
        });
        it('Should work properly using optout mode', function (done) {
            globalPA.privacy.setMode('optout');
            globalPA.privacy.include.properties(
                [
                    'event_collection_*',
                    'customprop1_sub1_deep1',
                    'customprop1_sub2_deep2',
                    'customprop2*',
                    'customprop3_sub1_*',
                    'user_category'
                ],
                null,
                ['page.display', 'click.action', 'custom.*']
            );
            globalPA.privacy.include.events(['custom.specific.event', 'custom.all.*', 'click.exit']);
            globalPA.privacy.include.storageKeys(['pa_user']);
            globalPA.setUser('123', '456789');
            globalPA.sendEvents(testEvents,
                {
                    onBeforeSend: function (PianoAnalytics, model) {
                        globalPA.storage.getItem(globalPA.getConfiguration('storageUser'), function (userDataStored) {
                            globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored) {
                                globalPA.storage.getItem(globalPA.getConfiguration('privacy').storageKey, function (privacyStored) {
                                    expect(userDataStored).to.deep.equal({
                                        id: '123',
                                        category: '456789'
                                    });
                                    expect(privacyStored).to.equal('optout');
                                    expect(model.visitorId).to.equal('OPT-OUT');
                                    expect(visitorIdStored).to.equal(null);

                                    checkAndForceDynamicPropertiesToStaticTestingValues(
                                        model.build.data.events,
                                        [
                                            'browser_language',
                                            'browser_language_local',
                                            'device_display_height',
                                            'device_display_width',
                                            'device_screen_height',
                                            'device_screen_width',
                                            'previous_url'
                                        ],
                                        [
                                            'device_timestamp_utc',
                                            'event_collection_platform',
                                            'event_collection_version'
                                        ]
                                    );
                                    expect(model.build.data).to.deep.equal({
                                        'events': [
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'optout'
                                                },
                                                'name': 'custom.specific.event'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'optout'
                                                },
                                                'name': 'custom.all.one'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'optout'
                                                },
                                                'name': 'custom.all.two'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'optout'
                                                },
                                                'name': 'custom.allisgreen'
                                            },
                                            {
                                                'data': {
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'optout'
                                                },
                                                'name': 'click.exit'
                                            },
                                            {
                                                'data': {
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'optout'
                                                },
                                                'name': 'click.navigation'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'optout'
                                                },
                                                'name': 'page.display'
                                            }
                                        ]
                                    });
                                    done();
                                });
                            });
                        });
                    }
                });
        });
        it('Should work properly using no-consent mode', function (done) {
            globalPA.privacy.setMode('no-consent');
            globalPA.privacy.include.properties(
                [
                    'event_collection_*',
                    'customprop1_sub1_deep1',
                    'customprop1_sub2_deep2',
                    'customprop2*',
                    'customprop3_sub1_*',
                    'user_category'
                ],
                null,
                ['page.display', 'click.action', 'custom.*']
            );
            globalPA.privacy.include.events(['custom.specific.event', 'custom.all.*', 'click.exit']);
            globalPA.privacy.include.storageKeys(['pa_user']);
            globalPA.setUser('123', '456789');
            globalPA.sendEvents(testEvents,
                {
                    onBeforeSend: function (PianoAnalytics, model) {
                        globalPA.storage.getItem(globalPA.getConfiguration('storageUser'), function (userDataStored) {
                            globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored) {
                                globalPA.storage.getItem(globalPA.getConfiguration('privacy').storageKey, function (privacyStored) {
                                    expect(userDataStored).to.equal(null);
                                    expect(privacyStored).to.equal(null);
                                    expect(visitorIdStored).to.equal(null);
                                    expect(model.visitorId).to.equal('no-consent');

                                    checkAndForceDynamicPropertiesToStaticTestingValues(
                                        model.build.data.events,
                                        [
                                            'browser_language',
                                            'browser_language_local',
                                            'device_display_height',
                                            'device_display_width',
                                            'device_screen_height',
                                            'device_screen_width',
                                            'previous_url'
                                        ],
                                        [
                                            'device_timestamp_utc',
                                            'event_collection_platform',
                                            'event_collection_version'
                                        ]
                                    );

                                    expect(model.build.data).to.deep.equal({
                                        'events': [
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-consent'
                                                },
                                                'name': 'custom.specific.event'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-consent'
                                                },
                                                'name': 'custom.all.one'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-consent'
                                                },
                                                'name': 'custom.all.two'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-consent'
                                                },
                                                'name': 'custom.allisgreen'
                                            },
                                            {
                                                'data': {
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-consent'
                                                },
                                                'name': 'click.exit'
                                            },
                                            {
                                                'data': {
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-consent'
                                                },
                                                'name': 'click.navigation'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-consent'
                                                },
                                                'name': 'page.display'
                                            }
                                        ]
                                    });
                                    done();
                                });
                            });
                        });
                    }
                });
        });
        it('Should work properly using no-storage mode', function (done) {
            globalPA.privacy.setMode('no-storage');
            globalPA.privacy.include.properties(
                [
                    'event_collection_*',
                    'customprop1_sub1_deep1',
                    'customprop1_sub2_deep2',
                    'customprop2*',
                    'customprop3_sub1_*',
                    'user_category'
                ],
                null,
                ['page.display', 'click.action', 'custom.*']
            );
            globalPA.privacy.include.events(['custom.specific.event', 'custom.all.*', 'click.exit']);
            globalPA.privacy.include.storageKeys(['pa_user']);
            globalPA.setUser('123', '456789');
            globalPA.sendEvents(testEvents,
                {
                    onBeforeSend: function (PianoAnalytics, model) {
                        globalPA.storage.getItem(globalPA.getConfiguration('storageUser'), function (userDataStored) {
                            globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored) {
                                globalPA.storage.getItem(globalPA.getConfiguration('privacy').storageKey, function (privacyStored) {
                                    expect(userDataStored).to.equal(null);
                                    expect(privacyStored).to.equal(null);
                                    expect(visitorIdStored).to.equal(null);
                                    expect(model.visitorId).to.equal('no-storage');

                                    checkAndForceDynamicPropertiesToStaticTestingValues(
                                        model.build.data.events,
                                        [
                                            'browser_language',
                                            'browser_language_local',
                                            'device_display_height',
                                            'device_display_width',
                                            'device_screen_height',
                                            'device_screen_width',
                                            'previous_url'
                                        ],
                                        [
                                            'device_timestamp_utc',
                                            'device_local_hour',
                                            'device_hour',
                                            'event_collection_platform',
                                            'event_collection_version',
                                        ]
                                    );

                                    expect(model.build.data).to.deep.equal({
                                        'events': [
                                            {
                                                'data': {
                                                    'custom.specific.event': 'custom.specific.event',
                                                    'customprop1_sub1': '11',
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub1_deep2': '112',
                                                    'customprop1_sub2': '12',
                                                    'customprop1_sub2_deep1': '121',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop1_sub3': '13',
                                                    'customprop1_sub3_deep1': '131',
                                                    'customprop1_sub3_deep2': '132',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3': '3',
                                                    'customprop3_sub1': '31',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'customprop3_sub2': '32',
                                                    'customprop3_sub2_deep1': '321',
                                                    'customprop3_sub2_deep2': '322',
                                                    'customprop3andmore1': '3a1',
                                                    'customprop3andmore2': '3a2',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'user_id': '123',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-storage'
                                                },
                                                'name': 'custom.specific.event'
                                            },
                                            {
                                                'data': {
                                                    'custom.all.one': 'custom.all.one',
                                                    'customprop1_sub1': '11',
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub1_deep2': '112',
                                                    'customprop1_sub2': '12',
                                                    'customprop1_sub2_deep1': '121',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop1_sub3': '13',
                                                    'customprop1_sub3_deep1': '131',
                                                    'customprop1_sub3_deep2': '132',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3': '3',
                                                    'customprop3_sub1': '31',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'customprop3_sub2': '32',
                                                    'customprop3_sub2_deep1': '321',
                                                    'customprop3_sub2_deep2': '322',
                                                    'customprop3andmore1': '3a1',
                                                    'customprop3andmore2': '3a2',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'user_id': '123',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-storage'
                                                },
                                                'name': 'custom.all.one'
                                            },
                                            {
                                                'data': {
                                                    'custom.all.two': 'custom.all.two',
                                                    'customprop1_sub1': '11',
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub1_deep2': '112',
                                                    'customprop1_sub2': '12',
                                                    'customprop1_sub2_deep1': '121',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop1_sub3': '13',
                                                    'customprop1_sub3_deep1': '131',
                                                    'customprop1_sub3_deep2': '132',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3': '3',
                                                    'customprop3_sub1': '31',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'customprop3_sub2': '32',
                                                    'customprop3_sub2_deep1': '321',
                                                    'customprop3_sub2_deep2': '322',
                                                    'customprop3andmore1': '3a1',
                                                    'customprop3andmore2': '3a2',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'user_id': '123',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-storage'
                                                },
                                                'name': 'custom.all.two'
                                            },
                                            {
                                                'data': {
                                                    'custom.allisgreen': 'custom.allisgreen',
                                                    'customprop1_sub1': '11',
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub1_deep2': '112',
                                                    'customprop1_sub2': '12',
                                                    'customprop1_sub2_deep1': '121',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop1_sub3': '13',
                                                    'customprop1_sub3_deep1': '131',
                                                    'customprop1_sub3_deep2': '132',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3': '3',
                                                    'customprop3_sub1': '31',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'customprop3_sub2': '32',
                                                    'customprop3_sub2_deep1': '321',
                                                    'customprop3_sub2_deep2': '322',
                                                    'customprop3andmore1': '3a1',
                                                    'customprop3andmore2': '3a2',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'user_id': '123',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-storage'
                                                },
                                                'name': 'custom.allisgreen'
                                            },
                                            {
                                                'data': {
                                                    'click': 'click exit',
                                                    'click_chapter1': 'click chapter 1',
                                                    'click_chapter2': 'click chapter 2',
                                                    'click_chapter3': 'click chapter 3',
                                                    'page': 'page name',
                                                    'page_chapter1': 'chapter 1',
                                                    'page_chapter2': 'chapter 2',
                                                    'page_chapter3': 'chapter 3',
                                                    'customprop1_sub1': '11',
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub1_deep2': '112',
                                                    'customprop1_sub2': '12',
                                                    'customprop1_sub2_deep1': '121',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop1_sub3': '13',
                                                    'customprop1_sub3_deep1': '131',
                                                    'customprop1_sub3_deep2': '132',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3': '3',
                                                    'customprop3_sub1': '31',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'customprop3_sub2': '32',
                                                    'customprop3_sub2_deep1': '321',
                                                    'customprop3_sub2_deep2': '322',
                                                    'customprop3andmore1': '3a1',
                                                    'customprop3andmore2': '3a2',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'user_id': '123',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-storage'
                                                },
                                                'name': 'click.exit'
                                            },
                                            {
                                                'data': {
                                                    'click': 'click navigation',
                                                    'click_chapter1': 'click chapter 1',
                                                    'click_chapter2': 'click chapter 2',
                                                    'click_chapter3': 'click chapter 3',
                                                    'customprop1_sub1': '11',
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub1_deep2': '112',
                                                    'customprop1_sub2': '12',
                                                    'customprop1_sub2_deep1': '121',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop1_sub3': '13',
                                                    'customprop1_sub3_deep1': '131',
                                                    'customprop1_sub3_deep2': '132',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3': '3',
                                                    'customprop3_sub1': '31',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'customprop3_sub2': '32',
                                                    'customprop3_sub2_deep1': '321',
                                                    'customprop3_sub2_deep2': '322',
                                                    'customprop3andmore1': '3a1',
                                                    'customprop3andmore2': '3a2',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'page': 'page name',
                                                    'page_chapter1': 'chapter 1',
                                                    'page_chapter2': 'chapter 2',
                                                    'page_chapter3': 'chapter 3',
                                                    'user_category': '456789',
                                                    'user_id': '123',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-storage'
                                                },
                                                'name': 'click.navigation'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1': '11',
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub1_deep2': '112',
                                                    'customprop1_sub2': '12',
                                                    'customprop1_sub2_deep1': '121',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop1_sub3': '13',
                                                    'customprop1_sub3_deep1': '131',
                                                    'customprop1_sub3_deep2': '132',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3': '3',
                                                    'customprop3_sub1': '31',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'customprop3_sub2': '32',
                                                    'customprop3_sub2_deep1': '321',
                                                    'customprop3_sub2_deep2': '322',
                                                    'customprop3andmore1': '3a1',
                                                    'customprop3andmore2': '3a2',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'page': 'page name',
                                                    'page_chapter1': 'chapter 1',
                                                    'page_chapter2': 'chapter 2',
                                                    'page_chapter3': 'chapter 3',
                                                    'user_category': '456789',
                                                    'user_id': '123',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-storage'
                                                },
                                                'name': 'page.display'
                                            }
                                        ]
                                    });
                                    done();
                                });
                            });
                        });
                    }
                });
        });
        it('Should work properly using exempt mode', function (done) {
            globalPA.privacy.setMode('exempt');
            globalPA.privacy.include.properties(
                [
                    'event_collection_*',
                    'customprop1_sub1_deep1',
                    'customprop1_sub2_deep2',
                    'customprop2*',
                    'customprop3_sub1_*',
                    'user_category'
                ],
                null,
                ['page.display', 'click.action', 'custom.*']
            );
            globalPA.privacy.include.events(['custom.specific.event', 'custom.all.*', 'click.exit']);
            globalPA.privacy.include.storageKeys(['pa_user']);
            globalPA.setUser('123', '456789');
            globalPA.sendEvents(testEvents,
                {
                    onBeforeSend: function (PianoAnalytics, model) {
                        globalPA.storage.getItem(globalPA.getConfiguration('storageUser'), function (userDataStored) {
                            globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored) {
                                globalPA.storage.getItem(globalPA.getConfiguration('privacy').storageKey, function (privacyStored) {
                                    expect(userDataStored).to.deep.equal({id: '123', category: '456789'});
                                    expect(privacyStored).to.equal('exempt');
                                    expect(regexUUID.test(visitorIdStored)).to.equal(true);
                                    expect(visitorIdStored).to.equal(model.visitorId);

                                    checkAndForceDynamicPropertiesToStaticTestingValues(
                                        model.build.data.events,
                                        [
                                            'browser_language',
                                            'browser_language_local',
                                            'device_display_height',
                                            'device_display_width',
                                            'device_screen_height',
                                            'device_screen_width',
                                            'previous_url'
                                        ],
                                        [
                                            'device_timestamp_utc',
                                            'event_collection_platform',
                                            'event_collection_version'
                                        ]
                                    );
                                    expect(model.build.data).to.deep.equal({
                                        'events': [
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'exempt'
                                                },
                                                'name': 'custom.specific.event'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'exempt'
                                                },
                                                'name': 'custom.all.one'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'exempt'
                                                },
                                                'name': 'custom.all.two'
                                            },
                                            {
                                                'data': {
                                                    'click': 'click exit',
                                                    'click_chapter1': 'click chapter 1',
                                                    'click_chapter2': 'click chapter 2',
                                                    'click_chapter3': 'click chapter 3',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'page': 'page name',
                                                    'page_chapter1': 'chapter 1',
                                                    'page_chapter2': 'chapter 2',
                                                    'page_chapter3': 'chapter 3',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'exempt'
                                                },
                                                'name': 'click.exit'
                                            },
                                            {
                                                'data': {
                                                    'click': 'click navigation',
                                                    'click_chapter1': 'click chapter 1',
                                                    'click_chapter2': 'click chapter 2',
                                                    'click_chapter3': 'click chapter 3',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'page': 'page name',
                                                    'page_chapter1': 'chapter 1',
                                                    'page_chapter2': 'chapter 2',
                                                    'page_chapter3': 'chapter 3',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'exempt'
                                                },
                                                'name': 'click.navigation'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'page': 'page name',
                                                    'page_chapter1': 'chapter 1',
                                                    'page_chapter2': 'chapter 2',
                                                    'page_chapter3': 'chapter 3',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'exempt'
                                                },
                                                'name': 'page.display'
                                            }
                                        ]
                                    });
                                    done();
                                });
                            });
                        });
                    }
                });
        });
        it('Should work properly using a custom mode', function (done) {
            globalPA.privacy.createMode('mytestingMode', true);
            globalPA.privacy.setMode('mytestingMode');
            globalPA.privacy.include.properties(
                [
                    'event_collection_*',
                    'customprop1_sub1_deep1',
                    'customprop1_sub2_deep2',
                    'customprop2*',
                    'customprop3_sub1_*',
                    'user_category'
                ],
                null,
                ['page.display', 'click.action', 'custom.*']
            );
            globalPA.privacy.include.events(['custom.specific.event', 'custom.all.*', 'click.exit']);
            globalPA.privacy.include.storageKeys(['pa_user']);
            globalPA.setUser('123', '456789');
            globalPA.sendEvents(testEvents,
                {
                    onBeforeSend: function (PianoAnalytics, model) {
                        globalPA.storage.getItem(globalPA.getConfiguration('storageUser'), function (userDataStored) {
                            globalPA.storage.getItem(globalPA.getConfiguration('storageVisitor'), function (visitorIdStored) {
                                globalPA.storage.getItem(globalPA.getConfiguration('privacy').storageKey, function (privacyStored) {
                                    expect(userDataStored).to.deep.equal({id: '123', category: '456789'});
                                    expect(privacyStored).to.equal('mytestingMode');
                                    expect(regexUUID.test(visitorIdStored)).to.equal(true);
                                    expect(visitorIdStored).to.equal(model.visitorId);

                                    checkAndForceDynamicPropertiesToStaticTestingValues(
                                        model.build.data.events,
                                        [
                                            'browser_language',
                                            'browser_language_local',
                                            'device_display_height',
                                            'device_display_width',
                                            'device_screen_height',
                                            'device_screen_width',
                                            'previous_url'
                                        ],
                                        [
                                            'device_timestamp_utc',
                                            'event_collection_platform',
                                            'event_collection_version'
                                        ]
                                    );

                                    expect(model.build.data).to.deep.equal({
                                        'events': [
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'mytestingMode'
                                                },
                                                'name': 'custom.specific.event'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'mytestingMode'
                                                },
                                                'name': 'custom.all.one'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'mytestingMode'
                                                },
                                                'name': 'custom.all.two'
                                            },
                                            {
                                                'data': {
                                                    'click': 'click exit',
                                                    'click_chapter1': 'click chapter 1',
                                                    'click_chapter2': 'click chapter 2',
                                                    'click_chapter3': 'click chapter 3',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'page': 'page name',
                                                    'page_chapter1': 'chapter 1',
                                                    'page_chapter2': 'chapter 2',
                                                    'page_chapter3': 'chapter 3',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'mytestingMode'
                                                },
                                                'name': 'click.exit'
                                            },
                                            {
                                                'data': {
                                                    'click': 'click navigation',
                                                    'click_chapter1': 'click chapter 1',
                                                    'click_chapter2': 'click chapter 2',
                                                    'click_chapter3': 'click chapter 3',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'page': 'page name',
                                                    'page_chapter1': 'chapter 1',
                                                    'page_chapter2': 'chapter 2',
                                                    'page_chapter3': 'chapter 3',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'mytestingMode'
                                                },
                                                'name': 'click.navigation'
                                            },
                                            {
                                                'data': {
                                                    'customprop1_sub1_deep1': '111',
                                                    'customprop1_sub2_deep2': '122',
                                                    'customprop2_sub1': '21',
                                                    'customprop2_sub1_deep1': '211',
                                                    'customprop2_sub1_deep2': '212',
                                                    'customprop2_sub2': '22',
                                                    'customprop2_sub2_deep1': '221',
                                                    'customprop2_sub2_deep2': '222',
                                                    'customprop2andmore1': '2a1',
                                                    'customprop2andmore1_sub1': '2a1',
                                                    'customprop2andmore1_sub2': '2a2',
                                                    'customprop2andmore2': '2a2',
                                                    'customprop3_sub1_deep1': '311',
                                                    'customprop3_sub1_deep2': '312',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'page': 'page name',
                                                    'page_chapter1': 'chapter 1',
                                                    'page_chapter2': 'chapter 2',
                                                    'page_chapter3': 'chapter 3',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'mytestingMode'
                                                },
                                                'name': 'page.display'
                                            }
                                        ]
                                    });
                                    done();
                                });
                            });
                        });
                    }
                });
        });
    });
    describe('mode management :', function () {
        let optinModeValue = {
            'events': {
                'forbidden': {},
                'allowed': {
                    '*': true
                }
            },
            'name': 'optin',
            'properties': {
                'forbidden': {
                    '*': {}
                },
                'include': {
                    'visitor_privacy_consent': true,
                    'visitor_privacy_mode': 'optin'
                },
                'allowed': {
                    '*': {
                        '*': true
                    }
                }
            },
            'storage': {
                'forbidden': {},
                'allowed': {
                    '*': true
                }
            }
        };
        let optoutModeValue = {
            'events': {
                'forbidden': {},
                'allowed': {
                    '*': true
                }
            },
            'name': 'optout',
            'properties': {
                'forbidden': {
                    '*': {}
                },
                'include': {
                    'visitor_privacy_consent': false,
                    'visitor_privacy_mode': 'optout'
                },
                'allowed': {
                    '*': {}
                }
            },
            'storage': {
                'forbidden': {},
                'allowed': {
                    'pa_vid': true,
                    'pa_privacy': true
                }
            },
            'visitorId': 'OPT-OUT'
        };
        let noConsentModeValue = {
            'events': {
                'forbidden': {},
                'allowed': {
                    '*': true
                }
            },
            'name': 'no-consent',
            'properties': {
                'forbidden': {
                    '*': {}
                },
                'include': {
                    'visitor_privacy_consent': false,
                    'visitor_privacy_mode': 'no-consent'
                },
                'allowed': {
                    '*': {}
                }
            },
            'storage': {
                'forbidden': {
                    '*': true
                },
                'allowed': {}
            },
            'visitorId': 'no-consent'
        };
        let noStorageModeValue = {
            'events': {
                'forbidden': {},
                'allowed': {
                    '*': true
                }
            },
            'name': 'no-storage',
            'properties': {
                'forbidden': {
                    '*': {}
                },
                'include': {
                    'visitor_privacy_consent': false,
                    'visitor_privacy_mode': 'no-storage'
                },
                'allowed': {
                    '*': {
                        '*': true
                    }
                }
            },
            'storage': {
                'forbidden': {
                    '*': true
                },
                'allowed': {}
            },
            'visitorId': 'no-storage'
        };
        let exemptModeValue = {
            'events': {
                'forbidden': {},
                'allowed': {
                    'click.action': true,
                    'click.download': true,
                    'click.exit': true,
                    'click.navigation': true,
                    'page.display': true
                }
            },
            'name': 'exempt',
            'properties': {
                'forbidden': {
                    '*': {}
                },
                'include': {
                    'visitor_privacy_consent': false,
                    'visitor_privacy_mode': 'exempt'
                },
                'allowed': {
                    '*': {
                        'app_crash': true,
                        'app_crash_class': true,
                        'app_crash_screen': true,
                        'app_version': true,
                        'browser': true,
                        'browser_cookie_acceptance': true,
                        'browser_group': true,
                        'browser_version': true,
                        'click': true,
                        'click_chapter1': true,
                        'click_chapter2': true,
                        'click_chapter3': true,
                        'click_full_name': true,
                        'connection_monitor': true,
                        'connection_organisation': true,
                        'date': true,
                        'date_day': true,
                        'date_daynumber': true,
                        'date_month': true,
                        'date_monthnumber': true,
                        'date_week': true,
                        'date_year': true,
                        'date_yearofweek': true,
                        'device_brand': true,
                        'device_display_height': true,
                        'device_display_width': true,
                        'device_name': true,
                        'device_name_tech': true,
                        'device_screen_diagonal': true,
                        'device_screen_height': true,
                        'device_screen_width': true,
                        'device_type': true,
                        'event_collection_platform': true,
                        'event_collection_version': true,
                        'event_hour': true,
                        'event_id': true,
                        'event_minute': true,
                        'event_position': true,
                        'event_second': true,
                        'event_time': true,
                        'event_time_utc': true,
                        'event_url': true,
                        'event_url_domain': true,
                        'event_url_full': true,
                        'exclusion_cause': true,
                        'exclusion_type': true,
                        'geo_city': true,
                        'geo_continent': true,
                        'geo_country': true,
                        'geo_metro': true,
                        'geo_region': true,
                        'goal_type': true,
                        'hit_time_utc': true,
                        'os': true,
                        'os_group': true,
                        'os_version': true,
                        'os_version_name': true,
                        'page': true,
                        'page_chapter1': true,
                        'page_chapter2': true,
                        'page_chapter3': true,
                        'page_duration': true,
                        'page_full_name': true,
                        'page_position': true,
                        'page_title_html': true,
                        'pageview_id': true,
                        'previous_url': true,
                        'privacy_status': true,
                        'site': true,
                        'site_env': true,
                        'site_id': true,
                        'site_platform': true,
                        'src': true,
                        'src_detail': true,
                        'src_direct_access': true,
                        'src_organic': true,
                        'src_organic_detail': true,
                        'src_portal_domain': true,
                        'src_portal_site': true,
                        'src_portal_site_id': true,
                        'src_portal_url': true,
                        'src_referrer_site_domain': true,
                        'src_referrer_site_url': true,
                        'src_referrer_url': true,
                        'src_se': true,
                        'src_se_category': true,
                        'src_se_country': true,
                        'src_type': true,
                        'src_url': true,
                        'src_url_domain': true,
                        'src_webmail': true
                    }
                }
            },
            'storage': {
                'forbidden': {},
                'allowed': {
                    'pa_privacy': true,
                    'pa_vid': true,
                    'atuserid': true
                }
            }
        };
        describe('initialization :', function () {
            it('Should be in optin mode by default', function () {
                expect(globalPA.privacy.getMode()).to.equal('optin');
                expect(globalPA.privacy.modes['optin']).to.deep.equal(optinModeValue);
                expect(globalPA.getVisitorId()).to.equal(null);
            });
            it('Should initialize with optin mode when present in storage', function () {
                globalPA.storage.setItem(config.privacy.storageKey, 'optin', null, function () {
                    let tempConfig = Utility.cloneObject(config);
                    tempConfig.privacyDefaultMode = 'exempt'; // so we are sure the mode comes from storage and not from the configuration
                    let tempPA = new pa.PA(tempConfig);
                    expect(tempPA.privacy.getMode()).to.equal('optin');
                    expect(tempPA.privacy.modes['optin']).to.deep.equal(optinModeValue);
                    expect(tempPA.getVisitorId()).to.equal(null);
                });
            });
            it('Should initialize with optout mode when present in storage', function () {
                globalPA.storage.setItem(config.privacy.storageKey, 'optout', null, function () {
                    let tempPA = new pa.PA(config);
                    expect(tempPA.privacy.getMode()).to.equal('optout');
                    expect(tempPA.privacy.modes['optout']).to.deep.equal(optoutModeValue);
                    expect(tempPA.getVisitorId()).to.equal('OPT-OUT');
                });
            });
            it('Should initialize with no-consent mode when present in storage', function () {
                globalPA.storage.setItem(config.privacy.storageKey, 'no-consent', null, function () {
                    let tempPA = new pa.PA(config);
                    expect(tempPA.privacy.getMode()).to.equal('no-consent');
                    expect(tempPA.privacy.modes['no-consent']).to.deep.equal(noConsentModeValue);
                    expect(tempPA.getVisitorId()).to.equal('no-consent');
                });
            });
            it('Should initialize with no-storage mode when present in storage', function (done) {
                globalPA.storage.setItem(config.privacy.storageKey, 'no-storage', null, function () {
                    let tempPA = new pa.PA(config);
                    expect(tempPA.privacy.getMode()).to.equal('no-storage');
                    expect(tempPA.privacy.modes['no-storage']).to.deep.equal(noStorageModeValue);
                    expect(tempPA.getVisitorId()).to.equal('no-storage');
                    done();
                });
            });
            it('Should initialize with exempt mode when present in storage', function () {
                globalPA.storage.setItem(config.privacy.storageKey, 'exempt', null, function () {
                    let tempPA = new pa.PA(config);
                    expect(tempPA.privacy.getMode()).to.equal('exempt');
                    expect(tempPA.privacy.modes['exempt']).to.deep.equal(exemptModeValue);
                    expect(tempPA.getVisitorId()).to.equal(null);
                });
            });
            it('Should initialize with custom mode when present in storage and config', function () {
                let testModeValue = Utility.cloneObject(exemptModeValue);
                testModeValue.name = 'testMode';
                testModeValue.properties.include['visitor_privacy_mode'] = 'testMode';
                testModeValue.properties.include['visitor_privacy_consent'] = true;
                let tempConfig = Utility.cloneObject(config);
                tempConfig.privacy.modes['testMode'] = testModeValue;
                globalPA.storage.setItem(tempConfig.privacy.storageKey, 'testMode', null, function () {
                    let tempPA = new pa.PA(tempConfig);
                    expect(tempPA.privacy.getMode()).to.equal('testMode');
                    expect(tempPA.privacy.modes['testMode']).to.deep.equal(testModeValue);
                    expect(tempPA.getVisitorId()).to.equal(null);
                });
            });
            it('Should not initialize with an unknown mode when present in storage but not in config (fallback optin)', function () {
                globalPA.storage.setItem(config.privacy.storageKey, 'testMode', null, function () {
                    let tempPA = new pa.PA(config);
                    expect(tempPA.privacy.getMode()).to.equal(config.privacyDefaultMode);
                    expect(tempPA.getVisitorId()).to.equal(null);
                });
            });
        });
        describe('mode switching :', function () {
            describe('to optin ', function () {
                it('optin -> optin', function (done) {
                    expect(globalPA.privacy.getMode()).to.equal('optin');
                    expect(globalPA.getVisitorId()).to.equal(null);
                    globalPA.storage.getItem(config.privacy.storageKey, function (original) {
                        expect(original).to.equal('optin');
                        globalPA.privacy.setMode('optin');
                        expect(globalPA.privacy.getMode()).to.equal('optin');
                        expect(globalPA.getVisitorId()).to.equal(null);
                        globalPA.storage.getItem(config.privacy.storageKey, function (data) {
                            expect(data).to.equal('optin');
                            done();
                        });
                    });
                });
                it('optout -> optin', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'optout', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('optout');
                        expect(tempPA.getVisitorId()).to.equal('OPT-OUT');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('optout');
                            tempPA.privacy.setMode('optin');
                            expect(tempPA.privacy.getMode()).to.equal('optin');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('optin');
                                done();
                            });
                        });
                    });
                });
                it('no-consent -> optin', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'no-consent', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('no-consent');
                        expect(tempPA.getVisitorId()).to.equal('no-consent');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.setMode('optin');
                            expect(tempPA.privacy.getMode()).to.equal('optin');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('optin');
                                done();
                            });
                        });
                    });
                });
                it('no-storage -> optin', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'no-storage', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('no-storage');
                        expect(tempPA.getVisitorId()).to.equal('no-storage');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.setMode('optin');
                            expect(tempPA.privacy.getMode()).to.equal('optin');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('optin');
                                done();
                            });
                        });
                    });
                });
                it('exempt -> optin', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'exempt', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('exempt');
                        expect(tempPA.getVisitorId()).to.equal(null);
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('exempt');
                            tempPA.privacy.setMode('optin');
                            expect(tempPA.privacy.getMode()).to.equal('optin');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('optin');
                                done();
                            });
                        });
                    });
                });
                it('custom -> optin', function (done) {
                    let testModeValue = Utility.cloneObject(exemptModeValue);
                    testModeValue.name = 'testMode';
                    testModeValue.properties.include['visitor_privacy_mode'] = 'testMode';
                    testModeValue.properties.include['visitor_privacy_consent'] = true;
                    let tempConfig = Utility.cloneObject(config);
                    tempConfig.privacy.modes['testMode'] = testModeValue;
                    globalPA.storage.setItem(tempConfig.privacy.storageKey, 'testMode', null, function () {
                        let tempPA = new pa.PA(tempConfig);
                        expect(tempPA.privacy.getMode()).to.equal('testMode');
                        expect(tempPA.getVisitorId()).to.equal(null);
                        tempPA.storage.getItem(tempConfig.privacy.storageKey, function (original) {
                            expect(original).to.equal('testMode');
                            tempPA.privacy.setMode('optin');
                            expect(tempPA.privacy.getMode()).to.equal('optin');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(tempConfig.privacy.storageKey, function (data) {
                                expect(data).to.equal('optin');
                                done();
                            });
                        });
                    });
                });
            });
            describe('to optout :', function () {
                it('optin -> optout', function (done) {
                    expect(globalPA.privacy.getMode()).to.equal('optin');
                    expect(globalPA.getVisitorId()).to.equal(null);
                    globalPA.storage.getItem(config.privacy.storageKey, function (original) {
                        expect(original).to.equal('optin');
                        globalPA.privacy.setMode('optout');
                        expect(globalPA.privacy.getMode()).to.equal('optout');
                        expect(globalPA.getVisitorId()).to.equal('OPT-OUT');
                        globalPA.storage.getItem(config.privacy.storageKey, function (data) {
                            expect(data).to.equal('optout');
                            done();
                        });
                    });
                });
                it('optout -> optout', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'optout', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('optout');
                        expect(tempPA.getVisitorId()).to.equal('OPT-OUT');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('optout');
                            tempPA.privacy.setMode('optout');
                            expect(tempPA.privacy.getMode()).to.equal('optout');
                            expect(tempPA.getVisitorId()).to.equal('OPT-OUT');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('optout');
                                done();
                            });
                        });
                    });
                });
                it('no-consent -> optout', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'no-consent', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('no-consent');
                        expect(tempPA.getVisitorId()).to.equal('no-consent');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.setMode('optout');
                            expect(tempPA.privacy.getMode()).to.equal('optout');
                            expect(tempPA.getVisitorId()).to.equal('OPT-OUT');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('optout');
                                done();
                            });
                        });
                    });
                });
                it('no-storage -> optout', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'no-storage', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('no-storage');
                        expect(tempPA.getVisitorId()).to.equal('no-storage');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.setMode('optout');
                            expect(tempPA.privacy.getMode()).to.equal('optout');
                            expect(tempPA.getVisitorId()).to.equal('OPT-OUT');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('optout');
                                done();
                            });
                        });
                    });
                });
                it('exempt -> optout', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'exempt', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('exempt');
                        expect(tempPA.getVisitorId()).to.equal(null);
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('exempt');
                            tempPA.privacy.setMode('optout');
                            expect(tempPA.privacy.getMode()).to.equal('optout');
                            expect(tempPA.getVisitorId()).to.equal('OPT-OUT');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('optout');
                                done();
                            });
                        });
                    });
                });
                it('custom -> optout', function (done) {
                    let testModeValue = Utility.cloneObject(exemptModeValue);
                    testModeValue.name = 'testMode';
                    testModeValue.properties.include['visitor_privacy_mode'] = 'testMode';
                    testModeValue.properties.include['visitor_privacy_consent'] = true;
                    let tempConfig = Utility.cloneObject(config);
                    tempConfig.privacy.modes['testMode'] = testModeValue;
                    globalPA.storage.setItem(tempConfig.privacy.storageKey, 'testMode', null, function () {
                        let tempPA = new pa.PA(tempConfig);
                        expect(tempPA.privacy.getMode()).to.equal('testMode');
                        expect(tempPA.getVisitorId()).to.equal(null);
                        tempPA.storage.getItem(tempConfig.privacy.storageKey, function (original) {
                            expect(original).to.equal('testMode');
                            tempPA.privacy.setMode('optout');
                            expect(tempPA.privacy.getMode()).to.equal('optout');
                            expect(tempPA.getVisitorId()).to.equal('OPT-OUT');
                            tempPA.storage.getItem(tempConfig.privacy.storageKey, function (data) {
                                expect(data).to.equal('optout');
                                done();
                            });
                        });
                    });
                });
            });
            describe('to no-consent :', function () {
                it('optin -> no-consent', function (done) {
                    expect(globalPA.privacy.getMode()).to.equal('optin');
                    expect(globalPA.getVisitorId()).to.equal(null);
                    globalPA.storage.getItem(config.privacy.storageKey, function (original) {
                        expect(original).to.equal('optin');
                        globalPA.privacy.setMode('no-consent');
                        expect(globalPA.privacy.getMode()).to.equal('no-consent');
                        expect(globalPA.getVisitorId()).to.equal('no-consent');
                        globalPA.storage.getItem(config.privacy.storageKey, function (data) {
                            expect(data).to.equal(null);
                            done();
                        });
                    });
                });
                it('optout -> no-consent', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'optout', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('optout');
                        expect(tempPA.getVisitorId()).to.equal('OPT-OUT');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('optout');
                            tempPA.privacy.setMode('no-consent');
                            expect(tempPA.privacy.getMode()).to.equal('no-consent');
                            expect(tempPA.getVisitorId()).to.equal('no-consent');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('no-consent -> no-consent', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'no-consent', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('no-consent');
                        expect(tempPA.getVisitorId()).to.equal('no-consent');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.setMode('no-consent');
                            expect(tempPA.privacy.getMode()).to.equal('no-consent');
                            expect(tempPA.getVisitorId()).to.equal('no-consent');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('no-storage -> no-consent', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'no-storage', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('no-storage');
                        expect(tempPA.getVisitorId()).to.equal('no-storage');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.setMode('no-consent');
                            expect(tempPA.privacy.getMode()).to.equal('no-consent');
                            expect(tempPA.getVisitorId()).to.equal('no-consent');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('exempt -> no-consent', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'exempt', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('exempt');
                        expect(tempPA.getVisitorId()).to.equal(null);
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('exempt');
                            tempPA.privacy.setMode('no-consent');
                            expect(tempPA.privacy.getMode()).to.equal('no-consent');
                            expect(tempPA.getVisitorId()).to.equal('no-consent');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('custom -> no-consent', function (done) {
                    let testModeValue = Utility.cloneObject(exemptModeValue);
                    testModeValue.name = 'testMode';
                    testModeValue.properties.include['visitor_privacy_mode'] = 'testMode';
                    testModeValue.properties.include['visitor_privacy_consent'] = true;
                    let tempConfig = Utility.cloneObject(config);
                    tempConfig.privacy.modes['testMode'] = testModeValue;
                    globalPA.storage.setItem(tempConfig.privacy.storageKey, 'testMode', null, function () {
                        let tempPA = new pa.PA(tempConfig);
                        expect(tempPA.privacy.getMode()).to.equal('testMode');
                        expect(tempPA.getVisitorId()).to.equal(null);
                        tempPA.storage.getItem(tempConfig.privacy.storageKey, function (original) {
                            expect(original).to.equal('testMode');
                            tempPA.privacy.setMode('no-consent');
                            expect(tempPA.privacy.getMode()).to.equal('no-consent');
                            expect(tempPA.getVisitorId()).to.equal('no-consent');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
            });
            describe('to no-storage :', function () {
                it('optin -> no-storage', function (done) {
                    expect(globalPA.privacy.getMode()).to.equal('optin');
                    expect(globalPA.getVisitorId()).to.equal(null);
                    globalPA.storage.getItem(config.privacy.storageKey, function (original) {
                        expect(original).to.equal('optin');
                        globalPA.privacy.setMode('no-storage');
                        expect(globalPA.privacy.getMode()).to.equal('no-storage');
                        expect(globalPA.getVisitorId()).to.equal('no-storage');
                        globalPA.storage.getItem(config.privacy.storageKey, function (data) {
                            expect(data).to.equal(null);
                            done();
                        });
                    });
                });
                it('optout -> no-storage', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'optout', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('optout');
                        expect(tempPA.getVisitorId()).to.equal('OPT-OUT');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('optout');
                            tempPA.privacy.setMode('no-storage');
                            expect(tempPA.privacy.getMode()).to.equal('no-storage');
                            expect(tempPA.getVisitorId()).to.equal('no-storage');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('no-consent -> no-storage', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'no-consent', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('no-consent');
                        expect(tempPA.getVisitorId()).to.equal('no-consent');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.setMode('no-storage');
                            expect(tempPA.privacy.getMode()).to.equal('no-storage');
                            expect(tempPA.getVisitorId()).to.equal('no-storage');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('no-storage -> no-storage', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'no-storage', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('no-storage');
                        expect(tempPA.getVisitorId()).to.equal('no-storage');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.setMode('no-storage');
                            expect(tempPA.privacy.getMode()).to.equal('no-storage');
                            expect(tempPA.getVisitorId()).to.equal('no-storage');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('exempt -> no-storage', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'exempt', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('exempt');
                        expect(tempPA.getVisitorId()).to.equal(null);
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('exempt');
                            tempPA.privacy.setMode('no-storage');
                            expect(tempPA.privacy.getMode()).to.equal('no-storage');
                            expect(tempPA.getVisitorId()).to.equal('no-storage');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('custom -> no-storage', function (done) {
                    let testModeValue = Utility.cloneObject(exemptModeValue);
                    testModeValue.name = 'testMode';
                    testModeValue.properties.include['visitor_privacy_mode'] = 'testMode';
                    testModeValue.properties.include['visitor_privacy_consent'] = true;
                    let tempConfig = Utility.cloneObject(config);
                    tempConfig.privacy.modes['testMode'] = testModeValue;
                    globalPA.storage.setItem(tempConfig.privacy.storageKey, 'testMode', null, function () {
                        let tempPA = new pa.PA(tempConfig);
                        expect(tempPA.privacy.getMode()).to.equal('testMode');
                        expect(tempPA.getVisitorId()).to.equal(null);
                        tempPA.storage.getItem(tempConfig.privacy.storageKey, function (original) {
                            expect(original).to.equal('testMode');
                            tempPA.privacy.setMode('no-storage');
                            expect(tempPA.privacy.getMode()).to.equal('no-storage');
                            expect(tempPA.getVisitorId()).to.equal('no-storage');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
            });
            describe('to exempt :', function () {
                it('optin -> exempt', function (done) {
                    expect(globalPA.privacy.getMode()).to.equal('optin');
                    expect(globalPA.getVisitorId()).to.equal(null);
                    globalPA.storage.getItem(config.privacy.storageKey, function (original) {
                        expect(original).to.equal('optin');
                        globalPA.privacy.setMode('exempt');
                        expect(globalPA.privacy.getMode()).to.equal('exempt');
                        expect(globalPA.getVisitorId()).to.equal(null);
                        globalPA.storage.getItem(config.privacy.storageKey, function (data) {
                            expect(data).to.equal('exempt');
                            done();
                        });
                    });
                });
                it('optout -> exempt', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'optout', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('optout');
                        expect(tempPA.getVisitorId()).to.equal('OPT-OUT');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('optout');
                            tempPA.privacy.setMode('exempt');
                            expect(tempPA.privacy.getMode()).to.equal('exempt');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('exempt');
                                done();
                            });
                        });
                    });
                });
                it('no-consent -> exempt', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'no-consent', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('no-consent');
                        expect(tempPA.getVisitorId()).to.equal('no-consent');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.setMode('exempt');
                            expect(tempPA.privacy.getMode()).to.equal('exempt');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('exempt');
                                done();
                            });
                        });
                    });
                });
                it('no-storage -> exempt', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'no-storage', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('no-storage');
                        expect(tempPA.getVisitorId()).to.equal('no-storage');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.setMode('exempt');
                            expect(tempPA.privacy.getMode()).to.equal('exempt');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('exempt');
                                done();
                            });
                        });
                    });
                });
                it('exempt -> exempt', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'exempt', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('exempt');
                        expect(tempPA.getVisitorId()).to.equal(null);
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('exempt');
                            tempPA.privacy.setMode('exempt');
                            expect(tempPA.privacy.getMode()).to.equal('exempt');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('exempt');
                                done();
                            });
                        });
                    });
                });
                it('custom -> exempt', function (done) {
                    let testModeValue = Utility.cloneObject(exemptModeValue);
                    testModeValue.name = 'testMode';
                    testModeValue.properties.include['visitor_privacy_mode'] = 'testMode';
                    testModeValue.properties.include['visitor_privacy_consent'] = true;
                    let tempConfig = Utility.cloneObject(config);
                    tempConfig.privacy.modes['testMode'] = testModeValue;
                    globalPA.storage.setItem(tempConfig.privacy.storageKey, 'testMode', null, function () {
                        let tempPA = new pa.PA(tempConfig);
                        expect(tempPA.privacy.getMode()).to.equal('testMode');
                        expect(tempPA.getVisitorId()).to.equal(null);
                        tempPA.storage.getItem(tempConfig.privacy.storageKey, function (original) {
                            expect(original).to.equal('testMode');
                            tempPA.privacy.setMode('exempt');
                            expect(tempPA.privacy.getMode()).to.equal('exempt');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('exempt');
                                done();
                            });
                        });
                    });
                });
            });
            describe('to custom :', function () {
                it('optin -> custom', function (done) {
                    expect(globalPA.privacy.getMode()).to.equal('optin');
                    globalPA.privacy.createMode('myMode', true);
                    globalPA.privacy.setMode('myMode');
                    expect(globalPA.privacy.getMode()).to.equal('myMode');
                    expect(globalPA.getVisitorId()).to.equal(null);
                    globalPA.storage.getItem(config.privacy.storageKey, function (data) {
                        expect(data).to.equal('myMode');
                        done();
                    });
                });
                it('optout -> custom', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'optout', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('optout');
                        expect(tempPA.getVisitorId()).to.equal('OPT-OUT');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('optout');
                            tempPA.privacy.createMode('testMode', true);
                            tempPA.privacy.setMode('testMode');
                            expect(tempPA.privacy.getMode()).to.equal('testMode');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('testMode');
                                done();
                            });
                        });
                    });
                });
                it('no-consent -> custom', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'no-consent', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('no-consent');
                        expect(tempPA.getVisitorId()).to.equal('no-consent');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.createMode('testMode', false);
                            tempPA.privacy.setMode('testMode');
                            expect(tempPA.privacy.getMode()).to.equal('testMode');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('testMode');
                                done();
                            });
                        });
                    });
                });
                it('no-storage -> custom', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'no-storage', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('no-storage');
                        expect(tempPA.getVisitorId()).to.equal('no-storage');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.createMode('testMode', true);
                            tempPA.privacy.setMode('testMode');
                            expect(tempPA.privacy.getMode()).to.equal('testMode');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('testMode');
                                done();
                            });
                        });
                    });
                });
                it('exempt -> custom', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'exempt', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('exempt');
                        expect(tempPA.getVisitorId()).to.equal(null);
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('exempt');
                            tempPA.privacy.createMode('testMode', false);
                            tempPA.privacy.setMode('testMode');
                            expect(tempPA.privacy.getMode()).to.equal('testMode');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('testMode');
                                done();
                            });
                        });
                    });
                });
                it('custom -> custom', function (done) {
                    let testModeValue = Utility.cloneObject(exemptModeValue);
                    testModeValue.name = 'testMode';
                    testModeValue.properties.include['visitor_privacy_mode'] = 'testMode';
                    testModeValue.properties.include['visitor_privacy_consent'] = true;
                    let tempConfig = Utility.cloneObject(config);
                    tempConfig.privacy.modes['testMode'] = testModeValue;
                    globalPA.storage.setItem(tempConfig.privacy.storageKey, 'testMode', null, function () {
                        let tempPA = new pa.PA(tempConfig);
                        expect(tempPA.privacy.getMode()).to.equal('testMode');
                        expect(tempPA.getVisitorId()).to.equal(null);
                        tempPA.storage.getItem(tempConfig.privacy.storageKey, function (original) {
                            expect(original).to.equal('testMode');
                            tempPA.privacy.createMode('anotherMode', false);
                            tempPA.privacy.setMode('anotherMode');
                            expect(tempPA.privacy.getMode()).to.equal('anotherMode');
                            expect(tempPA.getVisitorId()).to.equal(null);
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal('anotherMode');
                                done();
                            });
                        });
                    });
                });
            });
            it('Should do nothing when switching to an unknown mode', function (done) {
                const tempConfig = Utility.cloneObject(config);
                const tempPA = new pa.PA(tempConfig);
                expect(tempPA.privacy.getMode()).to.equal('optin');
                expect(tempPA.getVisitorId()).to.equal(null);
                tempPA.storage.getItem(tempConfig.privacy.storageKey, function (original) {
                    expect(original).to.equal('optin');
                    tempPA.privacy.setMode('anotherMode');
                    expect(tempPA.privacy.getMode()).to.equal('optin');
                    expect(tempPA.getVisitorId()).to.equal(null);
                    tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                        expect(data).to.equal('optin');
                        done();
                    });
                });
            });
        });
        describe('createMode :', function () {
            let testModeValue = Utility.cloneObject(exemptModeValue);
            testModeValue.name = 'testMode';
            testModeValue.properties.include['visitor_privacy_mode'] = 'testMode';
            testModeValue.properties.include['visitor_privacy_consent'] = true;
            it('Should correctly create a new mode using exempt mode as base', function () {
                globalPA.privacy.createMode('testMode', true);
                expect(globalPA.privacy.modes['testMode']).to.deep.equal(testModeValue);
            });
        });
    });
});
