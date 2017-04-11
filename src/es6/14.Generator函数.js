/**
 * 14.Generator函数.js
 *
 * Created by xiepan on 2016/11/4 上午9:54.
 */


// Generator 函数是 ES6 提供的一种异步编程解决方案
// Generator 函数是一个状态机，封装了多个内部状态。
// 执行 Generator 函数会返回一个遍历器对象，
// 也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。
// 返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态
function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
}

var hw = helloWorldGenerator();
console.log(hw.next())
console.log(hw.next())
console.log(hw.next())
console.log(hw.next())
console.log(hw.next())


// Generator函数可以不用yield语句，这时就变成了一个单纯的暂缓执行函数
function* f() {
    console.log('执行了')
}

var generator = f();
setTimeout(function () {
    generator.next()
}, 2000);


// yield语句只能用在 Generator 函数里面，用在其他地方都会报错
// (function () {
//     yield 1;
// })()

//
// var arr = [1, [[2, 3], 4], [5, 6]];
//
// var flat = function* (a) {
//     a.forEach(function (item) {
//         if (typeof item !== 'number') {
//             yield* flat(item);
//         } else {
//             yield item;
//         }
//     })
// };
//
// for (var f of flat(arr)){
//     console.log(f);
// }


var a=[1,2,3]
console.log(...a)