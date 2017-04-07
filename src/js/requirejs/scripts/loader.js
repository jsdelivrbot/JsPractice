/**
 *
 * AMD规范中文版: https://github.com/amdjs/amdjs-api/wiki/AMD-(%E4%B8%AD%E6%96%87%E7%89%88)
 *
 */

(function (global) {

    'use strict';

    var LOADER_NAME = 'loader';
    var LOADER_FN_DEFINE = 'define';

    var loader = {}
    var registered_modules = {};
    var loadedModules = {};
    var on_modules_loaded = {};
    var scriptNode = document.getElementsByTagName("script")[0];
    var _idx = 0;
    var suffixReg = /\.js$/;
    var head = document.getElementsByTagName('head')[0];
    var modules = {};   // map of all registered modules
    var appendedScripts = {};   // map of all scripts that have been injected
    var callbacks = {}; // stores the callbacks sequence for future execution
    var anonymous = 0;  // anonymous modules counter

    var baseConfig = {
        // baseUrl: cwd,
        paths: {},
        // packages: [],
        // map: {},
        // shim: {}
    };

    /**
     * define(id?:String, dependencies?:Array, factory:Function);
     *
     * factory
     *
     * dependencies,factory
     *
     */
    var define = function (id, dependencies, factory) {

        // 省略了ID
        if (typeof id !== 'string') {
            factory = dependencies;
            dependencies = id;
            id = null;
        }

        // 没有依赖
        if (!isArray(dependencies)) {
            factory = dependencies;
            dependencies = [];
        }

        if (!id) {
            return document.currentScript.src;
        } else {
            //Todo
        }
        // Check whether all dependencies are registered.
        for (var i = 0; i < dependencies.length; i++) {
            if (!modules[dependencies[i]]) {
                // If any dependency is not registered, store the callback and dependencies for future execution.
                callbacks[id] = [true, callback].concat(dependencies);

                // Try to inject all dependencies again and return.
                for (i = 0; i < dependencies.length; i++) {
                    injectModule(dependencies[i]);
                }
                return;
            }
        }

        // Register this module only if all dependencies are registered.
        registerModule(id, dependencies, callback);
    }

    var require = function (dependencies, callback) {
        if (typeof dependencies === 'string') {
            dependencies = [dependencies]
        }

        if (!isArray(dependencies) || typeof callback !== 'function') {
            throw new Error('require() type error')
        }

        // Check whether all dependencies are registered.
        for (var i = 0; i < dependencies.length; i++) {
            // 如果依赖没有被注册，保存依赖和 callback
            if (!modules[dependencies[i]]) {
                var id = 'require/' + (anonymous++);
                callbacks[id] = [false, callback].concat(dependencies);

                // Inject all dependencies and return.
                for (i = 0; i < dependencies.length; i++) {
                    var id = dependencies[i];
                    if (!appendedScripts[id]) {
                        appendedScripts[id] = true;
                        appendScript(id);
                    }
                }
                console.log('callbacks', callbacks)
                console.log('appendedScripts', appendedScripts)
                console.log('modules', modules)

                return;
            }
        }

        // Execute the callback only if all dependencies are registered.
        callback();
    }


    // Init
    function init() {
        define.amd = {}

        global.define = define

        global.require = require

        var path = document.getElementsByTagName('script')[0].getAttribute('data-main');

        appendScript(path)
    }

    init()

    require.config = function (config) {
        if (!config) return
        mixin(baseConfig, config)
    }


    function appendScript(path) {
        var node = document.createElement('script');
        node.type = 'text/javascript';
        node.async = 'true';
        node.src = fixPath(path);
        head.appendChild(node);
    }


    function fixPath(path) {
        if (!suffixReg.test(path)) {
            return path += '.js'
        } else {
            return path
        }
    }

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function eachProp(obj, callback) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                callback(prop, obj[prop])
            }
        }
    }

    function mixin(target, source) {
        eachProp(source, function (prop, value) {
            target[prop] = value;
        })
    }

})(this)


