/**
 * Created by zuozhuo on 2017/5/9.
 */
import Path from 'path';
import {getDataFromEnv} from './utils';

export default getDataFromEnv({
    https: false,
    sourceMap: false,
    hash: true,
    appEntry: [],
    vendorEntry: [],
    commonChunks: [],
    htmlTpl: 'src/index.ejs',
    htmlPayload: {},
    publicPath: '/qn-dist/',
    distPath: Path.join(process.cwd(), 'dist-prepare'),

    loaderOptions: {
        sassLoaderOption: {
            // includePaths: [Path.join(process.cwd(), 'src/sass')],
        },
        cssLoaderOption: {
        },
    },
});

