let observer;
const regexDownloads = /\.(pdf|xlsx?|docx?|txt|rtf|csv|exe|key|pp(s|t|tx)|7z|pkg|rar|gz|zip|avi|mov|mp4|mpe?g|wmv|midi?|mp3|wav|wma)(\?.+)?$/;
let pianoAnalytics;

function downloads(pa) {
    try {
        pianoAnalytics = pa;
        if (document.readyState === 'complete') {
            init();
        } else {
            window.addEventListener('load', init, {once: true});
        }
    } catch (e) {
        /* empty */
    }
}

function init() {
    (Array.from(document.getElementsByTagName('a'))).forEach(addListener);
    observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName === 'A') {
                    addListener(node);
                }
                if (typeof node.querySelectorAll === 'function') {
                    Array.from(node.querySelectorAll('a')).map(addListener);
                }
            });
        });
    });
    observer.observe(document.body, {
        subtree: true, childList: true,
    });
}

function addListener(a) {
    if (regexDownloads.test(a.href)) {
        let url;
        try {
            url = new URL(a.href, window.location.href);
        } catch (e) {
            return;
        }
        a.addEventListener('click', function () {
            pianoAnalytics.sendEvent('click.download', {
                'event_collection_auto': true,
                'click': url.pathname,
                'click_chapter1': a.text
            });
        });
    }
}

export {
    downloads
};


