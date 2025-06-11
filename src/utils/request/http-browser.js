async function post(model, url, data) {
    let postData = data;
    if (typeof data === 'object') {
        postData = JSON.stringify(data);
    }
    let queued = false;
    if (window.navigator && typeof window.navigator.sendBeacon === 'function' && model.getConfiguration('useSendBeacon')) {
        queued = window.navigator.sendBeacon(url, postData);
    }
    if (!queued && window.fetch) {
        try {
            const response = await window.fetch(url, {
                method: 'POST',
                body: postData,
                keepalive: true,
                headers: {
                    'Content-Type': 'text/plain;charset=UTF-8'
                }
            });
            if (!response.ok) {
                _fetchNoKeepAlive(url, postData);
            }
        } catch (e) {
            _fetchNoKeepAlive(url, postData);
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
