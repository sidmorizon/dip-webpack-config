/**
 * Created by zuozhuo on 2017/5/10.
 */

const dip = require("../lib/index.js");
const Path = require('path');


const cfg = new dip.DipWebpackConfigMaker({
    https: false,
    sourceMap: false,
    appEntry: ['./test/entry.js'],
    vendorEntry: [],
    commonChunks: [],
    htmlTpl: './test/index.ejs',
    publicPath: '/qn-dist/',
    distPath: Path.join(process.cwd(), 'test/dist-prepare'),

    loaderOptions: {
        sassLoaderOption: {
            // TODO 这里有依赖，后面考虑拆分
            includePaths: [Path.join(process.cwd(), "src/sass")],
        }
    }
})
    .make()
    .getWebpackConfig();

// console.log(JSON.stringify(cfg,null,4));

module.exports = cfg;