async function post(model, url, data) {
    let queued = false;
    if (window.navigator && typeof window.navigator.sendBeacon === 'function' && model.getConfiguration('useSendBeacon')) {
        queued = window.navigator.sendBeacon(url, data);
    }
    if (!queued && window.fetch) {
        try {
            const response = await window.fetch(url, {
                method: 'POST',
                body: data,
                keepalive: true,
                headers: {
                    'Content-Type': 'text/plain;charset=UTF-8'
                }
            });
            if (!response.ok) {
                _fetchNoKeepAlive(url, data);
            }
        } catch (e) {
            _fetchNoKeepAlive(url, data);
        }
    }
}

function _fetchNoKeepAlive(url, data) {
    window.fetch(url, {
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'text/plain;charset=UTF-8'
        }
    });
}

const http = {
    post: post
};
export {http};
