import {sendBeacon} from './sendbeacon';
import {request} from './node';

const browser = {
    post: sendBeacon
};
const universal = request;
const http = BUILD_BROWSER ? browser : universal;

export {http};
