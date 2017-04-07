/**
 * test.js
 *
 * Created by ice on 2017/4/7 上午9:37.
 */

(function () {
    var t = [1, 3, 5, 7, 9, 21, 2, 4, 6, 8, 10, 2,
        2, 3, 5, 7, 9, 11, 1, 4, 6, 8, 10, 1,
        2, 1, 5, 7, 9, 11, 2, 2, 6, 8, 11, 1]; // 数组
    var mod = 12;

    var temp = []; // 存储分组后的数组
    for (let i = 0; i < mod; i++) {
        temp.push(t.filter(function (item, index, arr) {
            if ((index - i) % mod === 0)
                return item;
        }));
    }
    var ret = temp.map(function (item) {
        return item.reduce(function (x, y) {
            return x + y;
        });
    });
    console.log(ret);
})();