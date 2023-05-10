function post(url, data) {
    if (window.XDomainRequest) {
        let xdr = new window.XDomainRequest();
        xdr.open('POST', url, true);
        xdr.send(data);
    } else {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        xhr.send(data);
    }
}

const http = {
    post: post
};
export {http};
