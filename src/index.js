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
 - unit-test
    * css\scss\module.scss

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
