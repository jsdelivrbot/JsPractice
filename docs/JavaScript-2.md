### 304 和 memory from cache



### **http状态码有那些？分别代表是什么意思**？

200 OK 请求已成功，请求所希望的响应头或数据体将随此响应返回。

403 Forbidden 服务器已经理解请求，但是拒绝执行它。

404 Not Found 请求失败，请求所希望得到的资源未被在服务器上发现。

500 Internal Server Error 服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理。一般来说，这个问题都会在服务器的程序码出错时出现。

### **请你说说 get 和 post的区别**

GET 用来获取资源，POST 用来新建资源（也可以用于更新资源），PUT 用来更新资源，DELETE 用来删除资源

GET 相对 POST 的优势是:

请求中的 URL 可以被手动输入;

请求中的 URL 可以被存在书签里，或者历史里;

请求中的 URL 可以被缓存;

详见博客[理解HTTP协议](https://blog.haoduoyu.cc/2016/01/20/HTTP%E5%8D%8F%E8%AE%AE%E7%AE%80%E8%BF%B0/)

### **一个页面从输入 URL 到页面加载显示完成，这个过程中都发生了什么**？

1.输入地址

2.浏览器查找域名的 IP 地址，这一步包括 DNS 具体的查找过程，包括：浏览器缓存->系统缓存->路由器缓存...

3.浏览器向 web 服务器发送一个 HTTP 请求

4.服务器的永久重定向响应（从 http://example.com 到 http://www.example.com）

5.浏览器跟踪重定向地址

6.服务器处理请求

7.服务器返回一个 HTTP 响应

8.浏览器显示 HTML

9.浏览器发送请求获取嵌入在 HTML 中的资源（如图片、音频、视频、CSS、JS等等）

10.浏览器发送异步请求


### **如何解决跨域问题**?

默认情况下，XHR对象只能访问与包含它的页面位于同一个域中的资源(协议，端口和主机都相同)

**CORS**

**简单请求**

只使用 GET, HEAD 或者 POST 数据类型(Content-Type)是 application/x-www-form-urlencoded, multipart/form-data 或 text/plain 中的一种

**非简单请求(预请求)**

请求以 GET, HEAD 或者 POST 以外的方法发起请求。或者，使用 POST,发送数据类型为 application/xml 或者 text/xml 的 XML 数据的请求。

不同于简单请求，“预请求”要求必须先发送一个 OPTIONS 请求给目的站点，来查明这个跨站请求对于目的站点是不是安全可接受的。

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

**JSONP**

JSONP利用没有跨域限制的 script 标签加载预设的 callback 将内容传递给 JavaScript

详见博客：[CORS 跨域资源共享](https://blog.haoduoyu.cc/2016/11/20/CORS-%E8%B7%A8%E5%9F%9F%E8%B5%84%E6%BA%90%E5%85%B1%E4%BA%AB/)

### **CSRF和XSS**

**CSRF**（跨站域请求伪造）是一种网络的攻击方式，其原理是攻击者构造网站后台某个功能接口的请求地址，诱导用户去点击或者用特殊方法让该请求地址自动加载。

**防御CSRF**

1.HTTP Referer 字段；

2.在请求地址中添加 token 并验证。CSRF 是因为攻击者可以完全伪造用户的请求，请求中的信息都是存在于 cookie 中，因此攻击者可以在不知道这些验证信息的情况下直接利用用户自己的 cookie 来通过安全验证。而token可以不存在cookie中。


详见博客:[CSRF 与 XSS 攻击](https://blog.haoduoyu.cc/2017/02/08/CSRF%E4%B8%8EXSS%E6%94%BB%E5%87%BB/)

**XSS**

跨站脚本（XSS）是一种安全漏洞攻击，是代码注入的一种。它允许恶意用户将代码注入到网页上，其他用户在观看网页时就会受到影响。这类攻击通常包含了HTML以及用户端脚本语言。

Web 应用未对用户提交请求的数据做充分的检查过滤，允许用户在提交的数据中掺入 HTML 代码(最主要的是>、<)，并将未经转义的恶意代码输出到第三方用户的浏览器解释执行，是导致XSS漏洞的产生原因。

防御 XSS 攻击最主要的方法是过滤特殊字符，进行 HTML 转义。
 
### **实现排序算法**

```
function bubbleSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {        //相邻元素两两对比
                var temp = arr[j + 1];        //元素交换
                arr[j + 1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}
```

### **二分查找算法**

```
	  function binarySearch(arr, key) {
	    var low = 0, high = arr.length - 1;
	
	    while (low <= high) {
	        var mid = Math.floor((low + high) / 2);
	        if (key == arr[mid]) {
	            return mid;
	        } else if (key < arr[mid]) {
	            high = mid - 1;
	        } else {
	            low = mid + 1;
	        }
	    }
	
	    return -1;
	}
```
	
### 反转单链表

### **反转字符串**

```
function r(str) {
    return str.split('').reverse().join('')
}
```

### LazyMan

思路：使用一个队列来维护任务列表，通过返回 this 来实现链式调用，为了在任务队列中先 push 完所有任务然后再依次执行，添加上 setTimeout 函数

```
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
```

详见博客：[如何实现一个LazyMan](https://blog.haoduoyu.cc/2017/01/19/%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AALazyMan/)

### **数组去重**

ES5:

```
function unique(arr) {
        return arr.filter(function (item, index, array) {
            // indexOf()方法返回给定元素能找在数组中找到的第一个索引值
            return array.indexOf(item) === index;
        });
    }  
```
ES6:

```
function unique(arr) {
        return Array.from(new Set(arr));
    }       
```    
### **数组降维**

```
function flatten(arr) {
   var tmp = arr;
   var result = arr;
   while(tmp instanceof Array) {
      result = Array.prototype.concat.apply([], result);
           tmp = tmp[0];
      }
   return result;
}    
```
### 如何实现数组的随机排序？ 

```
function shuffle(a) {
        // concat 复制原数组
        return a.concat().sort(function (a, b) {
            return Math.random() - 0.5;
        });
    }
```
    
详见博客：[数组乱序](https://blog.haoduoyu.cc/2017/03/07/Underscore-js-%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/)

### **浅复制和深复制**

详见博客:[浅复制和深复制](https://blog.haoduoyu.cc/2017/02/25/%E6%B5%85%E5%A4%8D%E5%88%B6%E5%92%8C%E6%B7%B1%E5%A4%8D%E5%88%B6/)

### 尾调用

详见博客:[JavaScript 中的尾调用](https://blog.haoduoyu.cc/2017/02/17/JavaScript-%E4%B8%AD%E7%9A%84%E5%B0%BE%E8%B0%83%E7%94%A8/)


### 函数式编程

详见博客:[浅谈函数式编程](https://blog.haoduoyu.cc/2016/10/18/%E6%B5%85%E8%B0%88%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BC%96%E7%A8%8B/)

### **单元测试**
### **Vue2原理，Angular2原理**

数据绑定与组件化

### **Java和JavaScript对比**

### **webpack和gulp对比**

http://www.jianshu.com/p/42e11515c10f


### **rxjs**

```
const Observable = Rx.Observable
const input = document.querySelector('input')

const search$ = Observable.fromEvent(input, 'input')
    .map(e => e.target.value)
    .filter(value => value.length >= 1)
    // .throttleTime(200) // 节流事件，指的是该事件最多每几秒触发一次
    .debounceTime(200) //去抖动时间，指的是必须等待的时间
    .distinctUntilChanged()// 当我们观察的数据状态发生改变的时候才会释放数据
    .switchMap(term => Observable.fromPromise(wikiIt(term)))
    .subscribe(
        x => render(x),
        err => console.error(err)
    )

function render(result) {
    document.querySelector('#result').innerHTML = result[1]
        .map(r => `<li>${r}</li>`)
        .join('')
}

function wikiIt(term) {
    console.log('request...')
    var url = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + encodeURIComponent(term) + '&origin=*';
    return $.getJSON(url)
}
```

### **underscore源码**

详见博客：[Underscore.js 源码学习笔记](https://blog.haoduoyu.cc/2017/03/07/Underscore-js-%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/)

### **zepto源码**


### **TypeScript**

TypeScript 是 JavaScript 的**强类型**版本。然后在编译期去掉类型和特有语法，生成纯粹的 JavaScript 代码。TypeScript 并不依赖于浏览器的支持，也并**不会带来兼容性问题**。

TypeScript 是 JavaScript 的**超集**。

优点：

静态类型检查，编译器发现错误；

IDE智能提示；

可读性；

```
declare var $: any;

$.get('/') // => ok
```
> d.ts 文件来标记某个 js 库里面对象的类型
typings 就是一个网络上的 d.ts 数据库

### **socket和websocket**


HTTP的生命周期通过Request来界定，也就是一个Request 一个Response，那么在HTTP1.0中，这次HTTP请求就结束了。

在HTTP1.1中加入了持久链接**keep-alive**。

只要任意一端没有明确提出断开连接，则保持TCP连接状态，减少TCP连接和断开的开销。

但是一个request只能有一个response。而且这个**response是被动的**，不能主动发起。

![](https://www.byvoid.com/upload/wp/2011/07/450px-HTTP_persistent_connection.svg_.png)

Websocket是基于HTTP协议的，或者说借用了HTTP的协议来完成一部分握手

### **typeof 和 instanceof**

typeof 操作符（和 instanceof 一起）或许是 JavaScript 中最大的**设计缺陷**， 因为几乎不可能从它们那里得到想要的结果。

```
Value               Class      Type
-------------------------------------
"foo"               String     string
new String("foo")   String     object
1.2                 Number     number
new Number(1.2)     Number     object
true                Boolean    boolean
new Boolean(true)   Boolean    object
new Date()          Date       object
new Error()         Error      object
[1,2,3]             Array      object
new Array(1, 2, 3)  Array      object
new Function("")    Function   function
/abc/g              RegExp     object (function in Nitro/V8)
new RegExp("meow")  RegExp     object (function in Nitro/V8)
{}                  Object     object
new Object()        Object     object
```

`typeof` 大多数情况下都返回 `object`

建议使用：

```
Object.prototype.toString.call([])    // "[object Array]"
Object.prototype.toString.call({})    // "[object Object]"
Object.prototype.toString.call(2)    // "[object Number]"
```

instanceof：

每个对象都有一个`__proto__`属性，指向创建该对象的函数的 prototype，即原型对象

```
 console.log(Object instanceof Object);//true 
 console.log(Function instanceof Function);//true 
 console.log(Number instanceof Number);//false 
 console.log(String instanceof String);//false 

 console.log(Function instanceof Object);//true 

 console.log(Foo instanceof Function);//true 
 console.log(Foo instanceof Foo);//false
```

实例的`__proto__`链和构造函数的 prototype 是不是指向同一个原型对象

```
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
```

示例：

```
 // 为了方便表述，首先区分左侧表达式和右侧表达式
 FooL = Foo, FooR = Foo; 
 // 下面根据规范逐步推演
 O = FooR.prototype = Foo.prototype 
 L = FooL.__proto__ = Function.prototype 
 // 第一次判断
 O != L 
 // 循环再次查找 L 是否还有 __proto__ 
 L = Function.prototype.__proto__ = Object.prototype 
 // 第二次判断
 O != L 
 // 再次循环查找 L 是否还有 __proto__ 
 L = Object.prototype.__proto__ = null 
 // 第三次判断
 L == null 
 // 返回 false
```
  
### 延迟加载

[图片延迟加载](https://juejin.im/post/58c8f2e1ac502e005880320d)

### 单页应用原理


### **模块化编程怎么做**？

详见博客[JavaScript的模块化编程](https://blog.haoduoyu.cc/2016/12/26/JavaScript%E7%9A%84%E6%A8%A1%E5%9D%97%E5%8C%96%E7%BC%96%E7%A8%8B/)

解决命名冲突与文件依赖
https://github.com/seajs/seajs/issues/547

### AMD、CMD规范区别？

详见博客[JavaScript的模块化编程](https://blog.haoduoyu.cc/2016/12/26/JavaScript%E7%9A%84%E6%A8%A1%E5%9D%97%E5%8C%96%E7%BC%96%E7%A8%8B/) 



### 函数声明和函数表达式~~~~