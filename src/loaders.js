/**
 * Created by zuozhuo on 2017/5/9.
 */
import deepExtend from 'deep-extend';
import eslintFriendlyFormatter from 'eslint-friendly-formatter';
// import resolveRc from 'babel-loader/lib/resolve-rc.js';
import {getDataFromEnv} from './utils';
import {getService, SERVICE_NAMES} from './bottle';


/*
 - loaders
 - loaderChains
 - loaderRules
 */

function loaderCreator(originLoader) {
    return (options = {}) => deepExtend({}, originLoader(), {options});
}

const postCssLoader = () => {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);

    return getDataFromEnv({
        loader: 'postcss-loader',
        options: {
            sourceMap: dipConfig.sourceMap,
        },
    });
};

const sassLoader = () => {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);
    return getDataFromEnv({
        loader: 'sass-loader',
        options: {
            sourceMap: dipConfig.sourceMap,
            ...dipConfig.loaderOptions.sassLoaderOption,
        },
    });
};

const cssLoader = () => {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);

    return getDataFromEnv({
        loader: 'css-loader',
        options: {
            autoprefixer: false,
            restructuring: false,
            sourceMap: dipConfig.sourceMap,
            ...dipConfig.loaderOptions.cssLoaderOption,
        },
    });
};

const styleLoader = () => getDataFromEnv({
    loader: 'style-loader',
    options: {},
});

const resolveUrlLoader = () => {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);

    return getDataFromEnv({
        loader: 'resolve-url-loader',
        options: {
            sourceMap: dipConfig.sourceMap,
        },
    });
};

const urlLoader = () => {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);

    return getDataFromEnv({
        loader: 'url-loader',
        options: {
            limit: 1000,
            name: dipConfig.hash ? '[path][name].[hash:8].[ext]' : '[path][name].[ext]',
        },
    });
};

const babelLoader = () => {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);

    // console.log(`\nApply babel config: ${resolveRc(process.cwd()+'/test')}`);

    return getDataFromEnv({
        loader: 'babel-loader',
        options: {
            sourceMap: dipConfig.sourceMap,
            cacheDirectory: true,
        },
    });
};

const tsLoader = () => {
    return getDataFromEnv({
        loader: 'ts-loader',
        options: {},
    });
};

const htmlLoader = () => getDataFromEnv({
    loader: 'html-loader',
    options: {
        ignoreCustomFragments: [
            /\{\{.*?\}\}/,
        ],
        minimize: false, // 开启html压缩后貌似编译报错,而且编译非常慢
        // 需要处理的图片和js\css的md5戳
        attrs: ['img:src', 'link:href', 'script:src'],
    },
});

const fileLoader = () => {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);

    return getDataFromEnv({
        loader: 'file-loader',
        options: {
            name: dipConfig.hash ? '[path][name].[hash:8].[ext]' : '[path][name].[ext]',
        },
    });
};

const extractLoader = () => getDataFromEnv({
    loader: 'extract-loader',
    options: {},
});

// Can't resolve 'react/lib/ReactMount'
// in '/Users/zuozhuo/workspace/zuozhuo/dip-webpack-config/test'
// react-hot-loader@next solve
const reactHotLoader = () => getDataFromEnv({
    loader: 'react-hot-loader',
    options: {},
});

const eslintLoader = () => getDataFromEnv({
    loader: 'eslint-loader',
    options: {
        formatter: eslintFriendlyFormatter,
    },
});

const postCssLoaderCreator = loaderCreator(postCssLoader);
const sassLoaderCreator = loaderCreator(sassLoader);
const cssLoaderCreator = loaderCreator(cssLoader);
const styleLoaderCreator = loaderCreator(styleLoader);
const babelLoaderCreator = loaderCreator(babelLoader);
const tsLoaderCreator = loaderCreator(tsLoader);
const resolveUrlLoaderCreator = loaderCreator(resolveUrlLoader);
const htmlLoaderCreator = loaderCreator(htmlLoader);
const fileLoaderCreator = loaderCreator(fileLoader);
const extractLoaderCreator = loaderCreator(extractLoader);
const reactHotLoaderCreator = loaderCreator(reactHotLoader);
const urlLoaderCreator = loaderCreator(urlLoader);
const eslintLoaderCreator = loaderCreator(eslintLoader);

export {
    postCssLoaderCreator,
    sassLoaderCreator,
    cssLoaderCreator,
    styleLoaderCreator,
    babelLoaderCreator,
    tsLoaderCreator,
    resolveUrlLoaderCreator,
    htmlLoaderCreator,
    fileLoaderCreator,
    extractLoaderCreator,
    reactHotLoaderCreator,
    urlLoaderCreator,
    eslintLoaderCreator,
};
