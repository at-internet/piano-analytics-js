export default {
    'site': '',
    'collectDomain': '',
    'path': 'event',
    'visitorStorageMode': 'fixed',
    'storageLifetimeVisitor': 395,
    'storageLifetimeUser': 395,
    'storageLifetimePrivacy': 395,
    'privacyDefaultMode': 'optin',
    'sendEventWhenOptout': true,
    'isVisitorClientSide': true,
    'enableCallbacks': true,
    'cookieDomain': '',
    'cookieSecure': true,
    'cookiePath': '/',
    'cookieSameSite': 'lax',
    'encodeStorageBase64': false,
    'addEventURL': 'withoutQS',
    'clickAutoManagement': true,
    'enableUTMTracking': true,
    'campaignPrefix': [
        'at_'
    ],
    'storageVisitor': 'pa_vid',
    'storageUser': 'pa_user',
    'version': '',
    'minHeartbeat': 5,
    'minBufferingHeartbeat': 1,
    'queueVarName': '_paq',
    'globalVarName': 'pa',
    'enableAutomaticPageRefresh': true,
    'allowHighEntropyClientHints': true,
    'sendEmptyProperties': true,
    'enableExtendedOptout': false,
    'instantTracking': false,
    'useSendBeacon': true,
    'privacy': {
        'storageKey': 'pa_privacy',
        'legacyKeys': {
            'pa_vid': true,
            'pa_privacy': true,
            'atuserid': true
        },
        'storageKeys': {
            'pa_user': true
        },
        'modes': {
            'optin': {
                'name': 'optin',
                'properties': {
                    'include': {
                        'visitor_privacy_consent': true,
                        'visitor_privacy_mode': 'optin'
                    },
                    'allowed': {
                        '*': {
                            '*': true
                        }
                    },
                    'forbidden': {
                        '*': {}
                    }
                },
                'storage': {
                    'allowed': {
                        '*': true
                    },
                    'forbidden': {}
                },
                'events': {
                    'allowed': {
                        '*': true
                    },
                    'forbidden': {}
                }
            },
            'optout': {
                'name': 'optout',
                'visitorId': 'OPT-OUT',
                'properties': {
                    'include': {
                        'visitor_privacy_consent': false,
                        'visitor_privacy_mode': 'optout'
                    },
                    'allowed': {
                        '*': {}
                    },
                    'forbidden': {
                        '*': {}
                    }
                },
                'storage': {
                    'allowed': {
                        'pa_vid': true,
                        'pa_privacy': true
                    },
                    'forbidden': {}
                },
                'events': {
                    'allowed': {
                        '*': true
                    },
                    'forbidden': {}
                }
            },
            'no-consent': {
                'name': 'no-consent',
                'visitorId': 'no-consent',
                'properties': {
                    'include': {
                        'visitor_privacy_consent': false,
                        'visitor_privacy_mode': 'no-consent'
                    },
                    'allowed': {
                        '*': {}
                    },
                    'forbidden': {
                        '*': {}
                    }
                },
                'storage': {
                    'allowed': {},
                    'forbidden': {
                        '*': true
                    }
                },
                'events': {
                    'allowed': {
                        '*': true
                    },
                    'forbidden': {}
                }
            },
            'no-storage': {
                'name': 'no-storage',
                'visitorId': 'no-storage',
                'properties': {
                    'include': {
                        'visitor_privacy_consent': false,
                        'visitor_privacy_mode': 'no-storage'
                    },
                    'allowed': {
                        '*': {
                            '*': true
                        }
                    },
                    'forbidden': {
                        '*': {}
                    }
                },
                'storage': {
                    'allowed': {},
                    'forbidden': {
                        '*': true
                    }
                },
                'events': {
                    'allowed': {
                        '*': true
                    },
                    'forbidden': {}
                }
            },
            'exempt': {
                'name': 'exempt',
                'properties': {
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
                            'cookie_creation_date': true,
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
                        }
                    },
                    'forbidden': {
                        '*': {}
                    }
                },
                'storage': {
                    'allowed': {
                        'pa_vid': true,
                        'pa_privacy': true,
                        'atuserid': true
                    },
                    'forbidden': {}
                },
                'events': {
                    'allowed': {
                        'click.exit': true,
                        'click.navigation': true,
                        'click.download': true,
                        'click.action': true,
                        'page.display': true
                    },
                    'forbidden': {}
                }
            },
            '*': {
                'properties': {
                    'allowed': {
                        '*': {
                            'connection_type': true,
                            'device_timestamp_utc': true,
                            'visitor_privacy_consent': true,
                            'visitor_privacy_mode': true,
                            'ch_ua*': true
                        }
                    },
                    'forbidden': {
                        '*': {}
                    }
                },
                'storage': {
                    'allowed': {},
                    'forbidden': {}
                },
                'events': {
                    'allowed': {},
                    'forbidden': {}
                }
            }
        }
    }
};
