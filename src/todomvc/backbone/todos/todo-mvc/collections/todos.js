/**
 * todos.js
 *
 * Created by xiepan on 2016/11/10 上午10:18.
 */

var app = app || {};

(function () {
    var Todos = Backbone.Collection.extend({
        // 覆盖此属性来指定集合中包含的模型类。
        // 可以传入原始属性对象（和数组）来 add, create,和 reset，
        // 传入的属性会被自动转换为适合的模型类型。
        model: app.Todo,

        // 存储到浏览器
        // @link https://github.com/jeromegn/Backbone.localStorage
        localStorage: new Backbone.LocalStorage('todos-backbone'),

        // 获取所有已完成的数组
        done: function () {
            // 返回集合中所有匹配所传递 attributes（属性）的模型数组。
            // 对于简单的filter（过滤）比较有用
            // @link http://www.css88.com/doc/backbone/#Collection-where
            return this.where({done: true});
        },

        // 获取所有未完成的数组
        remaining: function () {
            return this.where({done: false});
        },

        // 获得下一个 item的序号
        nextOrder: function () {
            if (!this.length) return 1;

            return this.last().get('order') + 1;
        },

        // 排序
        // @link http://www.css88.com/doc/backbone/#Collection-comparator
        comparator: 'order'

    });

    app.todos = new Todos();

})();
