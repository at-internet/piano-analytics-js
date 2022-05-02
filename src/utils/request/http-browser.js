function sendBeacon(url, data) {
    if (window.navigator && typeof window.navigator.sendBeacon === 'function') {
        window.navigator.sendBeacon(url, data);
    }
}
const http = {
    post: sendBeacon
};
export {http};
