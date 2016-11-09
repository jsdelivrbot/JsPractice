/**
 * myJq.js
 *
 * v 0.0.1
 *
 * Created by xiepan on 2016/10/19 11:13.
 */

//IIFE  立即执行函数表达式 模拟块作用域 立即执行 独立模块，防止命名冲突，解耦。
(function (global, factory) {
    // https://segmentfault.com/a/1190000003732752
    // AMD 规范中，define 函数同样有一个公有属性 define.amd。
    // AMD 中的参数便是这个模块的依赖。那么如何在 AMD 中提供接口呢？
    // 它是返回一个对象，这个对象就作为这个模块的接口
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(global)
        });
    } else {
        factory(global)
    }
})(this, function (window) {

    var VERSION = 'v0.0.1';

    // IIFE http://weizhifeng.net/immediately-invoked-function-expression.html
    var gQuery = (function () {
        var core = {};
        var $,
            document = window.document,
            emptyArray = [],
            slice = emptyArray.slice,
            simpleSelectorRE = /^[\w-]*$/;

        // core.Z = function (dom, selector) {
        //     return new Z(dom, selector)
        // };
        //
        // function Z(dom, selector) {
        //     var i, len = dom ? dom.length : 0;
        //     for (i = 0; i < len; i++) this[i] = dom[i];
        //     this.length = len;
        //     this.selector = selector || '';
        //     console.log('function Z(dom, selector) {...}:\n  length: ' + this.length + ' selector: ' + this.selector);
        // }
        core.Z = function (dom, selector) {
            dom = dom || [];
            // 通过给 dom 设置__proto__属性指向$.fn来达到继承$.fn上所有方法的目的
            dom.__proto__ = $.fn;
            dom.selector = selector || '';
            return dom;
        };

        // 查询选择器
        core.querySelector = function (element, selector) {
            var found,
                // 是否是 id选择器
                maybeID = selector[0] == '#',
                // 是否是 class选择器
                maybeClass = !maybeID && selector[0] == '.',
                // 去掉选择器前的符号，并确保一个 1个字符的标签名 仍被检查
                nameOnly = (maybeID || maybeClass) ? selector.slice(1) : selector,
                // 是否是 简单选择器
                isSimple = simpleSelectorRE.test(nameOnly);

            console.log('maybeID: ' + maybeID + ', maybeClass: ' + maybeClass + ', nameOnly: ' + nameOnly + ', isSimple: ' + isSimple);
            // Safari DocumentFragment doesn't have getElementById
            return (element.getElementById && isSimple && maybeID) ?
                // 如果是 id选择器
                ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
                // 1Element元素节点 9Document文档节点 11DocumentFragment节点
                (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
                    // 将 NodeList转成数组
                    slice.call(
                        // DocumentFragment doesn't have getElementsByClassName/TagName
                        (isSimple && !maybeID && element.getElementsByClassName ) ?
                            // If it's simple, it could be a class 如果是 class选择器
                            (maybeClass ? element.getElementsByClassName(nameOnly) :
                                // Or a tag 如果是标签
                                element.getElementsByTagName(selector)) :
                            // Or it's not simple, and we need to query all
                            // 返回当前文档中匹配一个特定选择器的所有的元素(使用深度优先，前序遍历规则这样的规则遍历所有文档节点)
                            // 返回的对象类型是 NodeList.
                            element.querySelectorAll(selector)
                    )
        };


        core.init = function (selector, context) {
            var dom;
            if (typeof selector == 'string') {
                selector = selector.trim();

                if (context !== undefined) {
                    //TODO
                    console.log("context is not supported in " + VERSION + context);
                }
                // If it's a CSS selector, use it to select nodes.
                else dom = core.querySelector(document, selector)
            }
            console.log(dom);
            return core.Z(dom, selector)
            // return 'example';
        };

        $ = function (selector, context) {
            return core.init(selector, context)
        };


        $.trim = function (str) {
            return str == null ? "" : String.prototype.trim.call(str)
        };

        $.fn = {
            constructor: core.Z,
            length: 0,

            // Because a collection acts like an array
            // copy over these useful array functions.
            forEach: emptyArray.forEach,
            reduce: emptyArray.reduce,
            push: emptyArray.push,
            sort: emptyArray.sort,
            splice: emptyArray.splice,
            indexOf: emptyArray.indexOf,
            size: function () {
                return this.length
            },
        };

        core.Z.prototype = Z.prototype = $.fn;

        return $;
    }());


    window.gQuery = gQuery;
    // 如果未定义 $ 则赋值为CORE,防止冲突
    window.$ === undefined && (window.$ = gQuery);
});