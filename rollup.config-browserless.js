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
            BUILD_BROWSER: 'false'
        }),
        babel({babelHelpers: 'bundled'}),
        process.env.NODE_ENV === 'production' && uglify()
    ],
    output: [
        {
            file: 'dist/browserless/piano-analytics.cjs.js',
            format: 'cjs',
            exports: 'auto'
        },
        {
            file: 'dist/browserless/piano-analytics.esm.js',
            format: 'es'
        }
    ],
    external: ['https']
};
