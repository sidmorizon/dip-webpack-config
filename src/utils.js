/**
 * Created by zuozhuo on 2017/5/9.
 */

import {ENV_TYPES} from './consts';

function getDataFromEnv(data, allEnvData) {
    const currentEnv = process.env.NODE_ENV;

    let dataEnvSpecific;
    if (currentEnv && allEnvData && allEnvData[currentEnv]) {
        dataEnvSpecific = allEnvData[currentEnv];
    }

    return dataEnvSpecific || data;
}

function isProductionEnv() {
    return process.env.NODE_ENV === ENV_TYPES.production;
}


export {
    getDataFromEnv,
    isProductionEnv,
};

