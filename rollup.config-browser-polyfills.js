import {babel} from '@rollup/plugin-babel';
import {eslint} from 'rollup-plugin-eslint';
import {uglify} from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';
import * as path from "path";

export default {
    input: 'src/exports.js',
    plugins: [
        eslint({
            configFile: './src/.eslintrc.json'
        }),
        replace({
            BUILD_BROWSER: 'true'
        }),
        babel({configFile: path.resolve(__dirname, 'babel.config-with-polyfills.json'), babelHelpers: 'bundled'}),
        process.env.NODE_ENV === 'production' && uglify()
    ],
    output: [
        {
            file: 'dist/browser/piano-analytics.es5.js',
            format: 'iife',
            name: 'pianoAnalytics'
        },
        {
            file: 'dist/browser/piano-analytics.es5.umd.js',
            format: 'umd',
            name: 'pianoAnalytics'
        }
    ]
};
