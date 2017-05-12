/**
 * Created by zuozhuo on 2017/5/9.
 */


import browsersList from './browsersList';
import {DipWebpackConfigMaker, ALL_LOADER_RULE_NAMES, ALL_PLUGIN_NAMES} from './DipWebpackConfigMaker';

/*
 - XM_*** 全局常量注入
 - hash enabled/disable
 - code split (改成了babel-plugin-transform-runtime)
 -  vendor entry & polyfill
 - Tree Shaking
 - sassLoaderOption 也改成配置文件形式载入
 - 生产环境下，是否对非生产环境和react的代码做了压缩
 - 重新构建yarn.lock
 - unit-test (jest)
 - npm outdated
 - defaultEntry should be removable

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
