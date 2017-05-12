/**
 * Created by zuozhuo on 2017/5/9.
 */


import browsersList from './browsersList';
import {DipWebpackConfigMaker, ALL_LOADER_RULE_NAMES, ALL_PLUGIN_NAMES} from './DipWebpackConfigMaker';

/*
 - XM_*** 全局常量注入
 -  vendor entry & polyfill
 - Tree Shaking
 - sassLoaderOption 也改成配置文件形式载入
 - 重新构建yarn.lock
 - npm outdated
 - defaultEntry should be removable
 - 使用.babelrc.js替代.babelrc，需要升级babel-core到7.0正式版
 - unit-test
    * css\scss\module.scss
    * sassOption: includePaths
    * moduleCss: import includePaths

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
};
