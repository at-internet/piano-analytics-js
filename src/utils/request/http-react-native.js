const http = {
    post: function (url, data, callback) {
        return fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        })
            .then((data) => {
                callback && callback(url, data);
            })
            .catch((error) => {
                console.error(error);
            });
    }
};

export {http};
