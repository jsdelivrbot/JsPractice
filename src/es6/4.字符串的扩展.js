/**
 * 字符串的扩展.js
 *
 * Created by xiepan on 2016/11/4 上午9:50.
 */


// 模板字符串（template string）是增强版的字符串，用反引号（`）标识。
// 它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。
$('#result').append(
    'There are <b>' + basket.count + '</b> ' +
    'items in your basket, ' +
    '<em>' + basket.onSale +
    '</em> are on sale!'
);


// es6
$('#result').append(`
  There are <b>${basket.count}</b> items
   in your basket, <em>${basket.onSale}</em>
  are on sale!
`);