/**
 * Created by zuozhuo on 2017/5/10.
 */


import * as loaderChains from './loaderChains';
import * as plugins from './plugins';

const eslintLoaderRule = () => {
    return {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: loaderChains.eslintLoaderChain(),
    };
};

const htmlLoaderRule = () => {
    return {
        test(filePath) {
            return (/\.html$/).test(filePath) && !(/\.external\.html$/).test(filePath);
        },
        use: loaderChains.htmlLoaderChain(),
    };
};

const externalHtmlLoaderRule = () => {
    return {
        test: /\.external\.html$/,
        use: loaderChains.externalHtmlLoaderChain(),
    };
};

const jsLoaderRule = () => {
    return {
        test: /\.js$/,
        exclude: [
            // 排除非node_modules/xmui的node_modules
            // /node_modules\/(?!xmui)/
            /node_modules/,
        ],
        use: loaderChains.jsLoaderChain(),
    };
};

const sassLoaderRule = () => {
    return {
        test(filePath) {
            return (/\.scss$/).test(filePath) && !(/\.module\.scss$/).test(filePath);
        },
        use: plugins.extractTextPlugins.scssExtract.extract({
            fallback: loaderChains.styleLoaderChain(),
            use: loaderChains.sassLoaderChain(),
        }),
    };
};

const moduleSassLoaderRule = () => {
    return {
        test: /\.(scss-m|module\.scss)$/,
        use: plugins.extractTextPlugins.cssModulesExtract.extract({
            fallback: loaderChains.styleLoaderChain(),
            use: loaderChains.moduleSassLoaderChain(),
        }),
    };
};

const cssLoaderRule = () => {
    return {
        test: /\.css$/,
        use: plugins.extractTextPlugins.cssExtract.extract({
            fallback: loaderChains.styleLoaderChain(),
            use: loaderChains.cssLoaderChain(),
        }),
    };
};

const fileUrlLoaderRule = () => {
    return {
        test: /\.(png|jpe?g|ico|otf|gif|svg|woff|ttf|eot)$/,
        use: loaderChains.fileUrlLoaderChain(),
    };
};

export {
    eslintLoaderRule,
    htmlLoaderRule,
    externalHtmlLoaderRule,
    jsLoaderRule,
    sassLoaderRule,
    moduleSassLoaderRule,
    cssLoaderRule,
    fileUrlLoaderRule,
};
