/**
 * Created by zuozhuo on 2017/5/10.
 */
import Path from 'path';
import webpackMerge from 'webpack-merge';
import assert from 'assert';
import deepExtend from 'deep-extend';
import defaultDipConfig from './defaultDipConfig';
import {clearService, setService, getService, SERVICE_NAMES} from './bottle';
import * as loaderRules from './loaderRules';
import * as plugins from './plugins';
import {getDataFromEnv, isProductionEnv} from './utils';
import {ENV_TYPES} from './consts';
import {getDefaultWebpackConfig} from './getDefaultWebpackConfig';


function getDevServer() {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);

    const HOST = '0.0.0.0';
    const PORT = process.env.PORT || 8080;
    const DEV_SERVER = `${dipConfig.https ? 'https' : 'http'}://${HOST}:${PORT}`;
    return DEV_SERVER;
}

const ALL_PLUGIN_NAMES = {
    commonsChunkPlugin: 'commonsChunkPlugin',
    htmlWebpackPlugin: 'htmlWebpackPlugin',
    inlineChunkWebpackPlugin: 'inlineChunkWebpackPlugin',
    definePlugin: 'definePlugin',
    loaderOptionsPlugin: 'loaderOptionsPlugin',
    cssExtract: 'cssExtract',
    scssExtract: 'scssExtract',
    cssModulesExtract: 'cssModulesExtract',
    circularDependencyPlugin: 'circularDependencyPlugin',
    friendlyErrorsWebpackPlugin: 'friendlyErrorsWebpackPlugin',
    hotModuleReplacementPlugin: 'hotModuleReplacementPlugin',
    uglifyJsPlugin: 'uglifyJsPlugin',
    babiliWebpackPlugin: 'babiliWebpackPlugin',
};
const ALL_LOADER_RULE_NAMES = {
    htmlLoaderRule: 'htmlLoaderRule',
    externalHtmlLoaderRule: 'externalHtmlLoaderRule',
    jsLoaderRule: 'jsLoaderRule',
    sassLoaderRule: 'sassLoaderRule',
    moduleSassLoaderRule: 'moduleSassLoaderRule',
    cssLoaderRule: 'cssLoaderRule',
    fileUrlLoaderRule: 'fileUrlLoaderRule',
    eslintLoaderRule: 'eslintLoaderRule',
};

class DipWebpackConfigMaker {
    rules = {};
    plugins = {};
    finalWebpackConfig = null;
    defaultAppEntry = [];
    defaultVendorEntry = [];

    constructor(myDipConfig) {
        this._initEnv();
        this._setDipConfig(myDipConfig);
        this._initLoaderRules();
        this._initPlugins();
        this._initEnties();
    }

    _initEnv() {
        if (!process.env.NODE_ENV) {
            // reset NODE_ENV to development if not set before
            process.env.NODE_ENV = ENV_TYPES.development;
        }
        clearService();
    }

    _setDipConfig(myDipConfig) {
        const _dipConfig = deepExtend({}, defaultDipConfig, myDipConfig);
        if (!Path.isAbsolute(_dipConfig.distPath)) {
            //  将distPath纠正为绝对物理路径，避免webpack报错
            _dipConfig.distPath = Path.join(process.cwd(), _dipConfig.distPath);
        }
        const getDeepConfigSerivce = () => _dipConfig;
        setService(SERVICE_NAMES.dipConfig, getDeepConfigSerivce);
    }

    _initLoaderRules() {
        const commonRules = {
            [ALL_LOADER_RULE_NAMES.htmlLoaderRule]: loaderRules.htmlLoaderRule(),
            [ALL_LOADER_RULE_NAMES.externalHtmlLoaderRule]: loaderRules.externalHtmlLoaderRule(),
            [ALL_LOADER_RULE_NAMES.jsLoaderRule]: loaderRules.jsLoaderRule(),
            [ALL_LOADER_RULE_NAMES.sassLoaderRule]: loaderRules.sassLoaderRule(),
            [ALL_LOADER_RULE_NAMES.moduleSassLoaderRule]: loaderRules.moduleSassLoaderRule(),
            [ALL_LOADER_RULE_NAMES.cssLoaderRule]: loaderRules.cssLoaderRule(),
            [ALL_LOADER_RULE_NAMES.fileUrlLoaderRule]: loaderRules.fileUrlLoaderRule(),
        };
        const devRules = deepExtend({}, commonRules, {
            [ALL_LOADER_RULE_NAMES.eslintLoaderRule]: loaderRules.eslintLoaderRule(),
        });
        const prdRules = deepExtend({}, commonRules, {});

        this.rules = getDataFromEnv(commonRules, {
            [ENV_TYPES.development]: devRules,
            [ENV_TYPES.production]: prdRules,
        });
    }

