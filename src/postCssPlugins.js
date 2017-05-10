/**
 * Created by zuozhuo on 2017/5/9.
 */
'use strict'

import autoprefixer from 'autoprefixer';
import pxtorem from 'postcss-pxtorem';
import browsersList from './browsersList';

const autoPrefixerPostCssPlugin = autoprefixer({
    browsers: browsersList
});

const pxToRemPostCssPlugin = pxtorem({
    rootValue: 16,
    unitPrecision: 5,
    selectorBlackList: [/^body$/, /^html$/, /^\.xm-footbar$/, /^\.xm-navbar$/], // 不进行转换的选择器
    propList: ['*'],
    replace: true,
    mediaQuery: false,
    minPixelValue: 0
});

export default [
    autoPrefixerPostCssPlugin,
    // pxToRemPostCssPlugin,
];

