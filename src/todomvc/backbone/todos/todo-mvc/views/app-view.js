/**
 * app-view.js
 *
 * Created by xiepan on 2016/11/10 上午10:18.
 */

var app = app || {};

(function ($) {

    app.AppView = Backbone.View.extend({

            // 绑定页面上主要的 DOM节点
            el: $('#todoapp'),

            // 在底部显示的统计数据模板
            statsTemplate: _.template($('#stats-template').html()),

            // 绑定 DOM节点上的事件
            events: {
                'keypress #new-todo': 'createOnEnter',
                'click #clear-completed': 'clearCompleted',
                'click #toggle-all': 'toggleAllComplete'
            },

            // 在初始化过程中，绑定事件到Todos上，
            // 当任务列表改变时会触发对应的事件。
            // 最后从localStorage中fetch数据到Todos中。
            initialize: function () {
                this.input = this.$('#new-todo');
                this.allCheckbox = this.$('#toggle-all')[0];

                this.listenTo(app.todos, 'add', this.addOne);
                this.listenTo(app.todos, 'reset', this.addAll);
                this.listenTo(app.todos, 'all', this.render);

                this.footer = this.$('footer');
                this.main = $('#main');

                app.todos.fetch();
            },

            // 渲染页面
            render: function () {
                var done = app.todos.done().length;
                var remaining = app.todos.remaining().length;

                if (app.todos.length) {
                    this.main.show();
                    this.footer.show();
                    this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
                } else {
                    this.main.hide();
                    this.footer.hide();
                }

                this.allCheckbox.checked = !remaining;
            },

            // 添加一个
            addOne: function (todo) {
                var view = new app.TodoView({model: todo});
                this.$('#todo-list').append(view.render().el);
            },

            // 添加所有
            addAll: function () {
                app.todos.each(this.addOne, this);
            },

            // 创建一个新 todo
            createOnEnter: function (e) {
                if (e.keyCode != ENTER_KEY) return;
                if (!this.input.val()) return;

                app.todos.create({
                    title: this.input.val(),
                    order: app.todos.nextOrder(),
                });
                this.input.val('');

            },

            // 清除已完成的 todos
            clearCompleted: function () {

                _.invoke(app.todos.done(), 'destroy');
                return false;
            },

            // 处理页面点击标记全部完成按钮
            // 如果标记全部按钮已选，则所有都完成
            // 如果未选，则所有的都未完成。
            toggleAllComplete: function () {
                var done = this.allCheckbox.checked;
                app.todos.each(function (todo) {
                    todo.save({'done': done})
                })
            }
        }
    );
}(jQuery));