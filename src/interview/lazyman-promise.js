function createWaitPromise(second) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('Wake up after ' + second);
        }, second * 1000);
    });
}

function LazyMan(name) {
    var promise = new Promise(function (resolve, reject) {
        resolve('Hi! This is ' + name + '!');
    });

    return {
        sleep: function (second) {
            promise = promise.then(function (msg) {
                console.log(msg);
                return createWaitPromise(second);
            });
            return this;
        },
        sleepFirst: function (second) {
            var op = promise;
            promise = createWaitPromise(second).then(function (msg) {
                console.log(msg);
                return op;
            });
            return this;
        },
        eat: function (part) {
            var pn = new Promise(function (resolve) {
                resolve('Eat ' + part + '~');
            });
            promise = promise.then(function (msg) {
                console.log(msg);
                return pn;
            });
            return this;
        },
        print: function () {
            return promise.then(function (msg) {
                console.log(msg);
            });
        }
    };
}

LazyMan('Hank').sleepFirst(1).eat('breadfast').sleep(1).eat('dinner').print();
