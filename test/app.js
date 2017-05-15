/**
 * Created by zuozhuo on 2017/5/10.
 */
// app.scss import
import './app.scss';
import React from 'react';
import {moduleAConstName, getModuleBName} from './components'
import cssModuleClassNames from './app.module.scss';


window.LOGIN_USER = {firstName: 'foo', lastName: 'bar', age: 21, role: 'client'};
window.ADMIN_USER = {...window.LOGIN_USER, role: 'admin'};
// console.log('hello')


window.importChunkA = function () {
    return import('./chunkA.js')
        .then(function () {
            console.log(window.CHUNK_A);
        })
        .catch(function (err) {
            console.log('Failed to load ./chunkA.js', err);
        });
};
window.importChunkB = function () {
    return import('./chunkB.js')
        .then(function () {
            console.log(window.CHUNK_B);
        })
        .catch(function (err) {
            console.log('Failed to load ./chunkA.js', err);
        });
};

if (process.env.NODE_ENV !== 'production') {
    window.IS_DEBUG_NODE_ENV = true;
}

class ReactHello extends React.Component {
    static propTypes = {
        Name: React.PropTypes.string.isRequired,
    };
    static defaultProps = {
        Name: 'hello world'
    };

    render() {
        return (
            <div>ReactHello</div>
        )
    }
}
window.ReactHello = ReactHello;
window.moduleAConstName = moduleAConstName;
window.getModuleBName = getModuleBName;
window.cssModuleClassNames  = cssModuleClassNames;
