/**
 * 15.Promise对象.js
 *
 * Created by xiepan on 2016/11/4 上午9:54.
 */

// javascript异步编程
// 1.回调函数
// 2.事件监听
// $("p").on("click",function(){
//    alert("The paragraph was clicked.");
// });
// 3.发布/订阅("观察者模式")
// 4.Promises 对象
//

// 所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。

// Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。
// 它由 CommonJS 社区最早提出和实现，
// ES6 将其写进了语言标准，统一了用法,原生提供了 Promise 对象
'use strict'
var promise = new Promise(function (resolve, reject) {
    let isSuccess;
    if (isSuccess) {
        resolve(value);// Pending => Resolved
    } else {
        reject(error);// Pending => Rejected
    }
});

promise.then(
    function (value) {

    },
    function (error) {

    });


var p = new Promise((resolve, reject) => {
    setTimeout(resolve('done'), 100);
}).then(value =>
    console.log(value)
).catch(error =>
    console.log(error)
);

console.log(p)

// Promise.all
let url = 'year=2015'
let url2 = 'year=2016'
let url3 = 'year=2017'
Promise.all([url, url2, url3].map(function (u) {
    return u + 'QQQ'
})).then(function (results) {
    console.log(results)
    return results.splice(0, 2)
}).then(function (res) {
    console.log(res)
})