/**
 * lazyman.js
 *
 * Created by xiepan on 2017/1/19 上午10:03.
 */
//    实现一个LazyMan，可以按照以下方式调用:
//        LazyMan(“Hank”)输出:
//        Hi! This is Hank!
//        LazyMan(“Hank”).sleep(10).eat(“dinner”)输出
//    Hi! This is Hank!
////等待10秒..
//        Wake up after 10
//    Eat dinner~
//        LazyMan(“Hank”).eat(“dinner”).eat(“supper”)输出
//    Hi This is Hank!
//        Eat dinner~
//        Eat supper~
//        LazyMan(“Hank”).sleepFirst(5).eat(“supper”)输出
//    //等待5秒
//    Wake up after 5
//    Hi This is Hank!
//        Eat supper
//    以此类推。

function _LazyMan(name) {

    this.tasks = []
    var _this = this

    var fn = (function () {
        console.log(`Hi! This is ${name}!`)
        _this._next()
    })

    this.tasks.push(fn)

    setTimeout(function () {
        _this._next()
    }, 0)
}

_LazyMan.prototype._next = function () {
    var fn = this.tasks.shift()
    fn && fn()
}

_LazyMan.prototype.eat = function (name) {
    var _this = this

    var fn = (function () {
        console.log(`Eat ${name}`)
        _this._next()
    })

    this.tasks.push(fn)
    return this
}

_LazyMan.prototype.sleep = function (time) {
    var _this = this

    var fn = (function () {
        setTimeout(function () {
            console.log(`Wake up after ${time} s`)
            _this._next()
        }, time * 1000)
    })

    this.tasks.push(fn)
    return this
}

_LazyMan.prototype.sleepFirst = function (time) {
    var _this = this

    var fn = (function () {
        setTimeout(function () {
            console.log(`Wake up after ${time} s`)
            _this._next()
        }, time * 1000)
    })

    this.tasks.unshift(fn)
    return this
}

function LazyMan(name) {
    return new _LazyMan(name)
}

LazyMan('GGG').sleep(3).eat('milk').eat('fish').sleep(2).eat('water').sleepFirst(2)