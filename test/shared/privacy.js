describe('Privacy :', function () {
    let config = pa.cfg.cloneData();
    let globalPA;
    let optinModeValue = {
        'events': {
            'blacklist': {},
            'whitelist': {
                '*': true
            }
        },
        'name': 'optin',
        'properties': {
            'blacklist': {
                '*': {}
            },
            'include': {
                'visitor_privacy_consent': true,
                'visitor_privacy_mode': 'optin'
            },
            'whitelist': {
                '*': {
                    '*': true
                }
            }
        },
        'storage': {
            'blacklist': {},
            'whitelist': {
                '*': true
            }
        }
    };
    let optoutModeValue = {
        'events': {
            'blacklist': {},
            'whitelist': {
                '*': true
            }
        },
        'name': 'optout',
        'properties': {
            'blacklist': {
                '*': {}
            },
            'include': {
                'visitor_privacy_consent': false,
                'visitor_privacy_mode': 'optout'
            },
            'whitelist': {
                '*': {}
            }
        },
        'storage': {
            'blacklist': {},
            'whitelist': {
                'pa_vid': true,
                'pa_privacy': true
            }
        },
        'visitorId': 'OPT-OUT'
    };
    let noConsentModeValue = {
        'events': {
            'blacklist': {},
            'whitelist': {
                '*': true
            }
        },
        'name': 'noConsent',
        'properties': {
            'blacklist': {
                '*': {}
            },
            'include': {
                'visitor_privacy_consent': false,
                'visitor_privacy_mode': 'no-consent'
            },
            'whitelist': {
                '*': {}
            }
        },
        'storage': {
            'blacklist': {
                '*': true
            },
            'whitelist': {}
        },
        'visitorId': 'Consent-NO'
    };
    let noStorageModeValue = {
        'events': {
            'blacklist': {},
            'whitelist': {
                '*': true
            }
        },
        'name': 'noStorage',
        'properties': {
            'blacklist': {
                '*': {}
            },
            'include': {
                'visitor_privacy_consent': false,
                'visitor_privacy_mode': 'no-storage'
            },
            'whitelist': {
                '*': {
                    '*': true
                }
            }
        },
        'storage': {
            'blacklist': {
                '*': true
            },
            'whitelist': {}
        },
        'visitorId': 'no-storage'
    };
    let exemptModeValue = {
        'events': {
            'blacklist': {},
            'whitelist': {
                'click.action': true,
                'click.download': true,
                'click.exit': true,
                'click.navigation': true,
                'page.display': true
            }
        },
        'name': 'exempt',
        'properties': {
            'blacklist': {
                '*': {}
            },
            'include': {
                'visitor_privacy_consent': false,
                'visitor_privacy_mode': 'exempt'
            },
            'whitelist': {
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
            'blacklist': {},
            'whitelist': {
                'pa_privacy': true,
                'pa_vid': true
            }
        }
    };
    beforeEach(function () {
        Utility.clearStorage(pa);
        globalPA = new pa.PA(config);
    });
    afterEach(function () {
        globalPA = undefined;
        Utility.clearStorage(pa);
    });
    describe('properties management :', function () {
        describe('include.properties :', function () {
            it('Should add a correct list of properties into the whitelist without events/modes', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2']
                );
                expect(globalPA.privacy.modes['*'].properties.whitelist['*']).to.deep.equal({
                    'ch_ua*': true,
                    'connection_type': true,
                    'device_timestamp_utc': true,
                    'visitor_privacy_consent': true,
                    'visitor_privacy_mode': true,
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of properties into the whitelist with modes but no events', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    ['exempt', 'optout', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].properties.whitelist).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    }
                });
                expect(globalPA.privacy.modes['exempt'].properties.whitelist['*']).to.deep.equal({
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
                    'privacy_status': true,
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true,
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
                });
                expect(globalPA.privacy.modes['optout'].properties.whitelist['*']).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
                expect(globalPA.privacy.modes['customMode']).to.equal(undefined);
            });
            it('Should add a correct list of properties into the whitelist with one known mode but no events', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].properties.whitelist).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    }
                });
                expect(globalPA.privacy.modes['exempt'].properties.whitelist['*']).to.deep.equal({
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
                    'privacy_status': true,
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true,
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
                });
            });
            it('Should add a correct list of properties into the whitelist with one unknown mode but no events', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].properties.whitelist).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    }
                });
            });
            it('Should add a correct list of properties into the whitelist with events but no modes', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    null,
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['*'].properties.whitelist).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    },
                    'page.display': {
                        'prop1_sub1': true,
                        'prop2_sub1': true,
                        'prop2_sub2': true,
                        'prop3_*': true,
                        'prop4_sub1_*': true,
                        'prop4_sub2': true
                    },
                    'custom.event': {
                        'prop1_sub1': true,
                        'prop2_sub1': true,
                        'prop2_sub2': true,
                        'prop3_*': true,
                        'prop4_sub1_*': true,
                        'prop4_sub2': true
                    }
                });
            });
            it('Should add a correct list of properties into the whitelist with one event but no modes', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    null,
                    'page.display'
                );
                expect(globalPA.privacy.modes['*'].properties.whitelist).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    },
                    'page.display': {
                        'prop1_sub1': true,
                        'prop2_sub1': true,
                        'prop2_sub2': true,
                        'prop3_*': true,
                        'prop4_sub1_*': true,
                        'prop4_sub2': true
                    }
                });
            });
            it('Should add a correct list of properties into the whitelist with modes and events', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    ['exempt', 'customMode'],
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['exempt'].properties.whitelist).to.deep.equal({
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
                    },
                    'page.display': {
                        'prop1_sub1': true,
                        'prop2_sub1': true,
                        'prop2_sub2': true,
                        'prop3_*': true,
                        'prop4_sub1_*': true,
                        'prop4_sub2': true
                    },
                    'custom.event': {
                        'prop1_sub1': true,
                        'prop2_sub1': true,
                        'prop2_sub2': true,
                        'prop3_*': true,
                        'prop4_sub1_*': true,
                        'prop4_sub2': true
                    }
                });
            });
            it('Should add a correct list of properties into the whitelist with one known mode and one event', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'exempt',
                    'page.display'
                );
                expect(globalPA.privacy.modes['exempt'].properties.whitelist).to.deep.equal({
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
                    },
                    'page.display': {
                        'prop1_sub1': true,
                        'prop2_sub1': true,
                        'prop2_sub2': true,
                        'prop3_*': true,
                        'prop4_sub1_*': true,
                        'prop4_sub2': true
                    }
                });
            });
            it('Should not add a list of properties into the whitelist using one unknown mode', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'customMode',
                    'page.display'
                );
                expect(globalPA.privacy.modes['customMode']).to.equal(undefined);
            });
        });
        describe('include.property :', function () {
            it('Should add a property into the whitelist without events/modes', function () {
                globalPA.privacy.include.property('prop1_sub1');
                expect(globalPA.privacy.modes['*'].properties.whitelist['*']).to.deep.equal({
                    'ch_ua*': true,
                    'connection_type': true,
                    'device_timestamp_utc': true,
                    'prop1_sub1': true,
                    'visitor_privacy_consent': true,
                    'visitor_privacy_mode': true
                });
            });
            it('Should add a property into the whitelist with modes but no events', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].properties.whitelist).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    }
                });
                expect(globalPA.privacy.modes['exempt'].properties.whitelist['*']).to.deep.equal({
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
                    'privacy_status': true,
                    'prop1_sub1': true,
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
                });
            });
            it('Should add a property into the whitelist with one known mode but no events', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].properties.whitelist).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    }
                });
                expect(globalPA.privacy.modes['exempt'].properties.whitelist['*']).to.deep.equal({
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
                    'privacy_status': true,
                    'prop1_sub1': true,
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
                });
            });
            it('Should add a property into the whitelist with one unknown mode but no events', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].properties.whitelist).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    }
                });
            });
            it('Should add a property into the whitelist with events but no modes', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    null,
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['*'].properties.whitelist).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    },
                    'page.display': {
                        'prop1_sub1': true
                    },
                    'custom.event': {
                        'prop1_sub1': true
                    }
                });
            });
            it('Should add a property into the whitelist with one event but no modes', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    null,
                    'page.display'
                );
                expect(globalPA.privacy.modes['*'].properties.whitelist).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    },
                    'page.display': {
                        'prop1_sub1': true
                    }
                });
            });
            it('Should add a property into the whitelist with modes and events', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    ['exempt', 'customMode'],
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['exempt'].properties.whitelist).to.deep.equal({
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
                    },
                    'page.display': {
                        'prop1_sub1': true
                    },
                    'custom.event': {
                        'prop1_sub1': true
                    }
                });
            });
            it('Should add a property into the whitelist with one known mode and one event', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    'exempt',
                    'page.display'
                );
                expect(globalPA.privacy.modes['exempt'].properties.whitelist).to.deep.equal({
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
                    },
                    'page.display': {
                        'prop1_sub1': true
                    }
                });
            });
            it('Should not add a property into the whitelist using one unknown mode', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    'customMode',
                    'page.display'
                );
                expect(globalPA.privacy.modes['customMode']).to.equal(undefined);
            });
        });
        describe('exclude.properties :', function () {
            it('Should add a correct list of properties into the blacklist without events/modes', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2']
                );
                expect(globalPA.privacy.modes['*'].properties.blacklist['*']).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of properties into the blacklist with modes but no events', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].properties.blacklist).to.deep.equal({'*': {}});
                expect(globalPA.privacy.modes['exempt'].properties.blacklist['*']).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of properties into the blacklist with one known mode but no events', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].properties.blacklist).to.deep.equal({'*': {}});
                expect(globalPA.privacy.modes['exempt'].properties.blacklist['*']).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of properties into the blacklist with one unknown mode but no events', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].properties.blacklist).to.deep.equal({'*': {}});
            });
            it('Should add a correct list of properties into the blacklist with events but no modes', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    null,
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['*'].properties.blacklist).to.deep.equal({
                    '*': {},
                    'page.display': {
                        'prop1_sub1': true,
                        'prop2_sub1': true,
                        'prop2_sub2': true,
                        'prop3_*': true,
                        'prop4_sub1_*': true,
                        'prop4_sub2': true
                    },
                    'custom.event': {
                        'prop1_sub1': true,
                        'prop2_sub1': true,
                        'prop2_sub2': true,
                        'prop3_*': true,
                        'prop4_sub1_*': true,
                        'prop4_sub2': true
                    }
                });
            });
            it('Should add a correct list of properties into the blacklist with one event but no modes', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    null,
                    'page.display'
                );
                expect(globalPA.privacy.modes['*'].properties.blacklist).to.deep.equal({
                    '*': {},
                    'page.display': {
                        'prop1_sub1': true,
                        'prop2_sub1': true,
                        'prop2_sub2': true,
                        'prop3_*': true,
                        'prop4_sub1_*': true,
                        'prop4_sub2': true
                    }
                });
            });
            it('Should add a correct list of properties into the blacklist with modes and events', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    ['exempt', 'customMode'],
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['exempt'].properties.blacklist).to.deep.equal({
                    '*': {},
                    'page.display': {
                        'prop1_sub1': true,
                        'prop2_sub1': true,
                        'prop2_sub2': true,
                        'prop3_*': true,
                        'prop4_sub1_*': true,
                        'prop4_sub2': true
                    },
                    'custom.event': {
                        'prop1_sub1': true,
                        'prop2_sub1': true,
                        'prop2_sub2': true,
                        'prop3_*': true,
                        'prop4_sub1_*': true,
                        'prop4_sub2': true
                    }
                });
            });
            it('Should add a correct list of properties into the blacklist with one known mode and one event', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'exempt',
                    'page.display'
                );
                expect(globalPA.privacy.modes['exempt'].properties.blacklist).to.deep.equal({
                    '*': {},
                    'page.display': {
                        'prop1_sub1': true,
                        'prop2_sub1': true,
                        'prop2_sub2': true,
                        'prop3_*': true,
                        'prop4_sub1_*': true,
                        'prop4_sub2': true
                    }
                });
            });
            it('Should not add a correct list of properties into the blacklist using one unknown mode', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'customMode',
                    'page.display'
                );
                expect(globalPA.privacy.modes['customMode']).to.equal(undefined);
            });
        });
        describe('exclude.property :', function () {
            it('Should add a property into the blacklist without events/modes', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1'
                );
                expect(globalPA.privacy.modes['*'].properties.blacklist['*']).to.deep.equal({
                    'prop1_sub1': true
                });
            });
            it('Should add a property into the blacklist with modes but no events', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].properties.blacklist).to.deep.equal({'*': {}});
                expect(globalPA.privacy.modes['exempt'].properties.blacklist['*']).to.deep.equal({
                    'prop1_sub1': true
                });
            });
            it('Should add a property into the blacklist with one known mode but no events', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].properties.blacklist).to.deep.equal({'*': {}});
                expect(globalPA.privacy.modes['exempt'].properties.blacklist['*']).to.deep.equal({
                    'prop1_sub1': true
                });
            });
            it('Should add a property into the blacklist with one unknown mode but no events', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].properties.blacklist).to.deep.equal({'*': {}});
            });
            it('Should add a property into the blacklist with events but no modes', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    null,
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['*'].properties.blacklist).to.deep.equal({
                    '*': {},
                    'page.display': {
                        'prop1_sub1': true
                    },
                    'custom.event': {
                        'prop1_sub1': true
                    }
                });
            });
            it('Should add a property into the blacklist with one event but no modes', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    null,
                    'page.display'
                );
                expect(globalPA.privacy.modes['*'].properties.blacklist).to.deep.equal({
                    '*': {},
                    'page.display': {
                        'prop1_sub1': true
                    }
                });
            });
            it('Should add a property into the blacklist with modes and events', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    ['exempt', 'customMode'],
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['exempt'].properties.blacklist).to.deep.equal({
                    '*': {},
                    'page.display': {
                        'prop1_sub1': true
                    },
                    'custom.event': {
                        'prop1_sub1': true
                    }
                });
            });
            it('Should add a property into the blacklist with one known mode and one event', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    'exempt',
                    'page.display'
                );
                expect(globalPA.privacy.modes['exempt'].properties.blacklist).to.deep.equal({
                    '*': {},
                    'page.display': {
                        'prop1_sub1': true
                    }
                });
            });
            it('Should not add a property into the blacklist using one unknown mode', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    'customMode',
                    'page.display'
                );
                expect(globalPA.privacy.modes['customMode']).to.equal(undefined);
            });
        });
    });
    describe('storage keys management :', function () {
        describe('include.storageKeys :', function () {
            it('Should add a correct list of keys into the whitelist without modes', function () {
                globalPA.privacy.include.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2']
                );
                expect(globalPA.privacy.modes['*'].storage.whitelist).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of keys into the whitelist with modes', function () {
                globalPA.privacy.include.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].storage.whitelist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.whitelist).to.deep.equal({
                    'pa_vid': true,
                    'pa_privacy': true,
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of keys into the whitelist with one known mode', function () {
                globalPA.privacy.include.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].storage.whitelist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.whitelist).to.deep.equal({
                    'pa_vid': true,
                    'pa_privacy': true,
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of keys into the whitelist with one unknown mode', function () {
                globalPA.privacy.include.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].storage.whitelist).to.deep.equal({});
            });
        });
        describe('include.storageKey :', function () {
            it('Should add a correct storage key into the whitelist without modes', function () {
                globalPA.privacy.include.storageKey(
                    'prop1_sub1'
                );
                expect(globalPA.privacy.modes['*'].storage.whitelist).to.deep.equal({
                    'prop1_sub1': true
                });
            });
            it('Should add a correct storage key into the whitelist with modes', function () {
                globalPA.privacy.include.storageKey(
                    'prop1_sub1',
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].storage.whitelist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.whitelist).to.deep.equal({
                    'pa_vid': true,
                    'pa_privacy': true,
                    'prop1_sub1': true
                });
            });
            it('Should add a correct storage key into the whitelist with one known mode', function () {
                globalPA.privacy.include.storageKey(
                    'prop1_sub1',
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].storage.whitelist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.whitelist).to.deep.equal({
                    'pa_vid': true,
                    'pa_privacy': true,
                    'prop1_sub1': true
                });
            });
            it('Should add a correct storage key into the whitelist with one unknown mode', function () {
                globalPA.privacy.include.storageKey(
                    'prop1_sub1',
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].storage.whitelist).to.deep.equal({});
            });
        });
        describe('exclude.storageKeys :', function () {
            it('Should add a correct list of keys into the blacklist without modes', function () {
                globalPA.privacy.exclude.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2']
                );
                expect(globalPA.privacy.modes['*'].storage.blacklist).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of keys into the blacklist with modes', function () {
                globalPA.privacy.exclude.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].storage.blacklist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.blacklist).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of keys into the blacklist with one known mode', function () {
                globalPA.privacy.exclude.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].storage.blacklist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.blacklist).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of keys into the blacklist with one unknown mode', function () {
                globalPA.privacy.exclude.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].storage.blacklist).to.deep.equal({});
            });
        });
        describe('exclude.storageKey :', function () {
            it('Should add a correct list of keys into the blacklist without modes', function () {
                globalPA.privacy.exclude.storageKey(
                    'prop1_sub1'
                );
                expect(globalPA.privacy.modes['*'].storage.blacklist).to.deep.equal({
                    'prop1_sub1': true
                });
            });
            it('Should add a correct list of keys into the blacklist with modes', function () {
                globalPA.privacy.exclude.storageKey(
                    'prop1_sub1',
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].storage.blacklist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.blacklist).to.deep.equal({
                    'prop1_sub1': true
                });
            });
            it('Should add a correct list of keys into the blacklist with one known mode', function () {
                globalPA.privacy.exclude.storageKey(
                    'prop1_sub1',
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].storage.blacklist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.blacklist).to.deep.equal({
                    'prop1_sub1': true
                });
            });
            it('Should add a correct list of keys into the blacklist with one unknown mode', function () {
                globalPA.privacy.exclude.storageKey(
                    'prop1_sub1',
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].storage.blacklist).to.deep.equal({});
            });
        });
    });
    describe('event management :', function () {
        describe('include.events :', function () {
            it('Should add a correct list of events into the whitelist without modes', function () {
                globalPA.privacy.include.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*']
                );
                expect(globalPA.privacy.modes['*'].events.whitelist).to.deep.equal({
                    'event1.type1': true,
                    'event1.type2': true,
                    'event2.type3': true,
                    'event3.*': true,
                    'event4.type4.*': true,
                    'event5*': true
                });
            });
            it('Should add a correct list of events into the whitelist with modes', function () {
                globalPA.privacy.include.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*'],
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].events.whitelist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.whitelist).to.deep.equal({
                    'click.action': true,
                    'click.download': true,
                    'click.exit': true,
                    'click.navigation': true,
                    'event1.type1': true,
                    'event1.type2': true,
                    'event2.type3': true,
                    'event3.*': true,
                    'event4.type4.*': true,
                    'event5*': true,
                    'page.display': true
                });
            });
            it('Should add a correct list of events into the whitelist with one known mode', function () {
                globalPA.privacy.include.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*'],
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].events.whitelist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.whitelist).to.deep.equal({
                    'click.action': true,
                    'click.download': true,
                    'click.exit': true,
                    'click.navigation': true,
                    'event1.type1': true,
                    'event1.type2': true,
                    'event2.type3': true,
                    'event3.*': true,
                    'event4.type4.*': true,
                    'event5*': true,
                    'page.display': true
                });
            });
            it('Should add a correct list of events into the whitelist with one unknown mode', function () {
                globalPA.privacy.include.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*'],
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].events.whitelist).to.deep.equal({});
            });
        });
        describe('include.event :', function () {
            it('Should add a correct event into the whitelist without modes', function () {
                globalPA.privacy.include.event(
                    'event1.type1'
                );
                expect(globalPA.privacy.modes['*'].events.whitelist).to.deep.equal({
                    'event1.type1': true
                });
            });
            it('Should add a correct event into the whitelist with modes', function () {
                globalPA.privacy.include.event(
                    'event1.type1',
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].events.whitelist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.whitelist).to.deep.equal({
                    'click.exit': true,
                    'click.navigation': true,
                    'click.download': true,
                    'click.action': true,
                    'page.display': true,
                    'event1.type1': true
                });
            });
            it('Should add a correct event into the whitelist with one known mode', function () {
                globalPA.privacy.include.event(
                    'event1.type1',
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].events.whitelist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.whitelist).to.deep.equal({
                    'click.exit': true,
                    'click.navigation': true,
                    'click.download': true,
                    'click.action': true,
                    'page.display': true,
                    'event1.type1': true
                });
            });
            it('Should add a correct event into the whitelist with one unknown mode', function () {
                globalPA.privacy.include.event(
                    'event1.type1',
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].events.whitelist).to.deep.equal({});
            });
        });
        describe('exclude.events :', function () {
            it('Should add a correct list of events into the blacklist without modes', function () {
                globalPA.privacy.exclude.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*']
                );
                expect(globalPA.privacy.modes['*'].events.blacklist).to.deep.equal({
                    'event1.type1': true,
                    'event1.type2': true,
                    'event2.type3': true,
                    'event3.*': true,
                    'event4.type4.*': true,
                    'event5*': true
                });
            });
            it('Should add a correct list of events into the blacklist with modes', function () {
                globalPA.privacy.exclude.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*'],
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].events.blacklist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.blacklist).to.deep.equal({
                    'event1.type1': true,
                    'event1.type2': true,
                    'event2.type3': true,
                    'event3.*': true,
                    'event4.type4.*': true,
                    'event5*': true
                });
            });
            it('Should add a correct list of events into the blacklist with one known mode', function () {
                globalPA.privacy.exclude.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*'],
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].events.blacklist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.blacklist).to.deep.equal({
                    'event1.type1': true,
                    'event1.type2': true,
                    'event2.type3': true,
                    'event3.*': true,
                    'event4.type4.*': true,
                    'event5*': true
                });
            });
            it('Should add a correct list of events into the blacklist with one unknown mode', function () {
                globalPA.privacy.exclude.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*'],
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].events.blacklist).to.deep.equal({});
            });
        });
        describe('exclude.event :', function () {
            it('Should add a correct event into the blacklist without modes', function () {
                globalPA.privacy.exclude.event(
                    'event1.type1'
                );
                expect(globalPA.privacy.modes['*'].events.blacklist).to.deep.equal({
                    'event1.type1': true
                });
            });
            it('Should add a correct event into the blacklist with modes', function () {
                globalPA.privacy.exclude.event(
                    'event1.type1',
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].events.blacklist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.blacklist).to.deep.equal({
                    'event1.type1': true
                });
            });
            it('Should add a correct event into the blacklist with one known mode', function () {
                globalPA.privacy.exclude.event(
                    'event1.type1',
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].events.blacklist).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.blacklist).to.deep.equal({
                    'event1.type1': true
                });
            });
            it('Should add a correct event into the blacklist with one unknown mode', function () {
                globalPA.privacy.exclude.event(
                    'event1.type1',
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].events.blacklist).to.deep.equal({});
            });
        });
    });
    describe('mode management :', function () {
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
            it('Should initialize with noConsent mode when present in storage', function () {
                globalPA.storage.setItem(config.privacy.storageKey, 'noConsent', null, function () {
                    let tempPA = new pa.PA(config);
                    expect(tempPA.privacy.getMode()).to.equal('noConsent');
                    expect(tempPA.privacy.modes['noConsent']).to.deep.equal(noConsentModeValue);
                    expect(tempPA.getVisitorId()).to.equal('Consent-NO');
                });
            });
            it('Should initialize with noStorage mode when present in storage', function (done) {
                globalPA.storage.setItem(config.privacy.storageKey, 'noStorage', null, function () {
                    let tempPA = new pa.PA(config);
                    expect(tempPA.privacy.getMode()).to.equal('noStorage');
                    expect(tempPA.privacy.modes['noStorage']).to.deep.equal(noStorageModeValue);
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
                it('noConsent -> optin', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'noConsent', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('noConsent');
                        expect(tempPA.getVisitorId()).to.equal('Consent-NO');
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
                it('noStorage -> optin', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'noStorage', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('noStorage');
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
                it('noConsent -> optout', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'noConsent', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('noConsent');
                        expect(tempPA.getVisitorId()).to.equal('Consent-NO');
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
                it('noStorage -> optout', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'noStorage', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('noStorage');
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
            describe('to noConsent :', function () {
                it('optin -> noConsent', function (done) {
                    expect(globalPA.privacy.getMode()).to.equal('optin');
                    expect(globalPA.getVisitorId()).to.equal(null);
                    globalPA.storage.getItem(config.privacy.storageKey, function (original) {
                        expect(original).to.equal('optin');
                        globalPA.privacy.setMode('noConsent');
                        expect(globalPA.privacy.getMode()).to.equal('noConsent');
                        expect(globalPA.getVisitorId()).to.equal('Consent-NO');
                        globalPA.storage.getItem(config.privacy.storageKey, function (data) {
                            expect(data).to.equal(null);
                            done();
                        });
                    });
                });
                it('optout -> noConsent', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'optout', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('optout');
                        expect(tempPA.getVisitorId()).to.equal('OPT-OUT');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('optout');
                            tempPA.privacy.setMode('noConsent');
                            expect(tempPA.privacy.getMode()).to.equal('noConsent');
                            expect(tempPA.getVisitorId()).to.equal('Consent-NO');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('noConsent -> noConsent', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'noConsent', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('noConsent');
                        expect(tempPA.getVisitorId()).to.equal('Consent-NO');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.setMode('noConsent');
                            expect(tempPA.privacy.getMode()).to.equal('noConsent');
                            expect(tempPA.getVisitorId()).to.equal('Consent-NO');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('noStorage -> noConsent', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'noStorage', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('noStorage');
                        expect(tempPA.getVisitorId()).to.equal('no-storage');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.setMode('noConsent');
                            expect(tempPA.privacy.getMode()).to.equal('noConsent');
                            expect(tempPA.getVisitorId()).to.equal('Consent-NO');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('exempt -> noConsent', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'exempt', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('exempt');
                        expect(tempPA.getVisitorId()).to.equal(null);
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('exempt');
                            tempPA.privacy.setMode('noConsent');
                            expect(tempPA.privacy.getMode()).to.equal('noConsent');
                            expect(tempPA.getVisitorId()).to.equal('Consent-NO');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('custom -> noConsent', function (done) {
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
                            tempPA.privacy.setMode('noConsent');
                            expect(tempPA.privacy.getMode()).to.equal('noConsent');
                            expect(tempPA.getVisitorId()).to.equal('Consent-NO');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
            });
            describe('to noStorage :', function () {
                it('optin -> noStorage', function (done) {
                    expect(globalPA.privacy.getMode()).to.equal('optin');
                    expect(globalPA.getVisitorId()).to.equal(null);
                    globalPA.storage.getItem(config.privacy.storageKey, function (original) {
                        expect(original).to.equal('optin');
                        globalPA.privacy.setMode('noStorage');
                        expect(globalPA.privacy.getMode()).to.equal('noStorage');
                        expect(globalPA.getVisitorId()).to.equal('no-storage');
                        globalPA.storage.getItem(config.privacy.storageKey, function (data) {
                            expect(data).to.equal(null);
                            done();
                        });
                    });
                });
                it('optout -> noStorage', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'optout', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('optout');
                        expect(tempPA.getVisitorId()).to.equal('OPT-OUT');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('optout');
                            tempPA.privacy.setMode('noStorage');
                            expect(tempPA.privacy.getMode()).to.equal('noStorage');
                            expect(tempPA.getVisitorId()).to.equal('no-storage');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('noConsent -> noStorage', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'noConsent', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('noConsent');
                        expect(tempPA.getVisitorId()).to.equal('Consent-NO');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.setMode('noStorage');
                            expect(tempPA.privacy.getMode()).to.equal('noStorage');
                            expect(tempPA.getVisitorId()).to.equal('no-storage');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('noStorage -> noStorage', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'noStorage', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('noStorage');
                        expect(tempPA.getVisitorId()).to.equal('no-storage');
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal(null);
                            tempPA.privacy.setMode('noStorage');
                            expect(tempPA.privacy.getMode()).to.equal('noStorage');
                            expect(tempPA.getVisitorId()).to.equal('no-storage');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('exempt -> noStorage', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'exempt', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('exempt');
                        expect(tempPA.getVisitorId()).to.equal(null);
                        tempPA.storage.getItem(config.privacy.storageKey, function (original) {
                            expect(original).to.equal('exempt');
                            tempPA.privacy.setMode('noStorage');
                            expect(tempPA.privacy.getMode()).to.equal('noStorage');
                            expect(tempPA.getVisitorId()).to.equal('no-storage');
                            tempPA.storage.getItem(config.privacy.storageKey, function (data) {
                                expect(data).to.equal(null);
                                done();
                            });
                        });
                    });
                });
                it('custom -> noStorage', function (done) {
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
                            tempPA.privacy.setMode('noStorage');
                            expect(tempPA.privacy.getMode()).to.equal('noStorage');
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
                it('noConsent -> exempt', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'noConsent', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('noConsent');
                        expect(tempPA.getVisitorId()).to.equal('Consent-NO');
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
                it('noStorage -> exempt', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'noStorage', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('noStorage');
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
                it('noConsent -> custom', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'noConsent', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('noConsent');
                        expect(tempPA.getVisitorId()).to.equal('Consent-NO');
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
                it('noStorage -> custom', function (done) {
                    globalPA.storage.setItem(config.privacy.storageKey, 'noStorage', null, function () {
                        let tempPA = new pa.PA(config);
                        expect(tempPA.privacy.getMode()).to.equal('noStorage');
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
