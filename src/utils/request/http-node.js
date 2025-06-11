import * as https from 'https';

const http = {
    post: function (model, url, data, callback) {
        let postData = data;
        if (typeof data === 'object') {
            postData = JSON.stringify(data);
        }
        const bodyContent = postData;
        const _url = new URL(url);
        const options = {
            hostname: _url.hostname,
            port: 443,
            path: _url.pathname + _url.search,
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
            }
        };
        const req = https.request(options, function (res) {
            callback && callback(url, postData, res);
        });
        req.write(bodyContent);
        req.end();
    }
};

export {http};
