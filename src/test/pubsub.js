var events = (function () {
    var topics = {};

    return {
        publish: function (topic, info) {
            console.log('publish a topic:' + topic);
            if (topics.hasOwnProperty(topic)) {
                topics[topic].forEach(function (handler) {
                    handler(info ? info : {});
                })
            }
        },
        subscribe: function (topic, handler) {
            console.log('subscribe a topic:' + topic);
            if (!topics.hasOwnProperty(topic)) {
                topics[topic] = [];
            }

            topics[topic].push(handler);
        },
        remove: function (topic, handler) {
            if (!topics.hasOwnProperty(topic)) {
                return;
            }

            var handlerIndex = -1;
            topics[topic].forEach(function (element, index) {
                if (element === handler) {
                    handlerIndex = index;
                }
            });

            if (handlerIndex >= 0) {
                ////从第 handlerIndex 位开始删除 1 个元素
                topics[topic].splice(handlerIndex, 1);
            }
        },
        removeAll: function (topic) {
            console.log('remove all the handler on the topic:' + topic);
            if (topics.hasOwnProperty(topic)) {
                topics[topic].length = 0;
            }
        }
    }
})();


//主题监听函数
var handler = function (info) {
    console.log(info);
};

//订阅hello主题
events.subscribe('hello', handler);

//发布hello主题
events.publish('hello', 'hello world');
