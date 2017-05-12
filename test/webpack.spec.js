/**
 * Created by zuozhuo on 2017/5/12.
 */
const webpack = require('webpack');
const shelljs = require('shelljs');
const fs = require('fs');
const Path = require('path');
const jsdom = require('jsdom');

function getFile(filePath) {
    return Path.join(__dirname, filePath);
}
function outputFileExists(filePath) {
    return fs.existsSync(getFile(filePath));
}
function fileContainsText(filePath, text) {
    filePath = Path.isAbsolute(filePath) ? filePath : getFile(filePath);
    const content = fs.readFileSync(filePath);
    return content.indexOf(text) >= 0
}
function loadHtml() {
    const htmlSource = fs.readFileSync(getFile('./dist-prepare/index.html'));
    const _document = jsdom.jsdom(htmlSource, {
        url: 'http://www.baidu.com',
        features: {
            FetchExternalResources: ['script'],
            ProcessExternalResources: ['script'],
            MutationEvents: '2.0',
            QuerySelector: true,
        },
        parsingMode: "auto",
        created: function (error, window) {
            console.log('----------------------------------------------------');
            console.log(typeof window.XM_GIT_COMMIT_HASH); // always undefined
            console.log(_document.documentElement.innerHTML);
        }
    });
    const _window = _document.defaultView;
    return _window;
}

function initWebpackGlobalsEnv() {
    const htmlSource = fs.readFileSync(getFile('./dist-prepare/index.html'));
    const _document = jsdom.jsdom(htmlSource, {
        features: {
            FetchExternalResources: ['script'],
            ProcessExternalResources: ['script'],
        }
    });

    const allScripts = _document.querySelectorAll('script');
    for (let _script of allScripts) {
        if (_script.innerHTML) {
            eval(_script.innerHTML);
        }
    }

    require('./dist-prepare/vendors.js');
    require('./dist-prepare/app.js');
}

function runCompile(env) {
    process.env.NODE_ENV = env;

    shelljs.exec('rm -rf test/dist-prepare');
    const shellResult = shelljs.exec('yarn compile');
    initWebpackGlobalsEnv();
    return shellResult;
}

describe('Compile webpack as NODE_ENV=production', () => {

    const shellResult = runCompile('production');

    it('compile success', () => {
        expect(shellResult.code).toBe(0);
    });

    it('output files', () => {
        expect(outputFileExists('./dist-prepare/app.js')).toBeTruthy();
        expect(outputFileExists('./dist-prepare/app.js.map')).toBeTruthy();
        expect(outputFileExists('./dist-prepare/vendors.js')).toBeTruthy();
        expect(outputFileExists('./dist-prepare/vendors.js.map')).toBeTruthy();
        expect(outputFileExists('./dist-prepare/index.html')).toBeTruthy();
        expect(outputFileExists('./dist-prepare/manifest.js')).toBeTruthy();
        expect(outputFileExists('./dist-prepare/manifest.js.map')).toBeTruthy();
        expect(outputFileExists('./dist-prepare/scss.css')).toBeTruthy();
        expect(outputFileExists('./dist-prepare/scss.css.map')).toBeTruthy();
    });

    it('js global vars', () => {

        // const _window = loadHtml();
        // console.log(_window.document.documentElement.innerHTML);

        expect(window.webpackJsonp).toBeTruthy();
        expect(window.LOGIN_USER.role).toEqual('client');
        expect(window.ADMIN_USER.role).toEqual('admin');
        expect(typeof window.importChunkA).toEqual('function');
        expect(typeof window.importChunkB).toEqual('function');

    });

    it('code split', () => {
        expect(fileContainsText('./dist-prepare/chunk.1.1.js', 'window.CHUNK_A="CHUNK_A"')).toBe(true);
        expect(fileContainsText('./dist-prepare/chunk.0.0.js', 'window.CHUNK_B="CHUNK_B"')).toBe(true);
    });

    it('strip debug env code', () => {
        expect(fileContainsText('./dist-prepare/app.js', 'window.IS_DEBUG_NODE_ENV')).toBe(false);
        expect(window.IS_DEBUG_NODE_ENV).toBe(undefined);
    });

    it('strip react propType', () => {
        expect(window.ReactHello).toBeTruthy();
        expect(window.ReactHello.propTypes).toBeFalsy();
    });

    it('no react warning code', () => {
        const searchText = 'You are manually calling a React.PropTypes validation';
        expect(fileContainsText(require.resolve('react/dist/react.js'), searchText))
            .toBe(true);
        expect(fileContainsText('./dist-prepare/vendors.js', searchText))
            .toBe(false);
    });

    it('vendors.js contains React source', () => {
        // prototype.isReactComponent
        expect(fileContainsText('./dist-prepare/vendors.js', 'prototype.isReactComponent')).toBe(true);
        expect(fileContainsText('./dist-prepare/vendors.js', 'prototype.setState')).toBe(true);
        expect(fileContainsText('./dist-prepare/vendors.js', 'prototype.forceUpdate')).toBe(true);
    });

    it('app.js DOES NOT contains React source', () => {
        // prototype.isReactComponent
        expect(fileContainsText('./dist-prepare/app.js', 'prototype.isReactComponent')).toBe(false);
        expect(fileContainsText('./dist-prepare/app.js', 'prototype.setState')).toBe(false);
        expect(fileContainsText('./dist-prepare/app.js', 'prototype.forceUpdate')).toBe(false);
    });


});
/*

 describe('Compile webpack as NODE_ENV=development', () => {

 runCompile('development');

 it('debug env code exists', () => {
 expect(fileContainsText('./dist-prepare/app.js', 'window.IS_DEBUG_NODE_ENV')).toBe(true);
 expect(window.IS_DEBUG_NODE_ENV).toBe(true);
 });
 });

 */
