import {Cookies} from './cookies';
import {LocalVariable} from './browserless';

const Storage = BUILD_BROWSER ? Cookies : LocalVariable;

export {Storage};
