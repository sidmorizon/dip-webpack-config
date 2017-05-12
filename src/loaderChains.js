/**
 * Created by zuozhuo on 2017/5/9.
 */


import * as loaders from './loaders';
import {getDataFromEnv, isProductionEnv} from './utils';
import {ENV_TYPES} from './consts';
import {getService, SERVICE_NAMES} from './bottle';


const moduleSassLoaderChain = () => {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);
    let localIdentName = '[path]--[name]-[ext]__[local]';
    if (dipConfig.hash) {
        localIdentName = isProductionEnv() ? '[hash:base64]' : '[path]--[name]-[ext]__[local]-[hash:base64:5]';
    }

    return getDataFromEnv([
        loaders.cssLoaderCreator({
            autoprefixer: false,
            restructuring: false,
            importLoaders: 1,
            modules: true,
            localIdentName,
        }),
        loaders.postCssLoaderCreator(),
        loaders.resolveUrlLoaderCreator({
            sourceMap: dipConfig.sourceMap,
        }),
        loaders.sassLoaderCreator({
            sourceMap: dipConfig.sourceMap,
        }),
    ]);
};

const cssLoaderChain = () => {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);

    return getDataFromEnv([
        loaders.cssLoaderCreator({
            autoprefixer: false,
            restructuring: false,
            sourceMap: dipConfig.sourceMap,
        }),
        loaders.postCssLoaderCreator(),
    ]);
};

const styleLoaderChain = () => {
    return getDataFromEnv([
        loaders.styleLoaderCreator(),
    ]);
};

const sassLoaderChain = () => {
    const dipConfig = getService(SERVICE_NAMES.dipConfig);

    return getDataFromEnv([
        ...cssLoaderChain(),
        loaders.resolveUrlLoaderCreator({
            sourceMap: dipConfig.sourceMap,
        }),
        loaders.sassLoaderCreator({
            sourceMap: dipConfig.sourceMap,
        }),
    ]);
};

const htmlLoaderChain = () => getDataFromEnv([
    loaders.htmlLoaderCreator(),
]);

const externalHtmlLoaderChain = () => getDataFromEnv([
    loaders.fileLoaderCreator(),
    loaders.extractLoaderCreator(),
    loaders.htmlLoaderCreator(),
]);

const jsLoaderChain = () => getDataFromEnv([
    loaders.babelLoaderCreator(),
], {
    [ENV_TYPES.development]: [
        // TODO 这个已经挪到babelrc中了
        // loaders.reactHotLoaderCreator(),
        loaders.babelLoaderCreator(),
    ],
    [ENV_TYPES.production]: [
        loaders.babelLoaderCreator(),
    ],
});

const fileUrlLoaderChain = () => getDataFromEnv([
    loaders.urlLoaderCreator(),
]);

const eslintLoaderChain = () => getDataFromEnv([
    loaders.eslintLoaderCreator(),
]);


export {
    moduleSassLoaderChain,
    cssLoaderChain,
    styleLoaderChain,
    sassLoaderChain,
    htmlLoaderChain,
    externalHtmlLoaderChain,
    jsLoaderChain,
    fileUrlLoaderChain,
    eslintLoaderChain,
};
