/**
 * 12.Iterator和for...of循环.js
 *
 * Created by xiepan on 2016/11/4 上午9:53.
 */

var arr = ['a', 'b', 'c', 'd'];

for (let a in arr) {
    console.log(a);// 0 1 2 3
}

for (let a of arr) {
    console.log(a);// a b c d
}