function post(model, url, data) {
    let queued = false;
    if (window.navigator && typeof window.navigator.sendBeacon === 'function' && model.getConfiguration('useSendBeacon')) {
        queued = window.navigator.sendBeacon(url, data);
    }
    if (!queued && window.fetch) {
        window.fetch(url, {
            method: 'POST',
            body: data,
            keepalive: true,
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
            }
        });
    }
}

const http = {
    post: post
};
export {http};