    _initPlugins() {
        const commonPlugins = {
            [ALL_PLUGIN_NAMES.loaderOptionsPlugin]: plugins.loaderOptionsPlugin(),
            [ALL_PLUGIN_NAMES.commonsChunkPlugin]: plugins.commonsChunkPlugin(),
            [ALL_PLUGIN_NAMES.htmlWebpackPlugin]: plugins.htmlWebpackPlugin(),
            [ALL_PLUGIN_NAMES.inlineChunkWebpackPlugin]: plugins.inlineChunkWebpackPlugin(),
            [ALL_PLUGIN_NAMES.definePlugin]: plugins.definePlugin(),
            [ALL_PLUGIN_NAMES.cssExtract]: plugins.extractTextPlugins().cssExtract,
            [ALL_PLUGIN_NAMES.scssExtract]: plugins.extractTextPlugins().scssExtract,
            [ALL_PLUGIN_NAMES.cssModulesExtract]: plugins.extractTextPlugins().cssModulesExtract,
        };
        const devPlugins = {
            ...commonPlugins,
            [ALL_PLUGIN_NAMES.circularDependencyPlugin]: plugins.circularDependencyPlugin(),
            [ALL_PLUGIN_NAMES.friendlyErrorsWebpackPlugin]: plugins.friendlyErrorsWebpackPlugin(),
            [ALL_PLUGIN_NAMES.hotModuleReplacementPlugin]: plugins.hotModuleReplacementPlugin(),
        };
        const prdPlugins = {
            ...commonPlugins,
            // because uglifyJS DOES NOT strip class codes in tree-shaking
            // change to babiliWebpackPlugin to strip unused var\function\class in tree-shaking
            // [ALL_PLUGIN_NAMES.babiliWebpackPlugin]: plugins.babiliWebpackPlugin(),
            [ALL_PLUGIN_NAMES.uglifyJsPlugin]: plugins.uglifyJsPlugin(),
        };
        this.plugins = getDataFromEnv(commonPlugins, {
            [ENV_TYPES.development]: devPlugins,
            [ENV_TYPES.production]: prdPlugins,
        });
    }

    _initEnties() {
        this.defaultAppEntry = getDataFromEnv([], {
            [ENV_TYPES.development]: [
                `webpack-dev-server/client?${getDevServer()}`, // Automatic Refresh ，支持在浏览器console显示Refresh compile信息
                'react-dev-utils/webpackHotDevClient', // 使用增强的hotDevClient（带报错overlay）
            ],
            [ENV_TYPES.production]: [],
        });
        this.defaultVendorEntry = getDataFromEnv([]);
    }

    removeRules(ruleName) {
        assert.ok(!this.finalWebpackConfig, 'you should run removeRules() before make()');
        if (ruleName) {
            delete this.rules[ruleName];
        }
        return this;
    }

    removePlugins(pluginName) {
        assert.ok(!this.finalWebpackConfig, 'you should run removePlugins() before make()');
        if (pluginName) {
            delete this.plugins[pluginName];
        }
        return this;
    }

    make() {
        const dipConfig = getService(SERVICE_NAMES.dipConfig);

        this.finalWebpackConfig = getDefaultWebpackConfig();

        if (dipConfig.sourceMap) {
            this.merge({
                devtool: isProductionEnv() ? 'source-map' : 'cheap-module-source-map',
            });
        }

        const entrySection = this.finalWebpackConfig.entry;
        entrySection.app = [...this.defaultAppEntry, ...dipConfig.appEntry];
        if (entrySection.app.length <= 0) {
            delete entrySection.app;
        }
        entrySection.vendors = [...this.defaultVendorEntry, ...dipConfig.vendorEntry];
        if (entrySection.vendors.length <= 0) {
            delete entrySection.vendors;
        }

        this.finalWebpackConfig.output.path = dipConfig.distPath;
        this.finalWebpackConfig.output.publicPath = dipConfig.publicPath;

        this.finalWebpackConfig.module.rules = [
            ...Object.values(this.rules),
        ];
        console.log(`\nApply rules: \n- ${Object.keys(this.rules).join('\n- ')} `);

        this.finalWebpackConfig.plugins = [
            ...Object.values(this.plugins),
        ];
        console.log(`\nApply plugins: \n- ${Object.keys(this.plugins).join('\n- ')} \n`);

        return this;
    }

    merge(myWebpackConfig) {
        assert.ok(this.finalWebpackConfig, 'please run make() first.');

        this.finalWebpackConfig = webpackMerge(this.finalWebpackConfig, myWebpackConfig);
        return this;
    }

    output() {
        assert.ok(this.finalWebpackConfig, 'please run make() first.');

        return this.finalWebpackConfig;
    }
}

export {
    DipWebpackConfigMaker,
    ALL_PLUGIN_NAMES,
    ALL_LOADER_RULE_NAMES,
};

