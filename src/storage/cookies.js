import {encoding} from '../utils/index';

function Cookies(pa) {
    this.setItem = function (name, data, expiration, callback) {
        let cookie = `${name}=${(pa.getConfiguration('encodeStorageBase64') ? encoding.base64.encode(JSON.stringify(data)) : encodeURIComponent(JSON.stringify(data)))}`;
        cookie += `;path=${pa.getConfiguration('cookiePath')}`;
        cookie += `;domain=${pa.getConfiguration('cookieDomain')}`;
        cookie += pa.getConfiguration('cookieSecure') ? ';secure' : '';
        cookie += `;samesite=${pa.getConfiguration('cookieSameSite')}`;
        cookie += expiration ? `;expires=${expiration.toUTCString()}` : '';
        document.cookie = cookie;
        callback && callback();
    };
    this.getItem = function (name, callback) {
        let storedData = null;
        const regExp = new RegExp(`(?:^| )${name}=([^;]+)`);
        const cookieData = regExp.exec(document.cookie) || null;
        if (cookieData) {
            try {
                storedData = JSON.parse(decodeURIComponent(cookieData[1]));
            } catch (e) {
                storedData = JSON.parse(encoding.base64.decode(cookieData[1]));
            }
        }
        callback && callback(storedData);
    };
    this.deleteItem = function (name, callback) {
        const date = new Date();
        date.setTime(date.getTime() - 1000);
        this.setItem(name, '', date, callback);
    };
}

export {Cookies};
