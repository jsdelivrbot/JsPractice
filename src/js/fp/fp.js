/**
 * fp.js
 * https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch1.html#一个简单例子
 *
 * Created by xiepan on 2016/10/17 15:07.
 */

//ch1 我们在做什么？
var Flock = function (n) {
    this.seagulls = n;
};

Flock.prototype.conjoin = function (other) {
    this.seagulls += other.seagulls;
    return this;
};

Flock.prototype.breed = function (other) {
    this.seagulls = this.seagulls * other.seagulls;
    return this;
};

var flock_a = new Flock(4);
var flock_b = new Flock(2);
var flock_c = new Flock(0);

var result = flock_a
    .conjoin(flock_c)
    .breed(flock_b)
    .conjoin(flock_a.breed(flock_b)).seagulls;

console.log(result);//32

var add = function (x, y) {
    return x + y;
};

var multiply = function (x, y) {
    return x * y;
};

var a = 4, b = 2, c = 0;
var result2 = add(multiply(b, add(a, c)), multiply(a, b));
console.log(result2);//16


//ch2 一等公民的函数

var hi = function (name) {
    return "Hi " + name;
};

var stupidGreeting = function (name) {
    return hi(name);
};

var greeting = hi;


console.log(greeting("times"));
// "Hi times"

// 纯函数的好处

// slice 符合纯函数的定义是因为对相同的输入它保证能返回相同的输出。
// 而 splice 却会嚼烂调用它的那个数组，然后再吐出来；
// 这就会产生可观察到的副作用，即这个数组永久地改变了。
var xs = [1, 2, 3, 4, 5];

// 纯的
xs.slice(0, 3);
//=> [1,2,3]

xs.slice(0, 3);
//=> [1,2,3]

xs.slice(0, 3);
//=> [1,2,3]


// 不纯的
xs.splice(0, 3);
//=> [1,2,3]

xs.splice(0, 3);
//=> [4,5]

xs.splice(0, 3);
//=> []

// 不纯的
var minimum = 21;

var checkAge = function (age) {
    return age >= minimum;
};

// 纯的
var checkAge2 = function (age) {
    var minimum = 21;
    return age >= minimum;
};


// ch4 柯里化

// 这里我们定义了一个 add 函数，它接受一个参数并返回一个新的函数。
// 调用 add 之后，返回的函数就通过闭包的方式记住了 add 的第一个参数。
// 一次性地调用它实在是有点繁琐，好在我们可以使用一个特殊的 curry 帮助函数
// 使这类函数的定义和调用更加容易。
var add2 = function (x) {
    return function (y) {
        return x + y;
    };
};

var increment = add2(1);
var addTen = add2(10);

increment(2);
addTen(12);

// ch5 代码组合

var compose = function (f, g) {
    return function (x) {
        return f(g(x));
    };
};

var toUpperCase = function (x) {
    return x.toUpperCase();
};

var exclaim = function (x) {
    return x + "!";
};

var shout = compose(exclaim, toUpperCase);

console.log(shout("send"));

// ch6 示例应用

// 命令式
var makes = [];
var cars = ['a', 'b', 'c', 'd', 'e', 'f'];
for (i = 0; i < cars.length; i++) {
    makes.push(cars[i]);
}
console.log(makes);

//声明式
var makes = cars.map(function (car) {
    return car;
});
console.log(makes);

