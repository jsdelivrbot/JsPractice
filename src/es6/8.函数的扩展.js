/**
 * 8.函数的扩展.js
 *
 * Created by xiepan on 2016/11/4 上午9:52.
 */

// 函数参数的默认值

function log(x, y) {
    y = y || "World";
    console.log(x, y);
}

log("Hello");
log("Hello", "China");
log('Hello', '');// 参数y等于空字符，结果被改为默认值

// es6
function log2(x, y = "World") {
    console.log(x, y);
}
log2("Hello");
log2("Hello", "China");
log2('Hello', '');


// rest参数
function add(...values) {
    let sum = 0;

    for (var val of values) {
        sum += val;
    }
    return sum;
}

console.log(add(2, 5, 3));

// arguments变量的写法
function sortNumbers() {
    return Array.prototype.slice.call(arguments).sort();
}

const sortNumbers2 = (...numbers)=>numbers.sort();


// 扩展运算符...
console.log(...[1, 2, 3]);


// 箭头函数

var f = v=>v;

var f2 = function (v) {
    return v;
};

// 由于大括号被解释为代码块，
// 所以如果箭头函数直接返回一个对象，必须在对象外面加上括号。
var getTempItem =
    id => (
    {id: id, name: "Temp"}
    );
console.log(getTempItem(123));

console.log([1, 2, 3]
    .map(x => {
        return (x * x)
    }));

console.log([1, 2, 3]
    .map(x =>
        x * x
    ));

// 箭头函数 this

// 在箭头函数出现之前，每个新定义的函数都有其自己的 this值
// function Person() {
//     // 构造函数 Person() 定义的 `this` 就是新实例对象自己
//     this.age = 0;
//     setInterval(function growUp() {
//         // 在非严格模式下，growUp() 函数定义了其内部的 `this`
//         // 为全局对象, 不同于构造函数Person()的定义的 `this`
//         this.age++;
//         console.log(this.age);
//     }, 1000);
// }
//
// new Person();


function Person2() {
    this.age = 0;

    setInterval(() => {
        this.age++; // |this| 正确地指向了 person 对象
        console.log(this.age);
    }, 1000);
}

new Person2()
