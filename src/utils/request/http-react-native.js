const http = {
    post: function (url, data, callback) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
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
