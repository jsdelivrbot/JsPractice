/**
 * task_21.js
 *
 * Created by xiepan on 2016/9/21 14:37.
 */


// TODO
function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, listener);
    } else {
        element['on' + event] = listener;
    }
}


var tagInput = document.getElementById('tag_input'),
    tagList = document.getElementById('tag_list'),
    hobbyInput = document.getElementById('hobby_input'),
    hobbyList = document.getElementById('hobby_list'),
    hobbyBtn = document.getElementsByTagName('button')[0];

function CreateList(divList) {
    this.queue = [];
    this.render = function () {
        var str = '';
        this.queue.forEach(function (e) {
            str += '<span>' + e + '</span>';
        });
        divList.innerHTML = str;
    }
}

CreateList.prototype.rightPush = function (str) {
    this.queue.push(str);
    this.render();
}


