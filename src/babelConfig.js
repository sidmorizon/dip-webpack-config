/**
 * Created by zuozhuo on 2017/5/9.
 */
'use strict';
import {getDataFromEnv} from "./utils";

export default getDataFromEnv({
    presets: [
        [
            'es2015',
            {loose: true}
        ],
        'react',
        'stage-0'
    ],
    plugins: [
        // 将所有文件里的新增的es6helper方法
        // (_inherits\_objectWithoutProperties\possibleConstructorReturn)提取到一个文件里，以便减少体积
        ["babel-plugin-transform-helper", {
            helperFilename: '_babelEs6TempHelper_.js'
        }],

        // 因为app.js里已经包含了 import './js/tool/polyfills' （包含 regenerator-runtime）
        // 'babel-plugin-transform-runtime', // 支持generator、promise、async、await
        "babel-plugin-dev-expression", // 替换 __DEV__  invariant warning
        "babel-plugin-add-module-exports", // 解决es6 export default问题
        'babel-plugin-transform-decorators-legacy',  // 支持装饰器
        "babel-plugin-transform-react-remove-prop-types", // 生产环境移除propTypes
        "babel-plugin-lodash", // 优化缩减lodash
    ]
});
