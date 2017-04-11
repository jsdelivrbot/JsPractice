/**
 * 12.Iterator和for...of循环.js
 *
 * Created by xiepan on 2016/11/4 上午9:53.
 */
'use strict'
var arr = ['a', 'b', 'c', 'd'];
var obj = {a: 'a1', b: 'b1', c: 'c1', d: 'd1'};

for (let a in arr) {
    console.log(a);// 0 1 2 3
}

for (let a of arr) {
    console.log(a);// a b c d
}

for (let a in obj) {
    console.log(a);// a b c d
}

// 对于普通的对象，for...of结构不能直接使用，会报错，
// 必须部署了 Iterator 接口后才能使用
// for (let a of obj) {
//     console.log(a);// error
// }


const obj1 = {
    [Symbol.iterator]: function () {
        return {
            next: function () {
                return {
                    value: 1,
                    done: true
                };
            }
        };
    }
};

for (let a of obj1) {
    console.log(a);
}