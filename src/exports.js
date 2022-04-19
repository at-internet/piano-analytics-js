import Config from './config.js';
import PianoAnalytics from './core/PianoAnalytics';

if (BUILD_BROWSER) {
    if (window && !window.pa) {
        window.pa = new PianoAnalytics(Config);
    }
}

