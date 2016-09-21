/**
 * task_18.js
 *
 * Created by xiepan on 2016/9/18 15:36.
 */


function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, listener);
    } else {
        element['on' + event] = listener;
    }
}

function each(arr, fn) {
    for (var cur = 0; cur < arr.length; cur++) {
        fn(arr[cur], cur);
    }
}

window.onload = function () {
    var container = document.getElementById('container');
    var buttonList = document.getElementsByTagName('input');
    var result = document.getElementById('result')

    var queue = {
        str: ['1', '2', '4', '3', '5', '-1'],
        //左侧入
        leftPush: function (num) {
            // 向数组的开头添加一个或更多元素，并返回新的长度
            this.str.unshift(num);
            this.show();
        },
        //右侧入
        rightPush: function (num) {
            // 向数组的末尾添加一个或更多元素，并返回新的长度
            this.str.push(num);
            this.show();
        },

        isEmpty: function () {
            return (this.str.length == 0);
        },
        //左侧出
        leftPop: function () {
            if (!this.isEmpty()) {
                // 删除并返回数组的第一个元素
                alert(this.str.shift());
                this.show();
            } else {
                alert("empty")
            }
        },
        //右侧出
        rightPop: function () {
            if (!this.isEmpty()) {
                // 删除并返回数组的最后一个元素
                alert(this.str.pop());
                this.show();
            } else {
                alert("empty");
            }
        },


        show: function () {
            var str = "";
            result.innerHTML = '';
            each(this.str, function (item) {
                var bar = document.createElement('div');
                bar.innerText = item;
                bar.style.height = item > 0 ? item * 5 + 'px' : '1px';
                bar.style.backgroundColor = 'red';
                result.appendChild(bar);
            });
        },

        deleteID: function (id) {
            console.log(id);
            // 删除元素
            this.str.splice(id, 1);
            this.show();
        }
    };

    // function randomColor() {
    //     return '#' + ('00000' +
    //         (Math.random() * 0x1000000 | 0).toString(16).toUpperCase()).slice(-6);
    // }

    function addDivDelEvent() {
        for (var cur = 0; cur < container.childNodes.length; cur++) {
            addEvent(container.childNodes[cur], 'click', function (cur) {
                return function () {
                    return queue.deleteID(cur);
                }
            }(cur));
        }
    }

     // 0,1,2,3, 0,1,2, 0,1, 0
    function bubbleSort() {
        var clock;
        var count = 0, i = 0;
        console.log(queue.str.length)
        clock = setInterval(function () {
            if (count > queue.str.length - 2) {
                clearInterval(clock);
            }
            if (i == queue.str.length - 1 - count) {
                i = 0;
                count++;
            }
            if (queue.str[i] > queue.str[i + 1]) {
                var temp = queue.str[i];
                queue.str[i] = queue.str[i + 1];
                queue.str[i + 1] = temp;
                queue.show();
            }
            console.log(i);
            i++;
        }, 100);
    }

    function random() {
        queue.str = [];
        for (i = 0; i <= 20; i++) {
            queue.str.push(Math.floor(Math.random() * 50));
        }
        queue.show();
    }

    queue.show();
    addEvent(buttonList[1], 'click', function () {
        var input = buttonList[0].value;
        if ((/^[0-9]+$/).test(input)) {
            queue.leftPush(input);
        } else {
            alert("enter an integer")
        }
    });

    addEvent(buttonList[2], 'click', function () {
        var input = buttonList[0].value;
        if ((/^[0-9]+$/).test(input)) {
            queue.rightPush(input);
        }
        else {
            alert("enter an integer");
        }
    });

    addEvent(buttonList[3], 'click', function () {
        queue.leftPop();
    });

    addEvent(buttonList[4], 'click', function () {
        queue.rightPop();
    })

    addEvent(buttonList[5], 'click', function () {
        bubbleSort();
    })

    addEvent(buttonList[6], 'click', function () {
        random();
    })
}