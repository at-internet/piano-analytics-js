describe('Privacy in Browser :', function () {
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
    describe('user cases :', function () {
        let checkAndForceDynamicPropertiesToStaticTestingValues = function (events, propsUndefined, propsToForce) {
            for (let prop of propsUndefined) {
                for (let evt of events) {
                    expect(evt.data[prop], `the property ${prop} should NOT be present`).to.equal(undefined);
                }
            }
            for (let prop of propsToForce) {
                for (let evt of events) {
                    expect(evt.data[prop], `the property ${prop} should be present`).to.not.equal(undefined);
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
                                            'event_collection_version'
                                        ],
                                        [
                                            'browser_language',
                                            'browser_language_local',
                                            'device_display_height',
                                            'device_display_width',
                                            'device_screen_height',
                                            'device_screen_width',
                                            'device_timestamp_utc',
                                            'device_local_hour',
                                            'device_hour',
                                            'previous_url',
                                            'page_url',
                                            'ch_ua',
                                            'ch_ua_arch',
                                            'ch_ua_bitness',
                                            'ch_ua_full_version',
                                            'ch_ua_full_version_list',
                                            'ch_ua_mobile',
                                            'ch_ua_model',
                                            'ch_ua_platform',
                                            'ch_ua_platform_version'
                                        ]
                                    );
                                    expect(model.build.data).to.deep.equal({
                                        'events': [
                                            {
                                                'data': {
                                                    'browser_language': 'forced_value_for_test',
                                                    'browser_language_local': 'forced_value_for_test',
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'page_url': 'forced_value_for_test',
                                                    'user_id': '123',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'optin'
                                                },
                                                'name': 'custom.allisgreen'
                                            },
                                            {
                                                'data': {
                                                    'browser_language': 'forced_value_for_test',
                                                    'browser_language_local': 'forced_value_for_test',
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'page_url': 'forced_value_for_test',
                                                    'user_id': '123',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'optin'
                                                },
                                                'name': 'click.navigation'
                                            },
                                            {
                                                'data': {
                                                    'browser_language': 'forced_value_for_test',
                                                    'browser_language_local': 'forced_value_for_test',
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'page_url': 'forced_value_for_test',
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
                                    expect(visitorIdStored).to.equal('OPT-OUT');
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
                                            'event_collection_version',
                                            'ch_ua',
                                            'ch_ua_arch',
                                            'ch_ua_bitness',
                                            'ch_ua_full_version',
                                            'ch_ua_full_version_list',
                                            'ch_ua_mobile',
                                            'ch_ua_model',
                                            'ch_ua_platform',
                                            'ch_ua_platform_version'
                                        ]
                                    );
                                    expect(model.build.data).to.deep.equal({
                                        'events': [
                                            {
                                                'data': {
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                    expect(model.visitorId).to.equal('Consent-NO');

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
                                            'event_collection_version',
                                            'ch_ua',
                                            'ch_ua_arch',
                                            'ch_ua_bitness',
                                            'ch_ua_full_version',
                                            'ch_ua_full_version_list',
                                            'ch_ua_mobile',
                                            'ch_ua_model',
                                            'ch_ua_platform',
                                            'ch_ua_platform_version'
                                        ]
                                    );

                                    expect(model.build.data).to.deep.equal({
                                        'events': [
                                            {
                                                'data': {
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                        [],
                                        [
                                            'browser_language',
                                            'browser_language_local',
                                            'device_display_height',
                                            'device_display_width',
                                            'device_screen_height',
                                            'device_screen_width',
                                            'device_timestamp_utc',
                                            'device_local_hour',
                                            'device_hour',
                                            'event_collection_platform',
                                            'event_collection_version',
                                            'ch_ua',
                                            'ch_ua_arch',
                                            'ch_ua_bitness',
                                            'ch_ua_full_version',
                                            'ch_ua_full_version_list',
                                            'ch_ua_mobile',
                                            'ch_ua_model',
                                            'ch_ua_platform',
                                            'ch_ua_platform_version',
                                            'previous_url',
                                            'page_url',
                                        ]
                                    );

                                    expect(model.build.data).to.deep.equal({
                                        'events': [
                                            {
                                                'name': 'custom.specific.event',
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
                                                    'user_id': '123',
                                                    'user_category': '456789',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-storage',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_display_height': 'forced_value_for_test',
                                                    'browser_language': 'forced_value_for_test',
                                                    'browser_language_local': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'page_url': 'forced_value_for_test',
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test'
                                                }
                                            },
                                            {
                                                'name': 'custom.all.one',
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
                                                    'user_id': '123',
                                                    'user_category': '456789',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-storage',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_display_height': 'forced_value_for_test',
                                                    'browser_language': 'forced_value_for_test',
                                                    'browser_language_local': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'page_url': 'forced_value_for_test',
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test'
                                                }
                                            },
                                            {
                                                'name': 'custom.all.two',
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
                                                    'user_id': '123',
                                                    'user_category': '456789',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-storage',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_display_height': 'forced_value_for_test',
                                                    'browser_language': 'forced_value_for_test',
                                                    'browser_language_local': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'page_url': 'forced_value_for_test',
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test'
                                                }
                                            },
                                            {
                                                'name': 'custom.allisgreen',
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
                                                    'user_id': '123',
                                                    'user_category': '456789',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-storage',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_display_height': 'forced_value_for_test',
                                                    'browser_language': 'forced_value_for_test',
                                                    'browser_language_local': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'page_url': 'forced_value_for_test',
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test'
                                                }
                                            },
                                            {
                                                'name': 'click.exit',
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
                                                    'user_id': '123',
                                                    'user_category': '456789',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-storage',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_display_height': 'forced_value_for_test',
                                                    'browser_language': 'forced_value_for_test',
                                                    'browser_language_local': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'page_url': 'forced_value_for_test',
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test'
                                                }
                                            },
                                            {
                                                'name': 'click.navigation',
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
                                                    'user_id': '123',
                                                    'user_category': '456789',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-storage',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_display_height': 'forced_value_for_test',
                                                    'browser_language': 'forced_value_for_test',
                                                    'browser_language_local': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'page_url': 'forced_value_for_test',
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test'
                                                }
                                            },
                                            {
                                                'name': 'page.display',
                                                'data': {
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
                                                    'user_id': '123',
                                                    'user_category': '456789',
                                                    'user_recognition': false,
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'no-storage',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'device_local_hour': 'forced_value_for_test',
                                                    'device_hour': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_display_height': 'forced_value_for_test',
                                                    'browser_language': 'forced_value_for_test',
                                                    'browser_language_local': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'page_url': 'forced_value_for_test',
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test'
                                                }
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
                                            'browser_language_local'
                                        ],
                                        [
                                            'device_display_height',
                                            'device_display_width',
                                            'device_screen_height',
                                            'device_screen_width',
                                            'device_timestamp_utc',
                                            'event_collection_platform',
                                            'event_collection_version',
                                            'ch_ua',
                                            'ch_ua_arch',
                                            'ch_ua_bitness',
                                            'ch_ua_full_version',
                                            'ch_ua_full_version_list',
                                            'ch_ua_mobile',
                                            'ch_ua_model',
                                            'ch_ua_platform',
                                            'ch_ua_platform_version',
                                            'previous_url'
                                        ]
                                    );

                                    expect(model.build.data).to.deep.equal({
                                        'events': [
                                            {
                                                'data': {
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'exempt'
                                                },
                                                'name': 'custom.specific.event'
                                            },
                                            {
                                                'data': {
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'exempt'
                                                },
                                                'name': 'custom.all.one'
                                            },
                                            {
                                                'data': {
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': false,
                                                    'visitor_privacy_mode': 'exempt'
                                                },
                                                'name': 'custom.all.two'
                                            },
                                            {
                                                'data': {
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
                                                    'click': 'click exit',
                                                    'click_chapter1': 'click chapter 1',
                                                    'click_chapter2': 'click chapter 2',
                                                    'click_chapter3': 'click chapter 3',
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
                                                    'click': 'click navigation',
                                                    'click_chapter1': 'click chapter 1',
                                                    'click_chapter2': 'click chapter 2',
                                                    'click_chapter3': 'click chapter 3',
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
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
                                            'browser_language_local'
                                        ],
                                        [
                                            'device_display_height',
                                            'device_display_width',
                                            'device_screen_height',
                                            'device_screen_width',
                                            'device_timestamp_utc',
                                            'event_collection_platform',
                                            'event_collection_version',
                                            'ch_ua',
                                            'ch_ua_arch',
                                            'ch_ua_bitness',
                                            'ch_ua_full_version',
                                            'ch_ua_full_version_list',
                                            'ch_ua_mobile',
                                            'ch_ua_model',
                                            'ch_ua_platform',
                                            'ch_ua_platform_version',
                                            'previous_url'
                                        ]
                                    );

                                    expect(model.build.data).to.deep.equal({
                                        'events': [
                                            {
                                                'data': {
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'mytestingMode'
                                                },
                                                'name': 'custom.specific.event'
                                            },
                                            {
                                                'data': {
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'mytestingMode'
                                                },
                                                'name': 'custom.all.one'
                                            },
                                            {
                                                'data': {
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'mytestingMode'
                                                },
                                                'name': 'custom.all.two'
                                            },
                                            {
                                                'data': {
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
                                                    'click': 'click exit',
                                                    'click_chapter1': 'click chapter 1',
                                                    'click_chapter2': 'click chapter 2',
                                                    'click_chapter3': 'click chapter 3',
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
                                                    'click': 'click navigation',
                                                    'click_chapter1': 'click chapter 1',
                                                    'click_chapter2': 'click chapter 2',
                                                    'click_chapter3': 'click chapter 3',
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
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
        it('Should work overriding the configuration', function (done) {
            Utility.clearStorage(pa);

            window._pac = window._pac || {privacy: []};
            _pac.privacyDefaultMode = 'mytestingMode';
            _pac.privacy.push(['createMode', 'mytestingMode', true]);
            _pac.privacy.push(['include.properties',
                [
                    'event_collection_*',
                    'customprop1_sub1_deep1',
                    'customprop1_sub2_deep2',
                    'customprop2*',
                    'customprop3_sub1_*',
                    'user_category'
                ],
                null,
                ['page.display', 'click.action', 'custom.*']]);
            _pac.privacy.push(['include.events', ['custom.specific.event', 'custom.all.*', 'click.exit']]);
            _pac.privacy.push(['include.storageKeys', ['pa_user']]);

            const PATemp = new pa.PA(config);

            PATemp.setUser('123', '456789');
            PATemp.sendEvents(testEvents,
                {
                    onBeforeSend: function (PianoAnalytics, model) {
                        PATemp.storage.getItem(PATemp.getConfiguration('storageUser'), function (userDataStored) {
                            PATemp.storage.getItem(PATemp.getConfiguration('storageVisitor'), function (visitorIdStored) {
                                PATemp.storage.getItem(PATemp.getConfiguration('privacy').storageKey, function (privacyStored) {
                                    expect(userDataStored).to.deep.equal({id: '123', category: '456789'});
                                    expect(privacyStored).to.equal('mytestingMode');
                                    expect(regexUUID.test(visitorIdStored)).to.equal(true);
                                    expect(visitorIdStored).to.equal(model.visitorId);

                                    checkAndForceDynamicPropertiesToStaticTestingValues(
                                        model.build.data.events,
                                        [
                                            'browser_language',
                                            'browser_language_local'
                                        ],
                                        [
                                            'device_display_height',
                                            'device_display_width',
                                            'device_screen_height',
                                            'device_screen_width',
                                            'device_timestamp_utc',
                                            'event_collection_platform',
                                            'event_collection_version',
                                            'ch_ua',
                                            'ch_ua_arch',
                                            'ch_ua_bitness',
                                            'ch_ua_full_version',
                                            'ch_ua_full_version_list',
                                            'ch_ua_mobile',
                                            'ch_ua_model',
                                            'ch_ua_platform',
                                            'ch_ua_platform_version',
                                            'previous_url'
                                        ]
                                    );

                                    expect(model.build.data).to.deep.equal({
                                        'events': [
                                            {
                                                'data': {
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'mytestingMode'
                                                },
                                                'name': 'custom.specific.event'
                                            },
                                            {
                                                'data': {
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'mytestingMode'
                                                },
                                                'name': 'custom.all.one'
                                            },
                                            {
                                                'data': {
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
                                                    'user_category': '456789',
                                                    'visitor_privacy_consent': true,
                                                    'visitor_privacy_mode': 'mytestingMode'
                                                },
                                                'name': 'custom.all.two'
                                            },
                                            {
                                                'data': {
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
                                                    'click': 'click exit',
                                                    'click_chapter1': 'click chapter 1',
                                                    'click_chapter2': 'click chapter 2',
                                                    'click_chapter3': 'click chapter 3',
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
                                                    'click': 'click navigation',
                                                    'click_chapter1': 'click chapter 1',
                                                    'click_chapter2': 'click chapter 2',
                                                    'click_chapter3': 'click chapter 3',
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
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
                                                    'ch_ua': 'forced_value_for_test',
                                                    'ch_ua_arch': 'forced_value_for_test',
                                                    'ch_ua_bitness': 'forced_value_for_test',
                                                    'ch_ua_full_version': 'forced_value_for_test',
                                                    'ch_ua_full_version_list': 'forced_value_for_test',
                                                    'ch_ua_mobile': 'forced_value_for_test',
                                                    'ch_ua_model': 'forced_value_for_test',
                                                    'ch_ua_platform': 'forced_value_for_test',
                                                    'ch_ua_platform_version': 'forced_value_for_test',
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
                                                    'device_display_height': 'forced_value_for_test',
                                                    'device_display_width': 'forced_value_for_test',
                                                    'device_screen_height': 'forced_value_for_test',
                                                    'device_screen_width': 'forced_value_for_test',
                                                    'device_timestamp_utc': 'forced_value_for_test',
                                                    'event_collection_platform': 'forced_value_for_test',
                                                    'event_collection_version': 'forced_value_for_test',
                                                    'previous_url': 'forced_value_for_test',
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
});
