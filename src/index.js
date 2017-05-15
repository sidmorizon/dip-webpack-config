/**
 * Created by zuozhuo on 2017/5/9.
 */


import browsersList from './browsersList';
import {DipWebpackConfigMaker, ALL_LOADER_RULE_NAMES, ALL_PLUGIN_NAMES} from './DipWebpackConfigMaker';

/*

 - 重新构建yarn.lock
 - npm outdated
 - defaultEntry should be removable
 - 使用.babelrc.js替代.babelrc，需要升级babel-core到7.0正式版

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
