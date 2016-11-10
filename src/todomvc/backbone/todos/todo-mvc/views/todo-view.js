/**
 * todo-view.js
 *
 * Created by xiepan on 2016/11/10 上午10:18.
 */

var app = app || {};

(function ($) {

    app.TodoView = Backbone.View.extend({
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
            if (e.keyCode == ENTER_KEY) {
                this.close();
            }
        },

        // 移除对应条目
        clear: function () {
            this.model.destroy();
        }

    });
})(jQuery);