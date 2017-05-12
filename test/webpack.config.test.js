/**
 * Created by zuozhuo on 2017/5/10.
 */

const dip = require("../lib/index.js");
const Path = require('path');

const initDipConfig = {
    https: false,
    sourceMap: true,
    hash: false,
    appEntry: ['./test/app.js'],
    vendorEntry: ['./test/vendor.js'],
    commonChunks: [],
    htmlTpl: './test/index.ejs',
    publicPath: './',
    distPath: './test/dist-prepare',

    loaderOptions: {
        sassLoaderOption: {
            // TODO 这里有依赖，后面考虑拆分
            includePaths: [Path.join(process.cwd(), "src/sass")],
        }
    }
};

const mergeWebpackConfig = {};

const maker = new dip.DipWebpackConfigMaker(initDipConfig)
    // .removeRules(dip.ALL_LOADER_RULE_NAMES.jsLoaderRule)
    // .removePlugins(dip.ALL_PLUGIN_NAMES.uglifyJsPlugin)
    .make()
    .merge(mergeWebpackConfig);

const cfg = maker.output();

// console.log(JSON.stringify(cfg, null, 4));

console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`);

module.exports = cfg;

