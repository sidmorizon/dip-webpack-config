/**
 * Created by zuozhuo on 2017/5/9.
 */
'use strict';

import browsersList from './browsersList';
import {DipWebpackConfigMaker} from "./DipWebpackConfigMaker";

/*
 - reset env
 - 传入特定的dipConfig
 - 修改plugins和module.rules(loaders)
 - 外部可以通过webpackMerge再次更改
 - extract plugin
 - XM_*** 全局常量注入
 - sourcemap

 - .babelrc
 - .browserslistrc
 - .env
 - .eslintrc
 - .PostCSSrc

 - less loader

 */

export {
    browsersList,
    DipWebpackConfigMaker,
}