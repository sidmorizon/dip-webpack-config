/**
 * Created by zuozhuo on 2017/2/10.
 */
'use strict'


function CustomJsonpMainTemplatePlugin() {
}
CustomJsonpMainTemplatePlugin.prototype.constructor = CustomJsonpMainTemplatePlugin;
CustomJsonpMainTemplatePlugin.prototype.apply = function (mainTemplate) {

    // console.log('----------------------------------------------------',mainTemplate._plugins['require-ensure'].toString())
    var newRequireEnsureTpl = function (_, chunk, hash) {
        var filename = this.outputOptions.filename || "bundle.js";
        var chunkFilename = this.outputOptions.chunkFilename || "[id]." + filename;
        return this.asString([
            "var triggerCustomEvent = function (eventName,eventParams) {" ,
            "    var event;" ,
            "    if (window.CustomEvent) " ,
            "    { " ,
            "        event = new CustomEvent(eventName, {detail: eventParams});  " ,
            "    } else {  " ,
            "        event = document.createEvent('CustomEvent');  " ,
            "        event.initCustomEvent(eventName, true, true, eventParams); " ,
            "    }" ,
            "    document.dispatchEvent(event); " ,
            "};",

            "// \"0\" is the signal for \"already loaded\"",

            "if(installedChunks[chunkId] === 0)",
            this.indent("return callback.call(null, " + this.requireFn + ");"),
            "",
            "// an array means \"currently loading\".",
            "if(installedChunks[chunkId] !== undefined) {",
            this.indent("installedChunks[chunkId].push(callback);"),
            "} else {",
            this.indent([
                "// start chunk loading",
                "installedChunks[chunkId] = [callback];",
                "var head = document.getElementsByTagName('head')[0];",
                this.applyPluginsWaterfall("jsonp-script", "", chunk, hash),
                "script.onload=function(){ triggerCustomEvent('webpackChunkLoaded'); };",
                "head.appendChild(script);",
                "triggerCustomEvent('webpackChunkLoading');"
            ]),
            "}"
        ]);
    };

    mainTemplate.plugin("require-ensure", newRequireEnsureTpl);
    // mainTemplate._plugins['require-ensure'] = [newRequireEnsureTpl];
    // console.log('=====================================', mainTemplate._plugins['require-ensure'].toString())

};







// WebpackOptionsApply -> JsonpTemplatePlugin -> JsonpMainTemplatePlugin -> "require-ensure"
function ChunkLoadingEventPlugin() {
}
ChunkLoadingEventPlugin.prototype.constructor = ChunkLoadingEventPlugin;
ChunkLoadingEventPlugin.prototype.apply = function (compiler) {
    var compileTarget = compiler.options.target;
    if (["web", "node-webkit", "electron-renderer"].indexOf(compileTarget) > -1) {
        // TODO 这里可能有个bug，在编译index.html时，使用的是NodeMainTemplatePlugin的"require-ensure"也被改成下面这个了
        compiler.plugin("compilation", function (compilation) {
            compilation.mainTemplate.apply(new CustomJsonpMainTemplatePlugin());
        });
    }
};


module.exports = ChunkLoadingEventPlugin;