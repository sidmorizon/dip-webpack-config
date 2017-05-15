/**
 * Created by zuozhuo on 2017/5/15.
 */
import {getDataFromEnv} from './utils';
import {getService, SERVICE_NAMES} from './bottle';

function getDefaultWebpackConfig() {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);
    return getDataFromEnv({
        devtool: undefined,
        cache: true,
        node: {
            // 避免某些npm包（例如browserslist）的代码中使用了node的fs模块，
            // 但是在浏览器环境中是没有fs模块的，导致浏览器中抛错
            console: true,
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
        },
        entry: {
            app: [],
            vendors: [],
        },
        devServer: {
            // 传递给webpack-dev-server的配置
            // overlay: true // 增加报错浮层
        },
        output: {
            path: null,
            publicPath: null,
            filename: dipConfig.hash ? '[name].[chunkhash].js' : '[name].js',
            // 不能是 [name].[chunkhash].js.map 否则sourcemap会不正确
            // 因为sourcemap不仅仅是js，还有css的。 [file]就相当于前面的filename
            sourceMapFilename: '[file].map',
            chunkFilename: dipConfig.hash ? 'chunk.[name].[id].[chunkhash].js' : 'chunk.[name].[id].js',
        },

        module: {
            // keep empty array here
            rules: [],
        },
        // keep empty array here
        plugins: [],
    });
}


export {
    getDefaultWebpackConfig,
};

