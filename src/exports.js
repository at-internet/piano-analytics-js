import Config from './config.js';
import PianoAnalytics from './core/PianoAnalytics';

export const pianoAnalytics = (function () {
    const _instance = new PianoAnalytics(Config);
    if (BUILD_BROWSER) {
        if (window && !window.pa) {
            window.pa = _instance;
        }
    }
    return _instance;
})();

