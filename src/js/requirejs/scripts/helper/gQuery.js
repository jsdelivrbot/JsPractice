/**
 * gQuery.js
 *
 * 参考 jQuery.js 和 zepto.js
 *
 * v 0.5.0
 *
 * Created by xiepan on 2016/10/19 11:13.
 */

//IIFE  立即执行函数表达式 模拟块作用域 立即执行 独立模块，防止命名冲突，解耦。
(function (global, factory) {
    /**
     * @link https://segmentfault.com/a/1190000003732752
     * AMD 规范中，define 函数同样有一个公有属性 define.amd。
     * AMD 中的参数便是这个模块的依赖。那么如何在 AMD 中提供接口呢？
     * 它是返回一个对象，这个对象就作为这个模块的接口
     */
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(global)
        });
    } else {
        factory(global)
    }
})(this, function (window) {

    var VERSION = 'v0.5.0';
    var printLog = false;
    var printNoSupportedLog = true;


    // 全局 LOG 方法
    /**
     * 更优雅的 log
     */
    function logNoSupported() {
        if (printNoSupportedLog) {
            //将类似数组转换成数组，返回的结果是真正的Array，这样就可以应用Array下的所有方法了
            var args = Array.prototype.slice.call(arguments);
            args.push(' is not supported in ' + VERSION);
            // log(args);
            console.log.apply(console, args);
        }
    }

    function log() {
        if (printLog) console.log.apply(console, arguments);
    }

    // gQuery 核心模块
    // IIFE http://weizhifeng.net/immediately-invoked-function-expression.html
    var gQuery = (function () {
            var core = {};
            var $,
                undefined,
                document = window.document,
                emptyArray = [],
                class2type = {},
                unique,
                toString = class2type.toString,
                slice = emptyArray.slice,
                concat = emptyArray.concat,
                /**
                 *  @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
                 */
                isArray = Array.isArray,
                filter = emptyArray.filter,
                simpleSelectorRE = /^[\w-]*$/,
                readyRE = /complete|loaded|interactive/,
                tempParent = document.createElement('div');

            ////////////////////////
            // 核心模块方法
            ////////////////////////

            /**
             * @link https://segmentfault.com/a/1190000002670622
             * 如果参数obj是undefined或null，则通过String(obj)转换为对应的原始字符串“undefined”或“null”，
             * 否则调用 class2type[toString.call(obj)]
             * 使用Object的原型方法 toString()来获取obj的字符串表示，形式是 [object class]，
             * 然后从对象 class2type中取出[object class]对应的小写字符串并返回，未取到则返回“object
             * @param obj
             * @returns {*}
             */
            function type(obj) {
                return obj == null ? String(obj) :
                    class2type[toString.call(obj)] || "object"
            }

            function isFunction(value) {
                return type(value) == "function"
            }

            function isWindow(obj) {
                return obj != null && obj == obj.window
            }

            function isDocument(obj) {
                return obj != null && obj.nodeType == obj.DOCUMENT_NODE
            }

            function isObject(obj) {
                return type(obj) == "object"
            }

            function isPlainObject(obj) {
                return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
            }

            /**
             * 判断 类数组
             * @param obj
             * @returns {boolean}
             */
            function likeArray(obj) {
                // !!强制转换成 boolean类型
                // false、0、""、null、undefined 和 NaN 为 false
                // 如果指定的属性存在于指定的对象中，则 in 运算符会返回 true
                var length = !!obj && 'length' in obj && obj.length,
                    type = $.type(obj);

                if (type === "function" || isWindow(obj)) {
                    return false;
                }

                // 数组，或者length为0(空数组),length > 0且最后一个元素存在
                return type === "array" || length === 0 ||
                    (typeof length === "number" && length > 0 && ( length - 1 ) in obj);

            }

            /**
             * Flatten any nested arrays
             * 优雅的数组降维
             *
             * [].concat([1,2],3)=>[1,2,3]
             * concat方法的参数是一个元素，该元素会被直接插入到新数组中
             * 如果参数是一个数组，该数组的各个元素将被插入到新数组中
             * apply: 该数组的各个元素将会依次成为被调用函数的各个参数
             *
             * @link http://www.cnblogs.com/front-end-ralph/p/4871332.html
             * @link https://github.com/hanzichi/underscore-analysis/issues/10
             */
            function flatten(array) {
                return array.length > 0 ? concat.apply([], array) : array;
            }

            function funcArg(context, arg, idx, payload) {
                return isFunction(arg) ? arg.call(context, idx, payload) : arg
            }

            function compact(array) {
                return filter.call(array, function (item) {
                    return item != null
                })
            }

            // 数组去重，如果该条数据在数组中的位置与循环的索引值不相同，
            // 则说明数组中有与其相同的值
            unique = function (array) {
                return filter.call(array, function (item, index) {
                    return array.indexOf(item) == index;
                })
            };

            ////////////////////////
            // core 对象(core.init,core.G,core.isG,core.querySelector...)
            ////////////////////////

            // $ => core.init => core.G => dom [Array]
            // TODO context is not used
            $ = function (selector, context) {
                return core.init(selector, context)
            };

            // 判断 selector 类型并处理，最后返回 DOM 元素或类数组
            core.init = function (selector, context) {
                var dom;
                // 如果 selector 是一个字符串则进行 querySelector 选择器查询
                if (typeof selector == 'string') {
                    selector = selector.trim();

                    if (context !== undefined) {
                        //TODO
                        logNoSupported('context');
                    }
                    // If it's a CSS selector, use it to select nodes.
                    else dom = core.querySelector(document, selector)
                } else if (core.isG(selector)) {
                    return selector;
                } else if (isArray(selector)) {
                    dom = compact(selector);
                } else if (isObject(selector)) {
                    dom = [selector]
                }
                log('dom core.init:');
                log(dom);
                return core.G(dom, selector)
            };


            /**
             * core.G 为 DOM 数组设置 $.fn 和 selector
             */
            core.G = function (dom, selector) {
                dom = dom || [];
                // 通过给 dom 设置__proto__属性指向 $.fn 来达到继承 $.fn 上所有方法的目的
                dom.__proto__ = $.fn;
                dom.selector = selector || '';
                log('dom core.G: ');
                log(dom);
                return dom;
            };

            /**
             * 是否是 core.G gQuery对象
             */
            core.isG = function (object) {
                return object instanceof core.G
            };
            /**
             * 元素是否匹配选择器
             *
             * 如果当前元素能被指定的css选择器查找到,则返回true,否则返回false.
             * @link https://developer.mozilla.org/zh-CN/docs/Web/API/Element/matches
             *
             * $.matches(document.getElementsByClassName('qwe')[0],'h3') =>true
             */
            core.matches = function (element, selector) {
                if (!selector || !element || element.nodeType !== 1) {
                    return false;
                }
                // 如果浏览器支持 matchesSelector ,直接调用
                var matchesSelector = element.matches || element.webkitMatchesSelector ||
                    element.mozMatchesSelector || element.oMatchesSelector ||
                    element.matchesSelector;
                if (matchesSelector) {
                    return matchesSelector.call(element, selector);
                }
                // 如果浏览器不支持 matchesSelector, 则将节点放入一个临时div节点，
                // 再通过selector来查找这个div下的节点集，
                // 再判断给定的element是否在节点集中，如果在，则返回一个非零(即非false)的数字
                var match,
                    parent = element.parentNode,
                    temp = !parent;
                // 当 element没有父节点,那么将其插入一个临时的 div里面
                if (temp) {
                    (parent = tempParent).appendChild(element);
                }
                // 0 会被转换为false,而indexOf()没有匹配时会返回 -1
                // ~-1 === 0  [-1] = [10000001]原 = [11111110]反 = [11111111]补
                match = ~core.querySelector(parent, selector).indexOf(element);
                // 将插入的节点删掉
                temp && tempParent.removeChild(element);
                return match;

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

                // log('querySelector: maybeID: ' + maybeID + ', maybeClass: ' + maybeClass + ', nameOnly: ' + nameOnly + ', isSimple: ' + isSimple);
                // Safari DocumentFragment doesn't have getElementById
                return (element.getElementById && isSimple && maybeID) ?
                    // 如果是 id选择器
                    ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
                    //1Element元素节点 9Document文档节点 11DocumentFragment节点
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

            function extend(target, source, deep) {
                for (var key in source)
                    if (source.hasOwnProperty(key)) {
                        // 深复制且属性值是对象或者数组
                        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                            if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                                target[key] = {}
                            }
                            if (isArray(source[key]) && !isArray(target[key])) {
                                target[key] = []
                            }
                            // 递归
                            extend(target[key], source[key], deep)
                            // 浅复制
                        } else if (source[key] !== undefined) {
                            target[key] = source[key]
                        }
                    }
            }

            $.extend = function (target) {
                // slice() 得到sources数组，即取第二个参数及后面的参数
                var deep, sources = slice.call(arguments, 1)
                if (typeof target == 'boolean') {
                    deep = target;
                    // shift() 得到target，即从sources数组中获得第一个元素并删除
                    target = sources.shift()
                }
                sources.forEach(function (source) {
                    extend(target, source, deep)
                });
                return target
            };

            /**
             * 检查父节点是否包含给定的 dom 节点，如果两者是相同的节点，则返回 false
             */
            $.contains = document.documentElement.contains ?
                function (parent, node) {
                    return parent !== node && parent.contains(node)
                } :
                function (parent, node) {
                    while (node && (node = node.parentNode))
                        if (node === parent) return true
                    return false
                }

            /**
             * 获取JavaScript 对象的类型。可能的类型有：
             * null undefined boolean number string function array date regexp object error
             */
            $.type = type;

            /**
             * 如果object是function，则返回ture
             */
            $.isFunction = isFunction;

            /**
             * 如果object参数是否为一个window对象，那么返回true。这在处理iframe时非常有用，因为每个iframe都有它们自己的window对象，
             * 使用常规方法obj === window校验这些objects的时候会失败
             */
            $.isWindow = isWindow;
            $.isArray = isArray;

            /**
             * 测试对象是否是“纯粹”的对象，这个对象是通过 对象常量（"{}"） 或者 new Object 创建的，如果是，则返回true
             */
            $.isPlainObject = isPlainObject

            /**
             * 是否是空对象
             */
            $.isEmptyObject = function (obj) {
                var name;
                for (name in obj)return false;
                return true;
            };

            /**
             * 如果该值为有限数值或一个字符串表示的数字，则返回ture
             */
            $.isNumeric = function (val) {
                var num = Number(val), type = typeof val;
                return val != null
                    && type != 'boolean'
                    && (type != 'string' || val.length)
                    && !isNaN(num)
                    && isFinite(num) || false
            }

            /**
             * 返回给定元素能找在数组中找到的第一个索引值
             * @param element
             * @param array
             * @param [fromIndex]
             * @returns {*}
             */
            $.inArray = function (element, array, fromIndex) {
                return emptyArray.indexOf.call(array, element, fromIndex)
            };
            /**
             * 接受一个标准格式的 JSON 字符串，并返回解析后的 JavaScript 对象
             */
            $.parseJSON = JSON.parse;

            /**
             * 删除字符串首尾的空白符
             */
            $.trim = function (str) {
                return str == null ? "" : String.prototype.trim.call(str)
            };

            /**
             * 遍历集合中的元素，返回通过迭代函数的全部结果
             */
            $.map = function (elements, callback) {
                var value, values = [], i, key;
                if (likeArray(elements)) {
                    for (i = 0; i < elements.length; i++) {
                        value = callback(elements[i], i);
                        if (value != null) {
                            values.push(value);
                        }
                    }
                } else {
                    for (key in elements) {
                        value = callback(elements[key], key);
                        if (value != null) {
                            values.push(value);
                        }
                    }
                }
                log(values);
                return flatten(values);
            };

            /**
             * 遍历数组元素或以key-value值对方式遍历对象。回调函数返回 false 时停止遍历
             */
            $.each = function (elements, callback) {
                var i, key;
                if (likeArray(elements)) {
                    for (i = 0; i < elements.length; i++) {
                        // 使用 call可以在外部通过 this调用
                        if (callback.call(elements[i], i, elements[i]) === false) {
                            break;
                        }
                    }
                } else {
                    for (key in elements) {
                        if (callback.call(elements[key], key, elements[key]) === false) {
                            break;
                        }
                    }
                }

                return elements
            };

            /**
             * class2type like:
             *
             * [object Array]:"array"
             * [object Boolean]:"boolean"
             */
            $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
                class2type["[object " + name + "]"] = name.toLowerCase()
            });


            ////////////////////////
            //fn
            ////////////////////////

            $.fn = {
                // constructor: core.G,
                length: 0,

                // Because a collection acts like an array
                // copy over these useful array functions.

                // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
                forEach: emptyArray.forEach,
                // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
                reduce: emptyArray.reduce,
                push: emptyArray.push,
                sort: emptyArray.sort,
                splice: emptyArray.splice,
                indexOf: emptyArray.indexOf,

                ready: function (callback) {
                    if (readyRE.test(document.readyState) && document.body) {
                        callback($);
                    } else {
                        //js 高程p390
                        document.addEventListener('DOMContentLoaded', function () {
                            callback($)
                        }, false);
                    }
                    return this;
                },
                /**
                 * 从当前对象集合中获取所有元素或单个元素。当 index参数不存在的时，以普通数组的方式返回所有的元素。
                 * 当指定 index时，只返回该置的元素。该方法返回的是 DOM节点。
                 */
                get: function (idx) {
                    return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
                },
                toArray: function () {
                    return this.get()
                },
                size: function () {
                    return this.length
                },
                concat: emptyArray.concat,
                // concat: function () {
                //     var i, value, args = []
                //     for (i = 0; i < arguments.length; i++) {
                //         value = arguments[i]
                //         args[i] = core.isG(value) ? value.toArray() : value
                //     }
                //     return concat.apply(core.isG(this) ? this.toArray() : this, args)
                // },
                //遍历对象/数组 在每个元素上执行回调，并将返回结果用 $封装
                map: function (fn) {
                    //TODO
                    logNoSupported('map');
                    // return $($.map(this, function (element, i) {
                    //     return fn.call(element, i, element);
                    // }))
                },
                // 使用数组的 slice方法，并将返回结果用 $封装
                // @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
                slice: function () {
                    return $(slice.apply(this, arguments))
                },
                // 遍历一个对象集合每个元素。
                // 在迭代函数中，this关键字指向当前项(作为函数的第二个参数传递)。
                // 如果迭代函数返回 false，遍历结束。
                each: function (callback) {
                    /**
                     * @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every
                     */
                    emptyArray.every.call(this, function (element, i) {
                        return callback.call(element, i, element) !== false;
                    });
                    return this;
                },
                empty: function () {
                    return this.each(function () {
                        this.innerHTML = ''
                    })
                },
                // 从其父节点中删除当前集合中的元素
                // @link https://developer.mozilla.org/zh-CN/docs/Web/API/Node/removeChild
                remove: function () {
                    return this.each(function () {
                        if (this.parentNode != null) {
                            this.parentNode.removeChild(this);
                        }
                    })
                },
                // 添加元素到当前匹配的元素集合中。
                // 如果给定content参数，将只在content元素中进行查找，
                // 否则在整个document中查找 TODO
                // add: function (selector, context) {
                //     return $(unique(this.concat($(selector, context))))
                // },

                // 过滤对象集合，返回对象集合中满足css选择器的项。
                // 如果参数为一个函数，函数返回有实际值得时候，元素才会被返回。
                // 在函数中， this 关键字指向当前的元素。
                // @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
                filter: function (selector) {
                    if (isFunction(selector)) {
                        // 两次取反
                        return this.not(this.not(selector));
                    }
                    return $(filter.call(this, function (element) {
                        return core.matches(element, selector);
                    }))
                },
                add: function (selector, context) {
                    return $(unique(this.concat($(selector, context))))
                },
                //判断当前元素集合中的第一个元素是否符合 css选择器。
                is: function (selector) {
                    return this.length > 0 && core.matches(this[0], selector)
                },
                // 过滤当前对象集合，获取一个新的对象集合，它里面的元素不能匹配css选择器。
                // 如果另一个参数为 gQuery对象集合，那么返回的新 gQuery对象中的元素都不包含在该参数对象中。
                // 如果参数是一个函数 ,仅仅包含函数执行为false值得时候的元素，
                // 函数的 this关键字指向当前循环元素
                not: function (selector) {
                    var nodes = [];
                    // 如果为函数时，safari 下的typeof NodeList也是function?[经测试 Safari10 返回 object]
                    // 所以这里需要再加一个判断selector.call !== undefined
                    if (isFunction(selector) && selector.call !== undefined) {
                        this.each(function (index) {
                            if (!selector.call(this, index)) {
                                nodes.push(this)
                            }
                        })
                    } else {
                        // 如果为字符串,调用 filter
                        var excludes = typeof selector == 'string' ? this.filter(selector) :
                            ((likeArray(selector) && isFunction(selector.item)) ?
                                slice.call(selector) : $(selector));

                        this.forEach(function (element) {
                            if (excludes.indexOf(element) < 0) {
                                nodes.push(element);
                            }
                        })
                    }
                    return $(nodes);
                },

                has: function (selector) {
                    return this.filter(function () {
                        return isObject(selector) ?
                            $.contains(this, selector) :
                            $(this).find(selector).size();
                    })
                },

                // 从当前对象集合中获取给定索引值的元素
                eq: function (index) {
                    return index === -1 ? this.slice(index) : this.slice(index, +index + 1);
                },

                // 获取当前对象集合中的第一个元素
                first: function () {
                    var element = this[0];
                    /**
                     * 如果是 object,则 $(object)
                     * @link core.init
                     */
                    //
                    return element && !isObject(element) ? element : $(element);
                },

                // 获取对象集合中最后一个元素
                last: function () {
                    var element = this[this.length - 1];
                    return element && !isObject(element) ? element : $(element);
                },

                find: function (selector) {
                    var result, $this = this;
                    if (!selector) result = $();
                    //TODO
                },

                // 获取对象集合中每一个元素的属性值。返回值为 null或 undefined值得过滤掉
                pluck: function (property) {
                    return $.map(this, function (el) {
                        return el[property]
                    })
                }
            };

            core.G.prototype = $.fn;

            return $;
        }()
    );


    window.gQuery = gQuery;
    // 如果未定义 $ 则赋值为gQuery,防止冲突
    window.$ === undefined && (window.$ = gQuery);


    /**
     * ajax 核心模块
     *
     * http://caniuse.com/#search=xhr IE10+ support 93.11%
     * http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html
     * @link https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest
     */
    !(function ($) {
        var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            // http://stackoverflow.com/questions/21098865/text-javascript-vs-application-javascript
            scriptTypeRE = /^(?:text|application)\/javascript/i,
            xmlTypeRE = /^(?:text|application)\/xml/i,
            jsonType = 'application/json',
            htmlType = 'text/html',
            blankRE = /^\s*$/;

        // 空函数, 用作空回调方法
        function empty() {
        }

        /**
         * ajax settings 默认设置 , 默认设置中声明的参数必然会生效
         * others:
         * url: 发送请求的地址,默认为当前地址
         * data: 发送到服务器的数据；
         *       如果是GET请求，它会自动被作为参数拼接到url上。
         *       非String对象将通过 $.param 得到序列化字符串
         * contentType (默认： “application/x-www-form-urlencoded”)： 发送信息至服务器时内容编码类型。 (这也可以通过设置 headers)。通过设置 false 跳过设置默认值
         * mimeType 覆盖响应的MIME类型
         * dataType 预期服务器返回的数据类型(“json”, “jsonp”, “xml”, “html”, or “text”)
         * headers: Ajax请求中额外的 HTTP 信息头对象
         * jsonp
         * jsonpCallback
         */
        $.ajaxSettings = {
            // 请求类型
            type: 'GET',
            method: this.type,
            // {xhr, settings}
            // 请求发出前调用，它接收 xhr 对象和 settings 作为参数对象。如果它返回 false ，请求将被取消
            beforeSend: empty,
            // {data, status, xhr}
            // 请求成功之后调用。传入返回后的数据，以及包含成功代码的字符串。
            success: empty,
            // 请求出错时调用。 (超时，解析错误，或者状态码不在HTTP 2xx)
            error: empty,
            // 请求完成时调用，无论请求失败或成功。
            complete: empty,
            // 这个对象用于设置Ajax相关回调函数的上下文(this指向)
            context: null,
            // 请求将触发全局Ajax事件处理程序，设置为 false 将不会触发全局 Ajax 事件。
            // global: true,
            // 设置为一个函数，它返回XMLHttpRequest实例(或一个兼容的对象)
            xhr: function () {
                return new window.XMLHttpRequest()
            },
            // MIME types mapping
            // IIS returns Javascript as "application/x-javascript"
            // 从服务器请求的 MIME 类型，指定 dataType 值
            accepts: {
                script: 'text/javascript, application/javascript, application/x-javascript',
                json: jsonType,
                xml: 'application/xml, text/xml',
                html: htmlType,
                text: 'text/plain'
            },
            // Whether the request is to another domain
            crossDomain: false,
            // (默认： 0)：对Ajax请求设置一个非零的值指定一个默认的超时时间，以毫秒为单位
            timeout: 0,
            // 对于非 Get 请求。是否自动将 data 转换为字符串
            processData: true,
            // Whether the browser should be allowed to cache GET responses
            cache: true,
            //Used to handle the raw response data of XMLHttpRequest.
            //This is a pre-filtering function to sanitize the response.
            //The sanitized response should be returned
            dataFilter: empty
        };


        // handle optional data/success arguments
        function parseArguments(url, data, success, dataType) {
            console.log('parseArgumentsStart');
            console.log(url);
            console.log(data);
            console.log(success);
            console.log(dataType);
            // IF url, function(data, status, xhr){ ... }, [dataType]
            // 如果 第二个参数是函数，则代表没有传 data
            if ($.isFunction(data)) {
                dataType = success; // dataType 为 第三个参数
                success = data;     // success 为 第二个参数
                data = undefined;   // 没有传 data
                console.log('$.isFunction(data)');
            }

            // IF url, [dataType]
            // 如果第二个参数不是函数
            if (!$.isFunction(success)) {
                console.log('!$.isFunction(success)');
                dataType = success;
                success = undefined;
            }

            console.log('parseArgumentsEnd');
            console.log(url);
            console.log(data);
            console.log(success);
            console.log(dataType);

            return {
                url: url,
                data: data,
                success: success,
                dataType: dataType
            }
        }

        /**
         * 将 MIME 类型转成 DataType
         * https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types
         * MIME 语法结构: type/subtype
         * @param mime
         * @returns {*|string|string}
         */
        function mimeToDataType(mime) {
            if (mime) {
                mime = mime.split(';', 2)[0]
            }
            return mime && ( mime == htmlType ? 'html' :
                    mime == jsonType ? 'json' :
                        scriptTypeRE.test(mime) ? 'script' :
                            xmlTypeRE.test(mime) && 'xml' ) || 'text'
        }

        function appendQuery(url, query) {
            if (query == '') return url;
            return (url + '&' + query).replace(/[&?]{1,2}/, '?')
        }

        // serialize payload and append it to the URL for GET requests
        function serializeData(options) {
            if (options.processData && options.data && $.type(options.data) != "string") {
                options.data = $.param(options.data, options.traditional);
            }
            if (options.data && (!options.type || options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType)) {
                options.url = appendQuery(options.url, options.data);
                options.data = undefined;
            }
        }

        // call "beforeSend" that's like "send" but cancelable
        function ajaxBeforeSend(xhr, settings) {
            var context = settings.context;
            console.log('settings.context');
            console.log(settings.context);
            if (settings.beforeSend.call(context, xhr, settings) === false) {
                console.log('ajaxBeforeSend');
                return false;
            }
            console.log('ajaxSend');
        }

        function ajaxSuccess(data, xhr, settings) {
            var context = settings.context,
                status = 'success';
            settings.success.call(context, data, status, xhr);
            ajaxComplete(status, xhr, settings)
        }

        // type: "timeout", "error", "abort"
        function ajaxError(error, type, xhr, settings) {
            var context = settings.context;
            settings.error.call(context, xhr, type, error);
            ajaxComplete(type, xhr, settings)
        }

        // status: "success", "timeout", "error", "abort"
        function ajaxComplete(status, xhr, settings) {
            var context = settings.context;
            settings.complete.call(context, xhr, status);
            // ajaxStop(settings)
        }

        $.ajax = function (options) {
            var settings = options || {},
                hashIndex,
                headerName;

            $.each($.ajaxSettings, function (key, value) { // TODO value
                if (settings[key] === undefined) {
                    settings[key] = $.ajaxSettings[key];
                }
            });

            // console.log('ajax start');

            if (!settings.crossDomain) {
                console.log('set crossDomain')
            }

            // 未设置 url 则取当前地址
            if (!settings.url) {
                settings.url = window.location.toString();
                console.log(settings.url);
            }

            // 截取 #
            if ((hashIndex = settings.url.indexOf('#')) > -1) {
                settings.url = settings.url.slice(0, hashIndex);
            }

            console.log('serializeData:Start');
            console.log(settings.url);
            console.log(settings.data);
            // TODO
            serializeData(settings);
            console.log('serializeData:End');
            console.log(settings.url);
            console.log(settings.data);

            var dataType = settings.dataType;

            // 如果禁止缓存则添加
            // HTTP CACHE : https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching?hl=zh-cn
            // http://stackoverflow.com/questions/49547/how-to-control-web-page-caching-across-all-browsers
            if (settings.cache === false) {
                // 添加时间戳 http://localhost:8001/service?_=1482807596778
                settings.url = appendQuery(settings.url, '_=' + Date.now());
            }

            var xhr = settings.xhr(),
                headers = {},
                setHeader = function (name, value) {
                    headers[name.toLowerCase()] = [name, value];
                },
                abortTimeout,
                mime = settings.accepts[dataType];

            // TODO this can prevent CSRF attacks because this header cannot be added to the AJAX request cross domain
            // TODO without the consent of the server via CORS.
            // https://github.com/angular/angular.js/issues/1004
            if (!settings.crossDomain) {
                setHeader('X-Requested-With', 'XMLHttpRequest')
            }

            // 能够接受的回应内容类型（Content-Types）
            setHeader('Accept', mime || '*/*');

            if (mime = settings.mimeType || mime) {
                if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0];
                // https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest#overrideMimeType
                // https://segmentfault.com/a/1190000004322487#articleHeader6
                xhr.overrideMimeType && xhr.overrideMimeType(mime)
            }

            // 设置 HTTP 头给 headers 对象
            if (settings.headers) {
                for (headerName in settings.headers) {
                    setHeader(headerName, settings.headers[headerName]);
                }
            }

            // 设置 Content-Type
            if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET')) {
                setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')
            }

            if (settings.method) {
                settings.type = settings.method;
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    xhr.onreadystatechange = empty;
                    clearTimeout(abortTimeout);
                    var result;
                    if (xhr.status >= 200 && xhr.status < 400) {
                        var mime = xhr.getResponseHeader('content-type');
                        console.log(mime);
                        var dataType = mimeToDataType(mime);
                        /**
                         * ""               字符串(默认值)
                         * "arraybuffer"    ArrayBuffer
                         * "blob"           Blob
                         * "document"       Document
                         * "json"           JavaScript 对象，解析自服务器传递回来的JSON 字符串。
                         * "text"           字符串
                         */
                        console.log(xhr.responseType);
                        if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob') {
                            // 响应实体的类型由 responseType 来指定，
                            // 可以是 ArrayBuffer， Blob， Document， JavaScript 对象 (即 "json")， 或者是字符串。
                            // 如果请求未完成或失败，则该值为 null。
                            result = xhr.response;
                        }
                        else {
                            // 此次请求的响应为文本，或是当请求未成功或还未发送时为 null。
                            result = xhr.responseText;
                        }

                        if (dataType == 'json') {
                            result = blankRE.test(result) ? null : $.parseJSON(result)
                        } else if (dataType == 'xml') {
                            result = xhr.responseXML;
                        }
                        ajaxSuccess(result, xhr, settings);
                    }
                    else {
                        ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings)
                    }
                }
            }
            ;

            // 如果 ajaxBeforeSend 返回 false 则终止请求
            if (ajaxBeforeSend(xhr, settings) === false) {
                // 如果请求已经被发送,则立刻中止请求
                xhr.abort();
                ajaxError(null, 'abort', xhr, settings);
                return xhr
            }
            /**
             * 是否异步
             * 选择同步请求还是异步请求 ？
             * 当您使用 async=false 时，请不要编写 onreadystatechange 函数 - 把代码放到 send() 语句后面即可
             *
             * @link https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests
             */
            var async = 'async' in settings ? settings.async : true;

            // http://stackoverflow.com/questions/1652178/basic-authentication-with-xmlhttprequest
            xhr.open(settings.type, settings.url, async, settings.username, settings.password);

            // 调用 setRequestHeader() 方法设置 HTTP 请求头
            for (headerName in headers) {
                xhr.setRequestHeader.apply(xhr, headers[headerName])
            }

            // 请求超时
            if (settings.timeout > 0) abortTimeout = setTimeout(function () {
                xhr.onreadystatechange = empty;
                xhr.abort();
                ajaxError(null, 'timeout', xhr, settings)
            }, settings.timeout);

            xhr.send(settings.data ? settings.data : null);
            return xhr;
        };

        $.get = function (/* url, [data], [function(data, status, xhr){ ... }], [dataType] */) {
            return $.ajax(parseArguments.apply(null, arguments))
        };

        $.post = function (/* url, data, success, dataType */) {
            var options = parseArguments.apply(null, arguments);
            options.type = 'POST';
            return $.ajax(options)
        };

        $.getJSON = function (/* url, data, success */) {
            var options = parseArguments.apply(null, arguments);
            options.dataType = 'json';
            return $.ajax(options)
        };

        // TODO
        function serialize(params, obj, traditional, scope) {
            var type, array = $.isArray(obj), hash = $.isPlainObject(obj);
            $.each(obj, function (key, value) {
                type = $.type(value);
                if (scope) key = traditional ? scope :
                    scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']';
                // handle data in serializeArray() format
                if (!scope && array) params.add(value.name, value.value);
                // recurse into nested objects
                else if (type == "array" || (!traditional && type == "object"))
                    serialize(params, value, traditional, key);
                else params.add(key, value)
            })
        }

        // TODO
        $.param = function (obj, traditional) {
            var params = [];
            params.add = function (key, value) {
                if ($.isFunction(value)) value = value();
                if (value == null) value = ""
                this.push(escape(key) + '=' + escape(value))
            };
            serialize(params, obj, traditional);
            return params.join('&').replace(/%20/g, '+')
        }


    })(gQuery);

    return gQuery
});