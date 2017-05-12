/**
 * Created by zuozhuo on 2017/5/10.
 */
const postCssPlugins = require('./lib/postCssPlugins');

module.exports = {
    sourceMap: true, // 只能设置 true | inline 不能设置false
    // TODO 将post-css的plugin加入到这里（autoPrefix、pxtorem等）
    plugins: postCssPlugins, // 这里不能使用plugin属性，请在后面的 postcss 属性配置
    // parser: 'postcss-scss' // 如果需要使用 precss，需要设置这个parser
};
