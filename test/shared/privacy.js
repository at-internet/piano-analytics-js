describe('Privacy :', function () {
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
    describe('properties management :', function () {
        describe('include.properties :', function () {
            it('Should add a correct list of properties into the allowed without events/modes', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2']
                );
                expect(globalPA.privacy.modes['*'].properties.allowed['*']).to.deep.equal({
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
            it('Should add a correct list of properties into the allowed with modes but no events', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    ['exempt', 'optout', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].properties.allowed).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    }
                });
                expect(globalPA.privacy.modes['exempt'].properties.allowed['*']).to.deep.equal({
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
                    'page_url': true,
                    'pageview_id': true,
                    'previous_url': true,
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
                expect(globalPA.privacy.modes['optout'].properties.allowed['*']).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
                expect(globalPA.privacy.modes['customMode']).to.equal(undefined);
            });
            it('Should add a correct list of properties into the allowed with one known mode but no events', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].properties.allowed).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    }
                });
                expect(globalPA.privacy.modes['exempt'].properties.allowed['*']).to.deep.equal({
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
                    'page_url': true,
                    'pageview_id': true,
                    'previous_url': true,
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
            it('Should add a correct list of properties into the allowed with one unknown mode but no events', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].properties.allowed).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    }
                });
            });
            it('Should add a correct list of properties into the allowed with events but no modes', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    null,
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['*'].properties.allowed).to.deep.equal({
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
            it('Should add a correct list of properties into the allowed with one event but no modes', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    null,
                    'page.display'
                );
                expect(globalPA.privacy.modes['*'].properties.allowed).to.deep.equal({
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
            it('Should add a correct list of properties into the allowed with modes and events', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    ['exempt', 'customMode'],
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['exempt'].properties.allowed).to.deep.equal({
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
                        'page_url': true,
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
            it('Should add a correct list of properties into the allowed with one known mode and one event', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'exempt',
                    'page.display'
                );
                expect(globalPA.privacy.modes['exempt'].properties.allowed).to.deep.equal({
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
                        'page_url': true,
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
            it('Should not add a list of properties into the allowed using one unknown mode', function () {
                globalPA.privacy.include.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'customMode',
                    'page.display'
                );
                expect(globalPA.privacy.modes['customMode']).to.equal(undefined);
            });
        });
        describe('include.property :', function () {
            it('Should add a property into the allowed without events/modes', function () {
                globalPA.privacy.include.property('prop1_sub1');
                expect(globalPA.privacy.modes['*'].properties.allowed['*']).to.deep.equal({
                    'ch_ua*': true,
                    'connection_type': true,
                    'device_timestamp_utc': true,
                    'prop1_sub1': true,
                    'visitor_privacy_consent': true,
                    'visitor_privacy_mode': true
                });
            });
            it('Should add a property into the allowed with modes but no events', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].properties.allowed).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    }
                });
                expect(globalPA.privacy.modes['exempt'].properties.allowed['*']).to.deep.equal({
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
                    'page_url': true,
                    'pageview_id': true,
                    'previous_url': true,
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
            it('Should add a property into the allowed with one known mode but no events', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].properties.allowed).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    }
                });
                expect(globalPA.privacy.modes['exempt'].properties.allowed['*']).to.deep.equal({
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
                    'page_url': true,
                    'pageview_id': true,
                    'previous_url': true,
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
            it('Should add a property into the allowed with one unknown mode but no events', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].properties.allowed).to.deep.equal({
                    '*': {
                        'ch_ua*': true,
                        'connection_type': true,
                        'device_timestamp_utc': true,
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': true
                    }
                });
            });
            it('Should add a property into the allowed with events but no modes', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    null,
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['*'].properties.allowed).to.deep.equal({
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
            it('Should add a property into the allowed with one event but no modes', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    null,
                    'page.display'
                );
                expect(globalPA.privacy.modes['*'].properties.allowed).to.deep.equal({
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
            it('Should add a property into the allowed with modes and events', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    ['exempt', 'customMode'],
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['exempt'].properties.allowed).to.deep.equal({
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
                        'page_url': true,
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
                    },
                    'page.display': {
                        'prop1_sub1': true
                    },
                    'custom.event': {
                        'prop1_sub1': true
                    }
                });
            });
            it('Should add a property into the allowed with one known mode and one event', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    'exempt',
                    'page.display'
                );
                expect(globalPA.privacy.modes['exempt'].properties.allowed).to.deep.equal({
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
                        'page_url': true,
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
                    },
                    'page.display': {
                        'prop1_sub1': true
                    }
                });
            });
            it('Should not add a property into the allowed using one unknown mode', function () {
                globalPA.privacy.include.property(
                    'prop1_sub1',
                    'customMode',
                    'page.display'
                );
                expect(globalPA.privacy.modes['customMode']).to.equal(undefined);
            });
        });
        describe('exclude.properties :', function () {
            it('Should add a correct list of properties into the forbidden without events/modes', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2']
                );
                expect(globalPA.privacy.modes['*'].properties.forbidden['*']).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of properties into the forbidden with modes but no events', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].properties.forbidden).to.deep.equal({'*': {}});
                expect(globalPA.privacy.modes['exempt'].properties.forbidden['*']).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of properties into the forbidden with one known mode but no events', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].properties.forbidden).to.deep.equal({'*': {}});
                expect(globalPA.privacy.modes['exempt'].properties.forbidden['*']).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of properties into the forbidden with one unknown mode but no events', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].properties.forbidden).to.deep.equal({'*': {}});
            });
            it('Should add a correct list of properties into the forbidden with events but no modes', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    null,
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['*'].properties.forbidden).to.deep.equal({
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
            it('Should add a correct list of properties into the forbidden with one event but no modes', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    null,
                    'page.display'
                );
                expect(globalPA.privacy.modes['*'].properties.forbidden).to.deep.equal({
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
            it('Should add a correct list of properties into the forbidden with modes and events', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    ['exempt', 'customMode'],
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['exempt'].properties.forbidden).to.deep.equal({
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
            it('Should add a correct list of properties into the forbidden with one known mode and one event', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'exempt',
                    'page.display'
                );
                expect(globalPA.privacy.modes['exempt'].properties.forbidden).to.deep.equal({
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
            it('Should not add a correct list of properties into the forbidden using one unknown mode', function () {
                globalPA.privacy.exclude.properties(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'customMode',
                    'page.display'
                );
                expect(globalPA.privacy.modes['customMode']).to.equal(undefined);
            });
        });
        describe('exclude.property :', function () {
            it('Should add a property into the forbidden without events/modes', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1'
                );
                expect(globalPA.privacy.modes['*'].properties.forbidden['*']).to.deep.equal({
                    'prop1_sub1': true
                });
            });
            it('Should add a property into the forbidden with modes but no events', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].properties.forbidden).to.deep.equal({'*': {}});
                expect(globalPA.privacy.modes['exempt'].properties.forbidden['*']).to.deep.equal({
                    'prop1_sub1': true
                });
            });
            it('Should add a property into the forbidden with one known mode but no events', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].properties.forbidden).to.deep.equal({'*': {}});
                expect(globalPA.privacy.modes['exempt'].properties.forbidden['*']).to.deep.equal({
                    'prop1_sub1': true
                });
            });
            it('Should add a property into the forbidden with one unknown mode but no events', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].properties.forbidden).to.deep.equal({'*': {}});
            });
            it('Should add a property into the forbidden with events but no modes', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    null,
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['*'].properties.forbidden).to.deep.equal({
                    '*': {},
                    'page.display': {
                        'prop1_sub1': true
                    },
                    'custom.event': {
                        'prop1_sub1': true
                    }
                });
            });
            it('Should add a property into the forbidden with one event but no modes', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    null,
                    'page.display'
                );
                expect(globalPA.privacy.modes['*'].properties.forbidden).to.deep.equal({
                    '*': {},
                    'page.display': {
                        'prop1_sub1': true
                    }
                });
            });
            it('Should add a property into the forbidden with modes and events', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    ['exempt', 'customMode'],
                    ['page.display', 'custom.event']
                );
                expect(globalPA.privacy.modes['exempt'].properties.forbidden).to.deep.equal({
                    '*': {},
                    'page.display': {
                        'prop1_sub1': true
                    },
                    'custom.event': {
                        'prop1_sub1': true
                    }
                });
            });
            it('Should add a property into the forbidden with one known mode and one event', function () {
                globalPA.privacy.exclude.property(
                    'prop1_sub1',
                    'exempt',
                    'page.display'
                );
                expect(globalPA.privacy.modes['exempt'].properties.forbidden).to.deep.equal({
                    '*': {},
                    'page.display': {
                        'prop1_sub1': true
                    }
                });
            });
            it('Should not add a property into the forbidden using one unknown mode', function () {
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
            it('Should add a correct list of keys into the allowed without modes', function () {
                globalPA.privacy.include.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2']
                );
                expect(globalPA.privacy.modes['*'].storage.allowed).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of keys into the allowed with modes', function () {
                globalPA.privacy.include.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].storage.allowed).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.allowed).to.deep.equal({
                    'pa_vid': true,
                    'pa_privacy': true,
                    'atuserid': true,
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of keys into the allowed with one known mode', function () {
                globalPA.privacy.include.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].storage.allowed).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.allowed).to.deep.equal({
                    'pa_vid': true,
                    'pa_privacy': true,
                    'atuserid': true,
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of keys into the allowed with one unknown mode', function () {
                globalPA.privacy.include.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].storage.allowed).to.deep.equal({});
            });
        });
        describe('include.storageKey :', function () {
            it('Should add a correct storage key into the allowed without modes', function () {
                globalPA.privacy.include.storageKey(
                    'prop1_sub1'
                );
                expect(globalPA.privacy.modes['*'].storage.allowed).to.deep.equal({
                    'prop1_sub1': true
                });
            });
            it('Should add a correct storage key into the allowed with modes', function () {
                globalPA.privacy.include.storageKey(
                    'prop1_sub1',
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].storage.allowed).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.allowed).to.deep.equal({
                    'pa_vid': true,
                    'pa_privacy': true,
                    'atuserid': true,
                    'prop1_sub1': true
                });
            });
            it('Should add a correct storage key into the allowed with one known mode', function () {
                globalPA.privacy.include.storageKey(
                    'prop1_sub1',
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].storage.allowed).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.allowed).to.deep.equal({
                    'pa_vid': true,
                    'pa_privacy': true,
                    'atuserid': true,
                    'prop1_sub1': true
                });
            });
            it('Should add a correct storage key into the allowed with one unknown mode', function () {
                globalPA.privacy.include.storageKey(
                    'prop1_sub1',
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].storage.allowed).to.deep.equal({});
            });
        });
        describe('exclude.storageKeys :', function () {
            it('Should add a correct list of keys into the forbidden without modes', function () {
                globalPA.privacy.exclude.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2']
                );
                expect(globalPA.privacy.modes['*'].storage.forbidden).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of keys into the forbidden with modes', function () {
                globalPA.privacy.exclude.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].storage.forbidden).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.forbidden).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of keys into the forbidden with one known mode', function () {
                globalPA.privacy.exclude.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].storage.forbidden).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.forbidden).to.deep.equal({
                    'prop1_sub1': true,
                    'prop2_sub1': true,
                    'prop2_sub2': true,
                    'prop3_*': true,
                    'prop4_sub1_*': true,
                    'prop4_sub2': true
                });
            });
            it('Should add a correct list of keys into the forbidden with one unknown mode', function () {
                globalPA.privacy.exclude.storageKeys(
                    ['prop1_sub1', 'prop2_sub1', 'prop2_sub2', 'prop3_*', 'prop4_sub1_*', 'prop4_sub2'],
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].storage.forbidden).to.deep.equal({});
            });
        });
        describe('exclude.storageKey :', function () {
            it('Should add a correct list of keys into the forbidden without modes', function () {
                globalPA.privacy.exclude.storageKey(
                    'prop1_sub1'
                );
                expect(globalPA.privacy.modes['*'].storage.forbidden).to.deep.equal({
                    'prop1_sub1': true
                });
            });
            it('Should add a correct list of keys into the forbidden with modes', function () {
                globalPA.privacy.exclude.storageKey(
                    'prop1_sub1',
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].storage.forbidden).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.forbidden).to.deep.equal({
                    'prop1_sub1': true
                });
            });
            it('Should add a correct list of keys into the forbidden with one known mode', function () {
                globalPA.privacy.exclude.storageKey(
                    'prop1_sub1',
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].storage.forbidden).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].storage.forbidden).to.deep.equal({
                    'prop1_sub1': true
                });
            });
            it('Should add a correct list of keys into the forbidden with one unknown mode', function () {
                globalPA.privacy.exclude.storageKey(
                    'prop1_sub1',
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].storage.forbidden).to.deep.equal({});
            });
        });
    });
    describe('event management :', function () {
        describe('include.events :', function () {
            it('Should add a correct list of events into the allowed without modes', function () {
                globalPA.privacy.include.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*']
                );
                expect(globalPA.privacy.modes['*'].events.allowed).to.deep.equal({
                    'event1.type1': true,
                    'event1.type2': true,
                    'event2.type3': true,
                    'event3.*': true,
                    'event4.type4.*': true,
                    'event5*': true
                });
            });
            it('Should add a correct list of events into the allowed with modes', function () {
                globalPA.privacy.include.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*'],
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].events.allowed).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.allowed).to.deep.equal({
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
            it('Should add a correct list of events into the allowed with one known mode', function () {
                globalPA.privacy.include.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*'],
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].events.allowed).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.allowed).to.deep.equal({
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
            it('Should add a correct list of events into the allowed with one unknown mode', function () {
                globalPA.privacy.include.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*'],
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].events.allowed).to.deep.equal({});
            });
        });
        describe('include.event :', function () {
            it('Should add a correct event into the allowed without modes', function () {
                globalPA.privacy.include.event(
                    'event1.type1'
                );
                expect(globalPA.privacy.modes['*'].events.allowed).to.deep.equal({
                    'event1.type1': true
                });
            });
            it('Should add a correct event into the allowed with modes', function () {
                globalPA.privacy.include.event(
                    'event1.type1',
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].events.allowed).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.allowed).to.deep.equal({
                    'click.exit': true,
                    'click.navigation': true,
                    'click.download': true,
                    'click.action': true,
                    'page.display': true,
                    'event1.type1': true
                });
            });
            it('Should add a correct event into the allowed with one known mode', function () {
                globalPA.privacy.include.event(
                    'event1.type1',
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].events.allowed).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.allowed).to.deep.equal({
                    'click.exit': true,
                    'click.navigation': true,
                    'click.download': true,
                    'click.action': true,
                    'page.display': true,
                    'event1.type1': true
                });
            });
            it('Should add a correct event into the allowed with one unknown mode', function () {
                globalPA.privacy.include.event(
                    'event1.type1',
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].events.allowed).to.deep.equal({});
            });
        });
        describe('exclude.events :', function () {
            it('Should add a correct list of events into the forbidden without modes', function () {
                globalPA.privacy.exclude.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*']
                );
                expect(globalPA.privacy.modes['*'].events.forbidden).to.deep.equal({
                    'event1.type1': true,
                    'event1.type2': true,
                    'event2.type3': true,
                    'event3.*': true,
                    'event4.type4.*': true,
                    'event5*': true
                });
            });
            it('Should add a correct list of events into the forbidden with modes', function () {
                globalPA.privacy.exclude.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*'],
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].events.forbidden).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.forbidden).to.deep.equal({
                    'event1.type1': true,
                    'event1.type2': true,
                    'event2.type3': true,
                    'event3.*': true,
                    'event4.type4.*': true,
                    'event5*': true
                });
            });
            it('Should add a correct list of events into the forbidden with one known mode', function () {
                globalPA.privacy.exclude.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*'],
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].events.forbidden).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.forbidden).to.deep.equal({
                    'event1.type1': true,
                    'event1.type2': true,
                    'event2.type3': true,
                    'event3.*': true,
                    'event4.type4.*': true,
                    'event5*': true
                });
            });
            it('Should add a correct list of events into the forbidden with one unknown mode', function () {
                globalPA.privacy.exclude.events(
                    ['event1.type1', 'event1.type2', 'event2.type3', 'event3.*', 'event4.type4.*', 'event5*'],
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].events.forbidden).to.deep.equal({});
            });
        });
        describe('exclude.event :', function () {
            it('Should add a correct event into the forbidden without modes', function () {
                globalPA.privacy.exclude.event(
                    'event1.type1'
                );
                expect(globalPA.privacy.modes['*'].events.forbidden).to.deep.equal({
                    'event1.type1': true
                });
            });
            it('Should add a correct event into the forbidden with modes', function () {
                globalPA.privacy.exclude.event(
                    'event1.type1',
                    ['exempt', 'customMode']
                );
                expect(globalPA.privacy.modes['*'].events.forbidden).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.forbidden).to.deep.equal({
                    'event1.type1': true
                });
            });
            it('Should add a correct event into the forbidden with one known mode', function () {
                globalPA.privacy.exclude.event(
                    'event1.type1',
                    'exempt'
                );
                expect(globalPA.privacy.modes['*'].events.forbidden).to.deep.equal({});
                expect(globalPA.privacy.modes['exempt'].events.forbidden).to.deep.equal({
                    'event1.type1': true
                });
            });
            it('Should add a correct event into the forbidden with one unknown mode', function () {
                globalPA.privacy.exclude.event(
                    'event1.type1',
                    'customMode'
                );
                expect(globalPA.privacy.modes['*'].events.forbidden).to.deep.equal({});
            });
        });
    });
});
