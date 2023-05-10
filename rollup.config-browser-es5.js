import {babel} from '@rollup/plugin-babel';
import {eslint} from 'rollup-plugin-eslint';
import {uglify} from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

export default {
    input: 'src/exports.js',
    plugins: [
        eslint({
            configFile: './src/.eslintrc.json'
        }),
        replace({
            BUILD_BROWSER: 'true',
            '@piano-sdk/storage': '../storage/storage.js',
            delimiters: ['', '']
        }),
        babel({babelHelpers: 'bundled'}),
        process.env.NODE_ENV === 'production' && uglify()
    ],
    output: [
        {
            file: 'dist/browser/piano-analytics.es5.js',
            format: 'iife',
            name: 'pianoAnalytics'
        }
    ]
};
