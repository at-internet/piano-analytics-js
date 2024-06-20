import {Platform} from 'react-native';
import Config from '../../config.js';

const http = {
    post: function (url, data, callback) {
        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8',
            },
            body: data
        };
        if (Platform.OS === 'android') {
            params.headers['User-Agent'] = `PA SDK React Native Android/${Config.version}`;
        }
        return fetch(url, params)
            .then((data) => {
                callback && callback(url, data);
            })
            .catch((error) => {
                console.error(error);
            });
    }
};

export {http};
