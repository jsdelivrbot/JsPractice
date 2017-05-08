/**
 * test.js
 *
 * Created by ice on 2017/4/21 上午10:05.
 */

var scope = 'global';

function log() {
    console.log(this.scope)
}

var obj = {
    scope: 'obj',
    do: function () {
        var scope = 'inner';
        log()
    }
};

obj.do();
