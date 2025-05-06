const getQueryStringParameters = function(prefix, str, destPrefix) {
    const result = {};
    const regex = new RegExp('[&#?]{1}([^&=#?]*)=([^&#]*)?', 'g');
    let match = regex.exec(str);
    while (match !== null) {
        if (match[1].indexOf(prefix) === 0) {
            result[destPrefix + match[1].substring(prefix.length)] = match[2] === undefined ? '' : window.decodeURIComponent(match[2]);
        }
        match = regex.exec(str);
    }
    return result;
};
export {getQueryStringParameters};
