import Config from './config.js';
import PianoAnalytics from './core/PianoAnalytics';

export const pianoAnalytics = (function () {
    const _instance = new PianoAnalytics(Config);
    if (BUILD_BROWSER) {
        if (window && !window[_instance.getConfiguration('globalVarName')]) {
            window[_instance.getConfiguration('globalVarName')] = _instance;
        }
    }
    return _instance;
})();

