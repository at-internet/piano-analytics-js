function post(url, data) {
    let queued = false;
    if (window.navigator && typeof window.navigator.sendBeacon === 'function') {
        queued = window.navigator.sendBeacon(url, data);
    }
    if (!queued && window.fetch) {
        window.fetch(url, {
            method: 'POST',
            body: data,
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
