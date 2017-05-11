/**
 * Created by zuozhuo on 2017/5/9.
 */
'use strict';

import browsersList from './browsersList';
import {DipWebpackConfigMaker,ALL_LOADER_RULE_NAMES,ALL_PLUGIN_NAMES} from "./DipWebpackConfigMaker";

/*
 - 修改plugins和module.rules(loaders)
 - 外部可以通过webpackMerge再次更改
 - XM_*** 全局常量注入
 - babel配置统一为 .babelrc
 - hash enabled/disable
 - code split & _babelEs6TempHelper_
 - babel-regenerator-runtime vendor entry
 - Tree Shaking
 - sassLoaderOption 也改成配置文件形式载入

 - .babelrc
 - .browserslistrc
 - .env
 - .eslintrc
 - .eslintignore
 - postcss.config.js

 - less loader

 */

export {
    browsersList,
    DipWebpackConfigMaker,
    ALL_LOADER_RULE_NAMES,
    ALL_PLUGIN_NAMES,
}