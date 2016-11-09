/**
 * oop.js
 *
 * Created by xiepan on 2016/10/26 下午4:52.
 */
'use strict'
var person = {
    name: '',
    eat: function () {
        console.log('eat')
    }
};


var student = {
    name: 'aaa',
    learn: function () {
        console.log('learn');
    }
};

student.__proto__ = person;

student.eat();


function Person(name) {
    this.name = name;
}

function Student(name) {
    this.name = name;
}

Person.prototype.eat = function () {
    console.log(this.name + ' eat');
};

Student.prototype = new Person();
Student.prototype.learn = function () {
    console.log(this.name + " learn");
};

var student2 = new Student('123');
student2.eat();
student2.learn();

class B {
    constructor() {
        this.bb = 'hello';
    }
}

class A extends B {
    constructor() {
        super();
        this.name = 'world';
    }
}

var a = new A();
console.log(a.bb)