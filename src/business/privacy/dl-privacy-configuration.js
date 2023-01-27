const baseConfig = {
    cookieItems: {
        '*': 'optional',
        'pa_vid': 'mandatory',
        'pa_privacy': 'mandatory',
        'atuserid': 'essential'
    },
    eventItems: {
        'click.exit': 'mandatory',
        'click.navigation': 'mandatory',
        'click.download': 'mandatory',
        'click.action': 'mandatory',
        'page.display': 'mandatory'
    },
    propertyItems: {
        '*': 'optional',
        'connection_type': 'mandatory',
        'device_timestamp_utc': 'mandatory',
        'visitor_privacy_consent': 'mandatory',
        'visitor_privacy_mode': 'mandatory',
        'ch_ua': 'mandatory',
        'ch_ua_arch': 'mandatory',
        'ch_ua_bitness': 'mandatory',
        'ch_ua_full_version': 'mandatory',
        'ch_ua_full_version_list': 'mandatory',
        'ch_ua_mobile': 'mandatory',
        'ch_ua_model': 'mandatory',
        'ch_ua_platform': 'mandatory',
        'ch_ua_platform_version': 'mandatory',
        'app_crash': 'essential',
        'app_crash_class': 'essential',
        'app_crash_screen': 'essential',
        'app_version': 'essential',
        'browser': 'essential',
        'browser_cookie_acceptance': 'essential',
        'browser_group': 'essential',
        'browser_version': 'essential',
        'click': 'essential',
        'click_chapter1': 'essential',
        'click_chapter2': 'essential',
        'click_chapter3': 'essential',
        'click_full_name': 'essential',
        'connection_monitor': 'essential',
        'connection_organisation': 'essential',
        'date': 'essential',
        'date_day': 'essential',
        'date_daynumber': 'essential',
        'date_month': 'essential',
        'date_monthnumber': 'essential',
        'date_week': 'essential',
        'date_year': 'essential',
        'date_yearofweek': 'essential',
        'device_brand': 'essential',
        'device_display_height': 'essential',
        'device_display_width': 'essential',
        'device_name': 'essential',
        'device_name_tech': 'essential',
        'device_screen_diagonal': 'essential',
        'device_screen_height': 'essential',
        'device_screen_width': 'essential',
        'device_type': 'essential',
        'event_collection_platform': 'essential',
        'event_collection_version': 'essential',
        'event_hour': 'essential',
        'event_id': 'essential',
        'event_minute': 'essential',
        'event_position': 'essential',
        'event_second': 'essential',
        'event_time': 'essential',
        'event_time_utc': 'essential',
        'event_url': 'essential',
        'event_url_domain': 'essential',
        'event_url_full': 'essential',
        'exclusion_cause': 'essential',
        'exclusion_type': 'essential',
        'geo_city': 'essential',
        'geo_continent': 'essential',
        'geo_country': 'essential',
        'geo_metro': 'essential',
        'geo_region': 'essential',
        'goal_type': 'essential',
        'hit_time_utc': 'essential',
        'os': 'essential',
        'os_group': 'essential',
        'os_version': 'essential',
        'os_version_name': 'essential',
        'page': 'essential',
        'page_chapter1': 'essential',
        'page_chapter2': 'essential',
        'page_chapter3': 'essential',
        'page_duration': 'essential',
        'page_full_name': 'essential',
        'page_position': 'essential',
        'page_title_html': 'essential',
        'pageview_id': 'essential',
        'previous_url': 'essential',
        'privacy_status': 'essential',
        'site': 'essential',
        'site_env': 'essential',
        'site_id': 'essential',
        'site_platform': 'essential',
        'src': 'essential',
        'src_detail': 'essential',
        'src_direct_access': 'essential',
        'src_organic': 'essential',
        'src_organic_detail': 'essential',
        'src_portal_domain': 'essential',
        'src_portal_site': 'essential',
        'src_portal_site_id': 'essential',
        'src_portal_url': 'essential',
        'src_referrer_site_domain': 'essential',
        'src_referrer_site_url': 'essential',
        'src_referrer_url': 'essential',
        'src_se': 'essential',
        'src_se_category': 'essential',
        'src_se_country': 'essential',
        'src_type': 'essential',
        'src_url': 'essential',
        'src_url_domain': 'essential',
        'src_webmail': 'essential'
    }
};

function _checkConsentItemsPA(type) {
    return window.pdl && window.pdl.consent_items && window.pdl.consent_items.PA && window.pdl.consent_items.PA[type];
}

function _getItems(config, itemType) {
    let consentItems = config;
    if (_checkConsentItemsPA(itemType)) {
        Object.assign(consentItems, window.pdl.consent_items.PA[itemType]);
    }
    return consentItems;
}

function getConsentItems() {
    return {
        propertyItems: _getItems(baseConfig.propertyItems, 'properties'),
        eventItems: _getItems(baseConfig.eventItems, 'events'),
        cookieItems: _getItems(baseConfig.cookieItems, 'storages')
    };
}

export {
    getConsentItems
};
