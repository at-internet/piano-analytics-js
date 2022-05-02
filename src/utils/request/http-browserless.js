import * as https from 'https';

const http = {
    post: function (url, data, callback) {
        const bodyContent = data;
        const _url = new URL(url);
        const options = {
            hostname: _url.hostname,
            port: 443,
            path: _url.pathname + _url.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': bodyContent.length
            }
        };
        const req = https.request(options, res => {
            callback && callback(url, data, res);
        });
        req.write(bodyContent);
        req.end();
    }
};

export {http};
