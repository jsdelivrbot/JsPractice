/**
 * promise-example.js
 *
 * Created by xiepan on 2016/12/5 下午3:50.
 */
'use strict';
var PPP = require('./promise');

describe('Promise', function () {
    it('then is called', function (done) {
        var onFulfilled = sinon.spy();
        new PPP(function (resolve, reject) {
            resolve();
        })
            .then(onFulfilled);

        setTimeout(function () {
            //验证下onFulfilled方法是否被调用了
            should(onFulfilled.called).be.true();
            done();
        }, 100);
    });
});