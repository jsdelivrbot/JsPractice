/**
 * app.js
 *
 * Models: LocalStorage
 * Controllers: create or destroy
 * View: Handlebars
 *
 * Created by xiepan on 2016/11/9 上午10:13.
 */
jQuery(function ($) {
    'use strict';

    Handlebars.registerHelper('eq', function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });
    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;

    var App = {
        init: function () {
            this.todos = this.store('todo-mvc-jquery');
            this.todoTemplate = Handlebars.compile($('#todo-template').html());
            this.footerTemplate = Handlebars.compile($('#footer-template').html());
            this.bindEvents();

            new Router({
                '/:filter': function (filter) {
                    this.filter = filter;
                    this.render();
                }.bind(this)
            }).init('/all');
        },

        bindEvents: function () {
            $('#new-todo').on('keyup', this.createTodo.bind(this));
            // onchange 在元素值改变时触发。
            // onchange 属性适用于：<input>、<textarea> 以及 <select> 元素。
            $('#toggle-all').on('change', this.toggleAll.bind(this));
            $('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
            $('#todo-list')
                .on('change', '.toggle', this.toggle.bind(this))
                .on('dblclick', 'label', this.edit.bind(this))
                .on('keyup', '.edit', this.editKeyup.bind(this))
                .on('focusout', '.edit', this.update.bind(this))
                .on('click', '.destroy', this.destroy.bind(this));
        },

        render: function () {
            var todos = this.getFilteredTodos();
            $('#todo-list').html(this.todoTemplate(todos));
            $('#main').toggle(todos.length > 0);
            $('#toggle-all').prop('checked', this.getActiveTodos().length === 0);
            this.renderFooter();
            $('#new-todo').focus();
            this.store('todo-mvc-jquery', this.todos);
        },

        renderFooter: function () {
            var todoCount = this.todos.length;
            var activeTodoCount = this.getActiveTodos().length;
            var template = this.footerTemplate({
                activeTodoCount: activeTodoCount,
                activeTodoWord: activeTodoCount === 1 ? 'item' : 'items',
                completedTodos: todoCount - activeTodoCount,
                filter: this.filter
            });

            $('#footer').toggle(todoCount > 0).html(template);
        },

        toggleAll: function (e) {
            var isChecked = $(e.target).prop('checked');
            this.todos.forEach(function (todo) {
                todo.completed = isChecked;
            });
            this.render();
        },

        getActiveTodos: function () {
            return this.todos.filter(function (todo) {
                return !todo.completed;
            })
        },
        getCompletedTodos: function () {
            return this.todos.filter(function (todo) {
                return todo.completed;
            })
        },
        getFilteredTodos: function () {
            if (this.filter === 'active') {
                return this.getActiveTodos();
            }
            if (this.filter === 'completed') {
                return this.getCompletedTodos();
            }
            return this.todos;
        },

        destroyCompleted: function () {
            this.todos = this.getActiveTodos();
            this.filter = 'all';
            this.render();
        },

        indexFromEl: function (el) {
            var id = $(el).closest('li').data('id');
            var todos = this.todos;
            var i = todos.length;

            while (i--) {
                if (todos[i].id === id) {
                    return i;
                }
            }

        },

        createTodo: function (e) {
            var $input = $(e.target);
            var val = $input.val().trim();

            if (e.which !== ENTER_KEY || !val) {
                return;
            }
            this.todos.push({
                id: Math.random(),
                title: val,
                completed: false
            });

            $input.val('');
            this.render();
        },

        toggle: function (e) {
            var i = this.indexFromEl(e.target);
            this.todos[i].completed = !this.todos[i].completed;
            this.render();
        },
        edit: function (e) {
            var $input = $(e.target).closest('li').addClass('editing').find('.edit')
            $input.val($input.val()).focus();
        },

        editKeyup: function (e) {
            if (e.which === ENTER_KEY) {
                e.target.blur();
            }
            if (e.which === ESCAPE_KEY) {
                $(e.target).data('abort', true).blur();
            }
        },

        update: function (e) {
            var el = e.target;
            var $el = $(el);
            var val = $el.val().trim();

            if (!val) {
                this.destroy(e);
                return;
            }

            if ($el.data('abort')) {
                $el.data('abort', false);
            } else {
                this.todos[this.indexFromEl(el)].title = val;
            }
            this.render();
        },

        destroy: function (e) {
            this.todos.splice(this.indexFromEl(e.target), 1);
            this.render();
        },

        store: function (namespace, data) {
            if (arguments.length > 1) {
                return localStorage.setItem(namespace, JSON.stringify(data));
            } else {
                var store = localStorage.getItem(namespace);
                return (store && JSON.parse(store)) || [];
            }
        }
    };

    App.init();

});
