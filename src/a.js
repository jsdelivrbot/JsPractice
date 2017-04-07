function Super(name) {
    this.name = name
    // this.say = function () {
    //     console.log(this.name)
    // }
}

Super.prototype.superSay = function () {
    console.log('say...')
}

Sub.prototype = new Super()

function Sub(name) {
    Super.call(this, name)
}

Sub.prototype.sayAge = function () {
    alert(this.name + 'age');
};

var i1 = new Sub('sub1')
var i2 = new Sub('sub2')


// i1.superSay()
// i1.sayAge()


function instance_of(a, b) {
    var bPrototype = b.prototype;// 取 b 的显示原型
    a = a.__proto__;// 取 a 的隐式原型
    while (true) {
        if (a === null)
            return false;
        if (bPrototype === a)
            return true;
        a = a.__proto__;
    }
}
