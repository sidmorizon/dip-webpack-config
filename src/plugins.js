/**
 * Created by zuozhuo on 2017/5/9.
 */


import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import InlineChunkWebpackPlugin from 'html-webpack-inline-chunk-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import BabiliWebpackPlugin from 'babili-webpack-plugin';
import ChunkLoadingEventPlugin from './ChunkLoadingEventPlugin';

import {isProductionEnv} from './utils';
import {getService, SERVICE_NAMES} from './bottle';
import {ENV_TYPES} from './consts';


// import GitRevisionPlugin from 'git-revision-webpack-plugin';
// import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
//

const chunkLoadingEventPlugin = () => new ChunkLoadingEventPlugin();

const circularDependencyPlugin = () => {
    return new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /node_modules/, // /a\.js|node_modules/
        // add errors to webpack instead of warnings
        failOnError: false,
    });
};

const commonsChunkPlugin = () => {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);
    let chunkFileName = '[name].js';
    if (dipConfig.hash) {
        // 注意: webpack-dev-server 模式下[chunkhash]不可用(vendors返回为undefined),请使用[hash].
        // webpack命令行直接build是可以用[chunkhash]的
        chunkFileName = isProductionEnv() ? '[name].[chunkhash].js' : '[name].[hash].js';
    }

    return new webpack.optimize.CommonsChunkPlugin({
        names: dipConfig.commonChunks && dipConfig.commonChunks.length > 0
            ? dipConfig.commonChunks
            : [
                // 这里是有依赖顺序的，前面的chunk（html中输出靠后）将依赖后面的chunk（html中输出靠前）
                'vendors', // 这里对应的就是entry里的 vendors
                'manifest', // 必须将manifest独立出来,否则会位于vendors中,导致vendors的md5永远在变化
            ],
        filename: chunkFileName,
    })
        ;
};

const htmlWebpackPlugin = () => {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);


    // 模板传参数请看源码： HtmlWebpackPlugin.prototype.executeTemplate
    return new HtmlWebpackPlugin({
        filename: 'index.html',
        template: dipConfig.htmlTpl,
        inject: 'body',

        // html压缩
        minify: isProductionEnv() ? {
            removeComments: true,
            collapseWhitespace: true,
        } : false,

        htmlPayload: dipConfig.htmlPayload,
    });
};

const inlineChunkWebpackPlugin = () => {
    return new InlineChunkWebpackPlugin({
        // 将manifest的chunk在html中直出,减少http请求
        inlineChunks: ['manifest'],
    });
};

const definePlugin = () => {
    // 优化React的生产代码，用来生成没有注释和各种warning及仅debug相关的代码
    return new webpack.DefinePlugin({
        // 声明全局变量： process.env.NODE_ENV
        'process.env': {
            NODE_ENV: JSON.stringify(isProductionEnv()
                ? ENV_TYPES.production
                : ENV_TYPES.development),
        },
    });
};

const uglifyJsPlugin = () => {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);

    return new webpack.optimize.UglifyJsPlugin({ // 压缩JS
        sourceMap: dipConfig.sourceMap,
        output: {
            comments: false,     // remove all comments
        },
        compress: {
            warnings: false,
        },
    });
};

const babiliWebpackPlugin = () => {
    return new BabiliWebpackPlugin();
};

const friendlyErrorsWebpackPlugin = () => {
    return new FriendlyErrorsWebpackPlugin();
};


const hotModuleReplacementPlugin = () => {
    return new webpack.HotModuleReplacementPlugin();
};

const loaderOptionsPlugin = () => {
    // const dipConfig = getService(SERVICE_NAMES.dipConfig);

    // 这里用于兼容一些loader插件必须从 webpack.config.js 的根路径读取配置的情况
    // 例如 postcss，读取debug属性等
    return new webpack.LoaderOptionsPlugin({
        minimize: isProductionEnv(),
        debug: !isProductionEnv(),
        options: {
            // https://github.com/peerigon/extract-loader/issues/16
            // extract-loader need this
            output: {},               // <--- this solves the issue
            // file-loader need this, or url will be local system
            context: process.cwd(),
        },
    });
};

let _extractTextPlugins = null;
const extractTextPlugins = () => {
    if (!_extractTextPlugins) {
        const dipConfig = getService(SERVICE_NAMES.dipConfig);

        const scssExtract = new ExtractTextPlugin({
            filename: dipConfig.hash ? 'scss.[contenthash].css' : 'scss.css',
        });
        const cssExtract = new ExtractTextPlugin({
            filename: dipConfig.hash ? 'css.[contenthash].css' : 'css.css',
        });
        const cssModulesExtract = new ExtractTextPlugin({
            filename: dipConfig.hash ? 'css-modules.[contenthash].css' : 'css-modules.css',
            disable: false,
            // css modules中的css必须加这个才能extract出来
            allChunks: true,
        });
        _extractTextPlugins = {
            scssExtract,
            cssExtract,
            cssModulesExtract,
        };
    }
    return _extractTextPlugins;
};

export {
    loaderOptionsPlugin,
    circularDependencyPlugin,
    commonsChunkPlugin,
    chunkLoadingEventPlugin,
    htmlWebpackPlugin,
    inlineChunkWebpackPlugin,
    definePlugin,
    uglifyJsPlugin, babiliWebpackPlugin,
    friendlyErrorsWebpackPlugin,
    hotModuleReplacementPlugin,
    extractTextPlugins,
};
