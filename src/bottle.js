/**
 * Created by zuozhuo on 2017/5/9.
 */
import Bottle from 'bottlejs';

const BOTTLE_INSTANCE_NAME = 'GLOBAL';

const bottle = new Bottle(BOTTLE_INSTANCE_NAME);
const SERVICE_NAMES = {
    dipConfig: 'dipConfig',
};

function setService(serviceName, serviceImplement) {
    Bottle.pop(BOTTLE_INSTANCE_NAME).service(serviceName, serviceImplement);
}
function getService(serviceName) {
    return Bottle.pop(BOTTLE_INSTANCE_NAME).container[serviceName];
}
function clearService() {
    Bottle.clear(BOTTLE_INSTANCE_NAME);
}


export {
    bottle,
    setService,
    getService,
    clearService,
    SERVICE_NAMES,
};

