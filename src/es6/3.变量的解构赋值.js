/**
 * 变量的解构赋值.js
 *
 * Created by xiepan on 2016/11/4 上午9:50.
 */


//ES6允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）

// 数组的解构赋值

// var a = 1;
// var b = 2;
// var c = 3;

// es6

var [a,b,c]=[1, 2, 3]
console.log(a);


// 对象的结构赋值

var {foo, bar}={foo: "aaa", bar: "bbb"};
console.log(foo);
console.log(bar);