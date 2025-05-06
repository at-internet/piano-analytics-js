let pageUrl = new URL(window.location.href);
let previousPageUrl;

function onPageView(callback) {
    const callbackWrapper = function () {
        setPageUrl(window.location.href);
        callback();
    };
    // first page loading
    if (document.readyState === 'complete') {
        callback(true);
    } else {
        window.addEventListener('load', function () {
            callback(true);
        }, {once: true});
    }
    // get dynamic pages navigation
    const pushState = window.history.pushState;
    window.history.pushState = function () {
        pushState.apply(window.history, arguments);
        callbackWrapper();
    };
    // get backward/forward navigation
    window.addEventListener('popstate', callbackWrapper);
    window.addEventListener('unload', function () {
        window.removeEventListener('popstate', callbackWrapper);
    }, {once: true});
}

function setPageUrl(url) {
    const newUrl = new URL(url);
    if (newUrl.href !== pageUrl.href) {
        previousPageUrl = pageUrl.href.split('#')[0];
        pageUrl = newUrl;
    }
}

function getPageUrl() {
    return pageUrl;
}

function getPreviousPageUrl() {
    return previousPageUrl ;
}

export {
    onPageView,
    getPageUrl,
    getPreviousPageUrl
};
