import {Cookies} from './cookies';
import {LocalVariable} from './universal';

const Storage = BUILD_BROWSER ? Cookies : LocalVariable;

export {Storage};
