/**
 * Created by zuozhuo on 2017/5/10.
 */
'use strict';
import Path from 'path';
import deepExtend from 'deep-extend';
import dipConfig from './defaultDipConfig';
import {clearService, setService, getService, SERVICE_NAMES} from './bottle';
import * as loaderRules from './loaderRules';
import * as plugins from './plugins';
import {getDataFromEnv, isProductionEnv} from "./utils";
import {ENV_TYPES} from "./consts";
import webpackMerge from 'webpack-merge';
import webpack from 'webpack';

function getDevServer() {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);

    const HOST = '0.0.0.0';
    const PORT = process.env.PORT || 8080;
    const DEV_SERVER = `${dipConfig.https ? 'https' : 'http'}://${HOST}:${PORT}`;
    return DEV_SERVER;
}


class DipWebpackConfigMaker {
    rules = {};
    plugins = {};
    finalWebpackConfig = {};
    defaultAppEntry = [];
    defaultVendorEntry = [];

    constructor(myDipConfig) {
        this._initEnv();
        clearService();
        this._setDipConfig(myDipConfig);
        this._initRules();
        this._initPlugins();
        this._initEnties();
    }

    _initEnv() {
        if (!process.env.NODE_ENV) {
            process.env.NODE_ENV = ENV_TYPES.development;
        }
    }

    _setDipConfig(myDipConfig) {
        const _dipConfig = deepExtend({}, dipConfig, myDipConfig);
        if (!Path.isAbsolute(_dipConfig.distPath)) {
            //  将distPath纠正为绝对物理路径，避免webpack报错
            _dipConfig.distPath = Path.join(process.cwd(), _dipConfig.distPath);
        }
        const getDeepConfigSerivce = function () {
            return _dipConfig;
        };
        setService(SERVICE_NAMES.dipConfig, getDeepConfigSerivce);
    }

    _initRules() {
        const commonRules = {
            'htmlLoaderRule': loaderRules.htmlLoaderRule(),
            'externalHtmlLoaderRule': loaderRules.externalHtmlLoaderRule(),
            'jsLoaderRule': loaderRules.jsLoaderRule(),
            'sassLoaderRule': loaderRules.sassLoaderRule(),
            'moduleSassLoaderRule': loaderRules.moduleSassLoaderRule(),
            'cssLoaderRule': loaderRules.cssLoaderRule(),
            'fileUrlLoaderRule': loaderRules.fileUrlLoaderRule(),
        };
        const devRules = deepExtend({}, commonRules, {
            'eslintLoaderRule': loaderRules.eslintLoaderRule(),
        });
        const prdRules = deepExtend({}, commonRules, {});

        this.rules = getDataFromEnv(commonRules, {
            [ENV_TYPES.development]: devRules,
            [ENV_TYPES.production]: prdRules,
        })
    }

    _initPlugins() {
        const commonPlugins = {
            'commonsChunkPlugin': plugins.commonsChunkPlugin(),
            'htmlWebpackPlugin': plugins.htmlWebpackPlugin(),
            'inlineChunkWebpackPlugin': plugins.inlineChunkWebpackPlugin(),
            'definePlugin': plugins.definePlugin(),
            'cssExtract': plugins.extractTextPlugins.cssExtract,
            'scssExtract': plugins.extractTextPlugins.scssExtract,
            'cssModulesExtract': plugins.extractTextPlugins.cssModulesExtract,
        };
        const devPlugins = {
            ...commonPlugins,
            'circularDependencyPlugin': plugins.circularDependencyPlugin(),
            'friendlyErrorsWebpackPlugin': plugins.friendlyErrorsWebpackPlugin(),
            'hotModuleReplacementPlugin': plugins.hotModuleReplacementPlugin(),
        };
        const prdPlugins = {
            ...commonPlugins,
            'uglifyJsPlugin': plugins.uglifyJsPlugin(),
        };
        this.plugins = getDataFromEnv(commonPlugins, {
            [ENV_TYPES.development]: devPlugins,
            [ENV_TYPES.production]: prdPlugins,
        })
    }

    _initEnties() {
        this.defaultAppEntry = getDataFromEnv([], {
            [ENV_TYPES.development]: [
                `webpack-dev-server/client?${getDevServer()}`, // Automatic Refresh ，支持在浏览器console显示Refresh compile信息
                'react-dev-utils/webpackHotDevClient', // 使用增强的hotDevClient（带报错overlay）
            ],
            [ENV_TYPES.production]: [],
        });
        this.defaultVendorEntry = getDataFromEnv([
            'babel-regenerator-runtime'
        ])
    }

    make() {
        const dipConfig = getService(SERVICE_NAMES.dipConfig);

        this.finalWebpackConfig = {
            node: {
                // 避免某些npm包（例如browserslist）的代码中使用了node的fs模块，
                // 但是在浏览器环境中是没有fs模块的，导致浏览器中抛错
                console: true,
                fs: 'empty',
                net: 'empty',
                tls: 'empty',
            },
            entry: {
                app: [...this.defaultAppEntry, ...dipConfig.appEntry],
                vendors: [...this.defaultVendorEntry, ...dipConfig.vendorEntry]
            },
            devServer: { // 传递给webpack-dev-server的配置
                // overlay: true // 增加报错浮层
            },
            output: {
                path: dipConfig.distPath,
                publicPath: dipConfig.publicPath,
                filename: '[name].[chunkhash].js',
                // 不能是 [name].[chunkhash].js.map 否则sourcemap会不正确
                // 因为sourcemap不仅仅是js，还有css的。 [file]就相当于前面的filename
                sourceMapFilename: "[file].map",
                chunkFilename: "chunk.[name].[id].[chunkhash].js"
            },
            module: {
                rules: [],
            },
            plugins: [],
        };


        this.finalWebpackConfig.module.rules = [
            ...this.finalWebpackConfig.module.rules,
            ...Object.values(this.rules),
        ];
        this.finalWebpackConfig.plugins = [
            ...this.finalWebpackConfig.plugins,
            ...Object.values(this.plugins),
        ];

        // console.log(this.finalWebpackConfig.plugins);

        if (dipConfig.sourceMap) {
            this.merge({
                devtool: isProductionEnv() ? 'source-map' : 'cheap-module-source-map'
            });
        }

        return this;
    }

    merge(myWebpackConfig) {
        webpackMerge(this.finalWebpackConfig, myWebpackConfig);
        return this;
    }

    getWebpackConfig() {
        return this.finalWebpackConfig;
    }
}

export {
    DipWebpackConfigMaker,
}