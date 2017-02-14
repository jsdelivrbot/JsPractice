/**
 * callback.js
 *
 * Created by xiepan on 2016/12/5 下午2:57.
 */

var fn = function (callback) {
    callback('callback');
};

fn(function (value) {
    console.log(value);
});

