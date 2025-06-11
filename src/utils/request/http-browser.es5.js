function post(model, url, data) {
    let postData = data;
    if (typeof data === 'object') {
        postData = JSON.stringify(data);
    }
    if (window.XDomainRequest) {
        let xdr = new window.XDomainRequest();
        xdr.open('POST', url, true);
        xdr.send(postData);
    } else {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        xhr.send(postData);
    }
}

const http = {
    post: post
};
export {http};
