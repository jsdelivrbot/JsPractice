/**
 * fp2.js
 *
 * Created by xiepan on 2016/10/18 10:22.
 */
"use strict";

const add10 = (a)=>a + 10;

let x = 10;
const addx = (a)=>a + x;

const setx = (v)=>x = v;
console.log(setx(1));
console.log(x);

var compose = function (a, b) {
    return function (c) {
        return a(b(c));
    };
};

const add1 = (a)=>a + 1;
const times2 = (a)=>a * 2;
const compose2 = (a, b)=>(c)=>a(b(c));
const addd1OfTimes2 = compose2(add1, times2);
console.log(addd1OfTimes2(5));//5*2+1=11


const formalGreeting = (name) => `Hello ${name}`;
const casualGreeting = (name) => `Sup ${name}`;
const male = (name) => `Mr. ${name}`;
const female = (name) => `Mrs. ${name}`;
const doctor = (name) => `Dr. ${name}`;
const phd = (name) => `${name} PhD`;
const md = (name) => `${name} M.D.`;
console.log(formalGreeting(male(phd("Chet"))));


var data = [1, 2, 3];
var squares = data.map((item, index, array)=>item * item);
console.log(squares);
console.log(data);

var sum = [1, 2, 3].reduce((previous, current, index, array)=>previous + current);
console.log(sum);
