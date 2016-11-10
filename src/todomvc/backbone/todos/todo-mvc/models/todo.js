/**
 * todo.js
 *
 * Created by xiepan on 2016/11/10 上午10:18.
 */

var app = app || {};

(function () {
    app.Todo = Backbone.Model.extend({
        defaults: {
            title: 'empty todo...',
            // order: app.todos.nextOrder(),
            done: false
        },

        // defaults 散列（或函数）用于为模型指定默认属性。
        // 创建模型实例时，任何未指定的属性会被设置为其默认值。
        // defaults: function () {
        //     return {
        //         title: "empty todo...",
        //         order: app.todos.nextOrder(),
        //         done: false
        //     };
        // },
        // 切换当前 item的 done 状态
        toggle: function () {
            this.save({done: !this.get('done')});
        }
    });
})();
