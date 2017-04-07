/**
 * 反转单链表.js
 *
 * Created by xiepan on 2017/3/8 下午5:35.
 */


function Node(value) {
    this.value = value;
    this.next = null;
}

Node.prototype.setNext = function (node) {
    this.next = node;
    return node;
}

Node.prototype.printList = function () {
    var top = this;
    while (top) {
        console.log(top.value);
        top = top.next;
    }
}

Node.prototype.reverse = function () {
    var topNode = null;
    var originalTop = this;
    var lastTopNode = originalTop;
    while (originalTop.next) {
        topNode = originalTop.next;
        originalTop.setNext(originalTop.next.next);
        topNode.setNext(lastTopNode);
        lastTopNode = topNode;
    }
    return topNode;
}

var head = new Node(1);
head.setNext(new Node(2)).setNext(new Node(3)).setNext(new Node(4)).setNext(new Node(5));

head.printList();
head = head.reverse();
head.printList();