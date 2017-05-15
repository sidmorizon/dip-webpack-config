/**
 * Created by zuozhuo on 2017/5/15.
 */

import React from 'react';
import {Name, Age} from './commonJS1';
import commonJS2 from './commonJS2';
import esModule1Default, {esModule1Name, esModule1Age} from './esModule1';

const getModuleAName = () => 'getModuleAName';

const moduleAConstName = 'moduleAConstName';

class ModuleAClass extends React.Component {

    render() {
        return (
            <div>ModuleAClass</div>
        )
    }

}

window.commonJS1Name = Name;
window.commonJS1Age = Age;
window.commonJS2 = commonJS2;
window.esModule1Default = esModule1Default;
window.esModule1Name = esModule1Name;
window.esModule1Age = esModule1Age;

export {
    ModuleAClass,
    getModuleAName,
    moduleAConstName,
}