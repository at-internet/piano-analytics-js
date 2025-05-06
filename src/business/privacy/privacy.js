import {AtPrivacy} from './at-privacy';
import {DlPrivacy} from './dl-privacy';
import {dataLayer} from '../ext/data-layer/data-layer';

const defaultConfig = {
    migration: {
        browserId: {
            source: 'PA'
        }
    },
    cookies: {
        storageMode: 'fixed'
    }
};

function Privacy(pa) {
    this.isLegacyPrivacy = true;
    this.getOptoutValue = function () {
        return this.isLegacyPrivacy ? 'optout' : 'opt-out';
    };
    this.call = function (method, ...paramsArray) {
        const privacy = this.isLegacyPrivacy ? 'privacy' : 'consent';
        return pa[privacy][method].apply(pa[privacy], paramsArray);
    };
}

function checkAndForceConsent(pa, isConsentForced) {
    if (isConsentForced) {
        pa._privacy.isLegacyPrivacy = false;
        window.pdl.requireConsent = 'v2';
        window.pdl.consent = {products: ['PA']};
    }
}

function initPrivacy(pa) {
    // wrapper between legacy vs consent privacies for internal use
    pa._privacy = new Privacy(pa);
    if (BUILD_BROWSER) {
        const isConsentForced = pa.getConfiguration('consentDefaultMode');
        if (typeof window.pdl === 'undefined') {
            window.pdl = defaultConfig;
            checkAndForceConsent(pa, isConsentForced);
        } else {
            if (window.pdl.requireConsent) {
                pa._privacy.isLegacyPrivacy = false;
            } else {
                checkAndForceConsent(pa, isConsentForced);
            }
            if (typeof window.pdl.cookies === 'undefined') {
                window.pdl.cookies = {
                    storageMode: 'fixed'
                };
            } else if (window.pdl.cookies && typeof window.pdl.cookies.storageMode === 'undefined') {
                window.pdl.cookies.storageMode = 'fixed';
            }
        }
        dataLayer.init({
            cookieDefault: {
                domain: pa.getConfiguration('cookieDomain') || null,
                secure: pa.getConfiguration('cookieSecure'),
                path: pa.getConfiguration('cookiePath'),
                samesite: pa.getConfiguration('cookieSameSite')
            },
            cookies: {
                _pcid: {
                    expires: pa.getConfiguration('storageLifetimeVisitor')
                }
            }
        });
    }
    // public privacy api (deprecated for browser tagging)
    pa.privacy = new AtPrivacy(pa);
    if (BUILD_BROWSER) {
        // public consent api (new browser tagging for privacy)
        pa.consent = new DlPrivacy(pa);
    }
}

export {
    initPrivacy
};
