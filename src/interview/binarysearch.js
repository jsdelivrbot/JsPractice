// 二分查找
function binarySearch(arr, key) {
    var low = 0, high = arr.length - 1;

    while (low <= high) {
        var mid = Math.floor((low + high) / 2);
        if (key == arr[mid]) {
            return mid;
        } else if (key < arr[mid]) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }

    return -1;
}

console.log(binarySearch([1, 2, 3, 5, 7], 5))

// 反转字符串
function r(str) {
    return str.split('').reverse().join('')
}

console.log(r('qwert'))


// push,pop都是在数组末尾操作，shift,unshift在数组开头操作
// 队列
var queue = [];
console.log("入队");
console.log(queue);
queue.push(1)
console.log(queue);
queue.push(2);
console.log(queue);
queue.push(3);
console.log(queue);
console.log("出队，先进先出");
console.log(queue);
queue.shift();
console.log(queue);
queue.shift();
console.log(queue);

// 栈
var stack = [];
console.log("入栈");
console.log(stack);
stack.push(1)
console.log(stack);
stack.push(2);
console.log(stack);
stack.push(3);
console.log(stack);
console.log("出栈，后进先出");
console.log(stack);
//pop：从数组中把最后一个元素删除，并返回这个元素的值
stack.pop();
console.log(stack);
stack.pop();
console.log(stack);
stack.pop();
console.log(stack);


// 慎用unshift ,unshift 耗时约为 push 的300倍！(chrome55)
var arr = [];

var startTime = +new Date();
for (var i = 0; i < 100000; i++) {
    arr.unshift(i);
}
var endTime = +new Date();
console.log("调用unshift方法往数组中添加100000个元素耗时" + (endTime - startTime) + "毫秒");

arr = [];
startTime = +new Date();
// push性能测试
for (var i = 0; i < 100000; i++) {
    arr.push(i);
}
endTime = +new Date();
console.log("调用push方法往数组中添加100000个元素耗时" + (endTime - startTime) + "毫秒");



