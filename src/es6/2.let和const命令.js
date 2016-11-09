/**
 * 2.let和const命令.js
 *
 * Created by xiepan on 2016/11/4 上午9:50.
 */
'use strict'
// let 实际上为JavaScript新增了块级作用域
{
    let a = 10;
    var b = 1;
}

// console.log(a);//ReferenceError: a is not defined
console.log(b);


// const声明一个只读的常量。
// 一旦声明，常量的值就不能改变。常量的值就不能改变。

const PI = 3.1415;
console.log(PI);
// PI = 3;//TypeError: Assignment to constant variable.
