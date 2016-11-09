/**
 * todos.js
 *
 * Created by xiepan on 2016/10/25 10:49.
 */

jQuery(function () {

    // Model
    // -----
    var Todo = Backbone.Model.extend({
        // defaults: {
        //     title: 'empty todo...',
        //     order: Todos.nextOrder(),
        //     done: false
        // },

        // defaults 散列（或函数）用于为模型指定默认属性。
        // 创建模型实例时，任何未指定的属性会被设置为其默认值。
        defaults: function () {
            return {
                title: "empty todo...",
                order: Todos.nextOrder(),
                done: false
            };
        },
        // 切换当前 item的 done 状态
        toggle: function () {
            this.save({done: !this.get('done')});
        }
    });

    //Collection
    //----------
    var TodoList = Backbone.Collection.extend({
        // 覆盖此属性来指定集合中包含的模型类。
        // 可以传入原始属性对象（和数组）来 add, create,和 reset，
        // 传入的属性会被自动转换为适合的模型类型。
        model: Todo,

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

    var Todos = new TodoList;


    var TodoView = Backbone.View.extend({
        // @link http://www.css88.com/doc/backbone/#View-extend
        tagName: 'li',

        // @link http://www.css88.com/doc/backbone/#View-template
        template: _.template($('#item-template').html()),

        events: {
            'click .toggle': 'toggleDone',
            'dblclick .view': 'edit',
            'click a.destroy': 'clear',
            'keypress .edit': 'updateOnEnter',
            'blur .edit': 'close'
        },

        initialize: function () {
            // 让 object 监听 另一个（other）对象上的一个特定事件。
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            this.input = this.$('.edit');
            return this;
        },

        // 控制任务完成或者未完成
        toggleDone: function () {
            this.model.toggle();
        },

        // 修改任务条目的样式
        edit: function () {
            $(this.el).addClass('editing');
            this.input.focus();
        },

        // 关闭编辑模式,并把修改内容同步到 Model和界面
        close: function () {
            var value = this.input.val();
            if (!value) {
                this.clear();
            } else {
                this.model.save({title: value});
                this.$el.removeClass('editing');
            }
        },
        // 关闭编辑模式
        updateOnEnter: function (e) {
            if (e.keyCode == 13) {
                this.close();
            }
        },

        // 移除对应条目
        clear: function () {
            this.model.destroy();
        }

    });


    var AppView = Backbone.View.extend({
            el: $('#todoapp'),

            statsTemplate: _.template($('#stats-template').html()),

            events: {
                'keypress #new-todo': 'createOnEnter',
                'click #clear-completed': 'clearCompleted',
                'click #toggle-all': 'toggleAllComplete'
            },

            initialize: function () {
                this.input = this.$('#new-todo');
                this.allCheckbox = this.$('#toggle-all')[0];

                this.listenTo(Todos, 'add', this.addOne);
                this.listenTo(Todos, 'reset', this.addAll);
                this.listenTo(Todos, 'all', this.render);

                this.footer = this.$('footer');
                this.main = $('#main');

                Todos.fetch();
            },

            render: function () {
                var done = Todos.done().length;
                var remaining = Todos.remaining().length;

                if (Todos.length) {
                    this.main.show();
                    this.footer.show();
                    this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
                } else {
                    this.main.hide();
                    this.footer.hide();
                }

                this.allCheckbox.checked = !remaining;
            },

            addOne: function (todo) {
                var view = new TodoView({model: todo});
                this.$('#todo-list').append(view.render().el);
            },

            addAll: function () {
                Todos.each(this.addOne, this);
            },

            createOnEnter: function (e) {
                if (e.keyCode != 13) return;
                if (!this.input.val()) return;

                Todos.create({title: this.input.val()})
                this.input.val('');

            },
            clearCompleted: function () {

                _.invoke(Todos.done(), 'destroy');
                return false;
            },

            toggleAllComplete: function () {
                var done = this.allCheckbox.checked;
                Todos.each(function (todo) {
                    todo.save({'done': done})
                })
            }
        }
    );
    var app = new AppView;
});