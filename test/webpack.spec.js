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

    it('sass extract correctly', () => {
        expect(fileContainsText('./dist-prepare/scss.css', '#117366')).toBe(true);
    });

    it('postcss:autoprefixer works', () => {
        expect(fileContainsText('./dist-prepare/scss.css', '-webkit-box-flex')).toBe(true);
    });

    it('tree shaking', () => {
        // tree shaking will always pack class defines
        expect(fileContainsText('./dist-prepare/app.js', 'ModuleAClass')).toBe(true);
        expect(fileContainsText('./dist-prepare/app.js', 'ModuleBClass')).toBe(true);

        // pack modules that we have imported
        expect(window.moduleAConstName).toBe('moduleAConstName');
        expect(window.getModuleBName()).toBe('getModuleBName');

        // DO NOT pack modules that we DONT import
        expect(fileContainsText('./dist-prepare/app.js', 'getModuleAName')).toBe(false);
        expect(fileContainsText('./dist-prepare/app.js', 'moduleBConstName')).toBe(false);
    });

    it('css module', () => {
        expect(fs.existsSync(getFile('./dist-prepare/css-modules.css'))).toBe(true);
        expect(fileContainsText('./dist-prepare/css-modules.css', '#4f7a99')).toBe(true);
        expect(fileContainsText('./dist-prepare/css-modules.css', '16.48862px')).toBe(true);
        expect(window.cssModuleClassNames['i-am-module-css']).toBeTruthy();
    });

    it('es module & commonjs module', () => {
        expect(window.commonJsRequireEsModule1).toEqual({
            "default": "esModule1-default",
            "esModule1Age": "esModule1-age",
            "esModule1Name": "esModule1-name"
        });
        expect(window.commonJS1Name).toBe("commonJS1-Name");
        expect(window.commonJS1Age).toBe("commonJS1-Age");
        expect(window.commonJS2).toBe('commonJS2');
        expect(window.esModule1Default).toBe("esModule1-default");
        expect(window.esModule1Name).toBe("esModule1-name");
        expect(window.esModule1Age).toBe("esModule1-age");
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
