### **介绍JavaScript的基本数据类型**。

6种原始数据类型

Undefined、Null、Boolean、Number 和 String

ES6 新增 Symbol
[link](http://es6.ruanyifeng.com/#docs/symbol)

### 介绍JavaScript有哪些内置对象？

Object 是 JavaScript 中所有对象的父对象

数据封装类对象：Object、Array、Boolean、Number 和 String
其他对象：Function、Arguments、Math、Date、RegExp、Error

### **JavaScript有几种类型的值？，你能画一下他们的内存图吗**？

在 ECMAScript 中，变量可以存在两种类型的值，即**原始值**和**引用值**。

原始值
存储在栈（stack）中的简单数据段，也就是说，它们的值直接存储在变量访问的位置。

引用值
存储在堆（heap）中的对象，也就是说，存储在变量处的值是一个指针（point），指向存储对象的内存处。

![](http://www.w3school.com.cn/i/ct_js_value.gif)

### 如何将字符串转化为数字，例如'12.3b'?

`parseFloat('12.3b');`

### **JavaScript原型，原型链 ? 有什么特点？**

1.JavaScript 不包含传统的类继承模型，而是使用prototype原型模型。

2.新函数的prototype属性指向函数的原型对象。

3.每个对象都有一个`__proto__`属性，指向函数的原型对象

4.原型对象的 constructor 属性指向 prototype 属性所在函数

5.hasOwnProperty() 检测一个属性是存在于实例中，还是存在于原型中

6.每个对象都有一个指向它原型对象的链接。这个原型对象又有自己的原型，直到Object.prototype,它的的原型为 null 为止，组成这条链的最后一环，这种一级一级的链结构就称为原型链）。

7.当查找一个对象的属性时，会向上遍历原型链，直到找到给定名称的属性为止

![](http://7xq3d5.com1.z0.glb.clouddn.com/jsobj_full.jpg?imageView2/2/w/500)

详见博客：[图解原型链](https://blog.haoduoyu.cc/2016/10/30/%E5%9B%BE%E8%A7%A3%E5%8E%9F%E5%9E%8B%E9%93%BE/)

### **javascript创建对象的几种方式**？


1.对象字面量

```
var myHonda = {
    color: "red",
    wheels: 4,
    engine: {cylinders: 4, size: 2.2}
};
```
2.工厂模式

```
function createPerson(name, age, job){
            var o = new Object();
            o.name = name;
            o.age = age;
            o.job = job;
            o.sayName = function(){
                alert(this.name);
            };    
            return o;
        }
        
        var person1 = createPerson("Nicholas", 29, "Software Engineer");
        var person2 = createPerson("Greg", 27, "Doctor");
```

**缺点**是无法知道对象的类型

3.构造函数模式

```
        function Person(name, age, job){
            this.name = name;
            this.age = age;
            this.job = job;
            this.sayName = sayName;
        }
        
        function sayName(){
            alert(this.name);
        }
        
        var person1 = new Person("Nicholas", 29, "Software Engineer");
        var person2 = new Person("Greg", 27, "Doctor");
        
        person1.sayName();   //"Nicholas"
        person2.sayName();   //"Greg"

```
**缺点**是在全局作用域中定义的函数实际上只能被某个对象调用，这让全局作用域名不副实

4.原型模式

```
        function Person(){
        }
        
        Person.prototype.name = "Nicholas";
        Person.prototype.age = 29;
        Person.prototype.job = "Software Engineer";
        Person.prototype.sayName = function(){
            alert(this.name);
        };
        
        var person1 = new Person();
        person1.sayName();   //"Nicholas"
        
        var person2 = new Person();
        person2.sayName();   //"Nicholas"
```

5.组合使用方式


### **Javascript如何实现继承**？

许多OO语言支持接口继承和实现继承。
js只支持依靠**原型链**的实现继承。

**原型继承**：

```
function Foo() {
    this.value = 42;
}
Foo.prototype = {
    method: function() {}
};

function Bar() {}

// 设置Bar的prototype属性为Foo的实例对象
Bar.prototype = new Foo();
Bar.prototype.foo = 'Hello World';

// 修正Bar.prototype.constructor为Bar本身
Bar.prototype.constructor = Bar;

var test = new Bar() // 创建Bar的一个新实例
```

原型链继承的问题：

1.引用类型值被所有实例共享

2.创建子类型的实例时，不能在不影响所有实例的情况下向超类型的构造函数中传递参数。

为解决引用类型值被共享的问题，可使用**构造函数继承**，（在Sub上Super中的对象初始化代码）

	 function SuperType(){
	     this.colors = ["red", "blue", "green"];
	  }
	
	  function SubType(){  
	      //inherit from SuperType
	      SuperType.call(this);
	  }
	
	  var instance1 = new SubType();
	  instance1.colors.push("black");
          alert(instance1.colors);    //"red,blue,green,black"
	        
	  var instance2 = new SubType();
	        alert(instance2.colors);    //"red,blue,green"
	        
	       
组合继承：
超类型的原型中定义的方法对子类型不可见，也不能函数复用，因为每次 new 都会创建新的函数。所以采用组合继承。

             
        function SuperType(name){
            this.name = name;
            this.colors = ["red", "blue", "green"];
        }
        
        SuperType.prototype.sayName = function(){
            alert(this.name);
        };

        function SubType(name, age){  
            SuperType.call(this, name);
            
            this.age = age;
        }

        SubType.prototype = new SuperType();
        
        SubType.prototype.sayAge = function(){
            alert(this.age);
        };
        
        var instance1 = new SubType("Nicholas", 29);
        instance1.colors.push("black");
        alert(instance1.colors);  //"red,blue,green,black"
        instance1.sayName();      //"Nicholas";
        instance1.sayAge();       //29
        
       
        var instance2 = new SubType("Greg", 27);
        alert(instance2.colors);  //"red,blue,green"
        instance2.sayName();      //"Greg";
        instance2.sayAge();       //27
 
### **Javascript作用链域**?

[JavaScript中的作用域和执行上下文](https://blog.haoduoyu.cc/2016/09/07/JavaScript%E4%B8%AD%E7%9A%84%E4%BD%9C%E7%94%A8%E5%9F%9F%E5%92%8C%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87/)

### **谈谈this的理解**。

1.在全局运行上下文中（在任何函数体外部），this指代全局对象，无论是否在严格模式下。

```
// 在浏览器中，全局对象为 window 对象：
console.log(this === window); // true
```

2.直接调用函数，this的值会默认设置为全局对象，在严格模式下，this将会默认为undefined

```
function f1(){
  return this;
}

f1() === window; // true
```

3.当以对象里的方法的方式调用函数时，它们的 this 是调用该函数的对象.

```
var o = {
  prop: 37,
  f: function() {
    return this.prop;
  }
};

console.log(o.f()); // logs 37
```

当 o.f() 被调用时，函数内的this将绑定到o对象。

4.当一个函数被作为一个构造函数来使用（使用new关键字），它的this与即将被创建的新对象绑定。

```
function C(){
  this.a = 37;
}

var o = new C();
console.log(o.a); // logs 37
```
5.call 和 apply 都是为了改变某个函数运行时的上下文

```
function add(c, d){
  return this.a + this.b + c + d;
}

var o = {a:1, b:3};

add.call(o, 5, 7); // 1 + 3 + 5 + 7 = 16

add.apply(o, [10, 20]); // 1 + 3 + 10 + 20 = 34
```

>当一个对象没有某个方法，但是其他对象有，我们可以借助call或apply用其它对象的方法来操作

[JavaScript中的作用域和执行上下文](https://blog.haoduoyu.cc/2016/09/07/JavaScript%E4%B8%AD%E7%9A%84%E4%BD%9C%E7%94%A8%E5%9F%9F%E5%92%8C%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87/)

### **.call() 和 .apply() 的区别**？

	function a(xx) {        
	    this.b = xx;
	}
	var o = {};
	a.apply(o, [5]);
	alert(a.b);    // undefined
	alert(o.b);    // 5

call 和 apply 都是为了改变某个函数运行时的上下文（context）而存在的，换句话说，就是为了改变函数体内部 this 的指向。

对于 apply、call 二者而言，作用完全一样，只是接受参数的方式不太一样。call 需要把参数按顺序传递进去，而 apply 则是把参数放在数组里。　　

详见博客[JavaScript call() , apply() , bind()方法](http://www.jianshu.com/p/92d3e835764b)

	
### **什么是闭包（closure），为什么要用它**？

**内部函数总是可以**访问其所在的**外部函数**中声明的参数和变量，即使在其外部函数被返回了之后。换句话说，这些函数可以**记忆**它被创建时候的环境。

>所以闭包的本质源自两点，**词法作用域**和**函数当作值传递**。

> 所有的函数在被执行的时候都是闭包，因为它可以访问外部作用域的数据
 
**应用**：

1.每次触发自执行函数时，都相当于将当前循环的变量i存储了下来
```
   for (var i = 0; i < arr.length; i++) {
     (function (arg) {
         arr[i].onclick = function () {
             alert(arg);
         }
     })(i);
  }
```   


2.管理私有变量和私有方法

```
var Counter = (function() {
  var privateCounter = 0;
  // “闭包”内的函数可以访问 privateCounter 变量
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  }   
})();
```
  
3.将代码封装成一个闭包形式，合适的时候再使用，比如实现**柯里化**，createAssigner 返回了一个函数，这个返回的函数引用了外面的一个变量。  

```
 
 var createAssigner = function (keysFunc, undefinedOnly) {
    return function (obj) {
        //...
        keys = keysFunc(source)
        //...
        return obj;
    };
};

createAssigner(allKeys)(a, b)
createAssigner(keys)(c, b)

``` 
      
> 内存泄露是指你用不到的变量，依然占居着内存空间，不能被再次利用起来。闭包里面的变量是我们需要的变量，**不应说是内存泄露**   

   
[初识JavaScript闭包](https://blog.haoduoyu.cc/2016/09/11/%E5%88%9D%E8%AF%86JavaScript%E9%97%AD%E5%8C%85/)

### eval是做什么的？

eval()函数执行表示为字符串形式的JavaScript代码。

**避免在不必要的情况下使用eval** eval() 是一个危险的函数， 你的代码可能被恶意方在使用方的机器上使用恶意代码。

[LINK](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval)

### **什么是window对象? 什么是document对象**?

BOM(浏览器对象模型)的核心对象是**window**，它既是通过**js访问浏览器窗口的接口**，又是ecmascript规定的**global对象**

**document**对象是HTMLDocument的一个实例，表示整个html页面，也是window对象的一个属性。


### **null，undefined 的区别**？

使用var声明但未初始化时，变量值为undefined。

null表示一个空对象指针。

没有必要声明一个值为undefined，但是可以保存为null以体现null作为空指针的惯例。

http://bonsaiden.github.io/JavaScript-Garden/zh/#core.undefined

### **写一个通用的事件函数**。

	    var EventUtil = {
	
	    addHandler: function(element, type, handler){
	        if (element.addEventListener){
	            element.addEventListener(type, handler, false);
	        } else if (element.attachEvent){
	            element.attachEvent("on" + type, handler);
	        } else {
	            element["on" + type] = handler;
	        }
	    },
	    
	    getButton: function(event){
	        if (document.implementation.hasFeature("MouseEvents", "2.0")){
	            return event.button;
	        } else {
	            switch(event.button){
	                case 0:
	                case 1:
	                case 3:
	                case 5:
	                case 7:
	                    return 0;
	                case 2:
	                case 6:
	                    return 2;
	                case 4: return 1;
	            }
	        }
	    },
	    
	    getCharCode: function(event){
	        if (typeof event.charCode == "number"){
	            return event.charCode;
	        } else {
	            return event.keyCode;
	        }
	    },
	    
	    getClipboardText: function(event){
	        var clipboardData =  (event.clipboardData || window.clipboardData);
	        return clipboardData.getData("text");
	    },
	    
	    getEvent: function(event){
	        return event ? event : window.event;
	    },
	    
	    getRelatedTarget: function(event){
	        if (event.relatedTarget){
	            return event.relatedTarget;
	        } else if (event.toElement){
	            return event.toElement;
	        } else if (event.fromElement){
	            return event.fromElement;
	        } else {
	            return null;
	        }
	    
	    },
	    
	    getTarget: function(event){
	        return event.target || event.srcElement;
	    },
	    
	    getWheelDelta: function(event){
	        if (event.wheelDelta){
	            return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
	        } else {
	            return -event.detail * 40;
	        }
	    },
	    
	    preventDefault: function(event){
	        if (event.preventDefault){
	            event.preventDefault();
	        } else {
	            event.returnValue = false;
	        }
	    },
	
	    removeHandler: function(element, type, handler){
	        if (element.removeEventListener){
	            element.removeEventListener(type, handler, false);
	        } else if (element.detachEvent){
	            element.detachEvent("on" + type, handler);
	        } else {
	            element["on" + type] = null;
	        }
	    },
	    
	    setClipboardText: function(event, value){
	        if (event.clipboardData){
	            event.clipboardData.setData("text/plain", value);
	        } else if (window.clipboardData){
	            window.clipboardData.setData("text", value);
	        }
	    },
	    
	    stopPropagation: function(event){
	        if (event.stopPropagation){
	            event.stopPropagation();
	        } else {
	            event.cancelBubble = true;
	        }
	      }
	    };

### **事件是？IE与Netscape的事件机制有什么区别**？ 

js和html之间的交互是通过事件实现的，就是文档和浏览器窗口中发生的一些交互瞬间。

IE的事件流为**事件冒泡**

Netscape的事件流为**事件捕获**(很少使用)

![](https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=909690098,3692860007&fm=23&gp=0.jpg)

### **讲一讲事件委托机制**？

为解决事件处理程序过多问题，事件委托利用事件冒泡机制，指定一个事件处理程序，管理某一类型的所有事件。如：click会一直冒泡到document层次。

	// Get the element, add a click listener...
	document.getElementById("parent-list").addEventListener("click", function(e) {
	    // e.target is the clicked element
	    // If it was a list item
	    if(e.target && e.target.nodeName == "LI") {
	        // List item found.  Do whatever you want.
	        console.log("List item ", e.target.id.replace("post-"), " was clicked!");
	    }
	});


### javascript 代码中的"use strict";是什么意思 ? 使用它区别是什么？

ECMAScript5 引入严格模式

### 如何判断一个对象是否属于某个类？

		function Foo() {}
		function Bar() {}
		Bar.prototype = new Foo();
		
		new Bar() instanceof Bar; // true
		new Bar() instanceof Foo; // true
		
		// 如果仅仅设置 Bar.prototype 为函数 Foo 本身，而不是 Foo 构造函数的一个实例
		Bar.prototype = Foo;
		new Bar() instanceof Foo; // false
		

`var a = new A();a instance A` 不一定返回true，见例子	
	
	function A() {
	    return function B() {};
	}
	var a = new A();
	console.log(a instanceof A); // false
	
### **new操作符具体干了什么**?

当代码 new foo(...) 执行时：

1.一个新对象被创建。它继承自foo.prototype.
`foo.__proto__ === Foo.prototype`

2.构造函数 foo 被执行。执行的时候，相应的传参会被传入，同时this会被指定为这个新实例。

3.如果构造函数返回了一个“对象”，那么这个对象会取代整个new出来的结果。如果构造函数没有返回对象，那么new出来的结果为步骤1创建的对象，

>ps：一般情况下构造函数不返回任何值，不过用户如果想覆盖这个返回值，可以自己选择返回一个普通对象来覆盖。当然，返回数组也会覆盖，因为数组也是对象。


### Javascript中哪一个函数，执行时对象查找时，永远不会去查找原型？

hasOwnProperty() 检测一个属性是存在于实例中，还是存在于原型中

	Object.prototype.bar = 1; 
	var foo = {goo: undefined};
	
	foo.hasOwnProperty('bar'); // false
	foo.hasOwnProperty('goo'); // true

### js延迟加载的方式有哪些？

defer和async、动态创建DOM方式（用得最多）、按需异步载入js

### **Ajax 是什么? 如何创建一个Ajax**？

Asynchronous JavaScript + XML ,无需刷新页面就可以从服务器取得数据的技术。核心是XMLHttpRequest对象。

GET：
	var request = new XMLHttpRequest();
	request.open('GET', '/my/url', true);
	
	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    // Success!
	    var resp = request.responseText;
	  } else {
	    // We reached our target server, but it returned an error
	
	  }
	};
	
	request.onerror = function() {
	  // There was a connection error of some sort
	};
	
	request.send();

POST：

	var request = new XMLHttpRequest();
	request.open('POST', '/my/url', true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send(data);
	
### Ajax 解决浏览器缓存问题？

url加上随机数或者时间戳

[LINK](https://github.com/bigggge/gQuery/blob/master/src/gQuery.js#L893-L899)

### **同步和异步的区别**?

同步：如果在函数A返回的时候，调用者就能够得到预期结果(即拿到了预期的返回值或者看到了预期的效果)，那么这个函数就是同步的。

异步：如果在函数A返回的时候，调用者还不能够得到预期结果，而是需要在将来通过一定的手段得到，那么这个函数就是异步的。

详见博客：[浅谈JavaScript中的异步编程](https://blog.haoduoyu.cc/2016/12/05/%E6%B5%85%E8%B0%88JavaScript%E4%B8%AD%E7%9A%84%E5%BC%82%E6%AD%A5%E7%BC%96%E7%A8%8B/)


### ~~documen.write和 innerHTML的区别~~

### **DOM操作**?

 方法 | 描述
------------- | -------------
getElementById()	|返回带有指定 ID 的元素。
getElementsByTagName()	|返回包含带有指定标签名称的所有元素的节点列表（集合/节点数组）。
getElementsByClassName()|	返回包含带有指定类名的所有元素的节点列表。
appendChild()	|把新的子节点添加到指定节点。
removeChild()|	删除子节点。
replaceChild()|	替换子节点。
insertBefore()	|在指定的子节点前面插入新的子节点。
createAttribute()|	创建属性节点。
createElement()|	创建元素节点。
createTextNode()	|创建文本节点。
getAttribute()|	返回指定的属性值。
setAttribute()|	把指定属性设置或修改为指定的值。

### **内存泄漏**？

不管什么程序语言，内存生命周期基本是一致的：   

1.分配你所需要的内存

2.使用分配到的内存（读、写）

3.不需要时将其释放\归还

这个算法假定设置一个叫做根（root）的对象（在Javascript里，根是全局对象）。定期的，垃圾回收器将从根开始，找所有从根开始引用的对象，然后找这些对象引用的对象……从根开始，垃圾回收器将找到所有可以获得的对象和所有不能获得的对象。

从2012年起，所有现代浏览器都使用了标记-清除垃圾回收算法。

### **把 Script 标签 放在页面的最底部的body封闭之前 和封闭之后有什么区别？浏览器会如何解析它们**？

### **是什么阻塞了DOM**？


### polyfill 方案？

详见博客[Underscore.js 源码学习笔记](https://blog.haoduoyu.cc/2017/03/07/Underscore-js-%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/)

### 设计模式

**单例模式**

一个类只能有一个实例化对象

```
var singleton = function( fn ){
    var result;
    return function(){
        return result || ( result = fn .apply( this, arguments ) );
    }
}
 
var createMask = singleton( function(){
 
return document.body.appendChild( document.createElement('div') );
 
 })
```

**简单工厂模式**

工厂模式创建对象（视为工厂里的产品）时无需指定创建对象的具体类，可以把所有实例化的代码都集中在一个位置

```
var XMLHttpFactory =function(){};　　　　　　//这是一个简单工厂模式
　　XMLHttpFactory.createXMLHttp =function(){
　　　 var XMLHttp = null;
　　　　if (window.XMLHttpRequest){
　　　　　　XMLHttp = new XMLHttpRequest()
　　　 }elseif (window.ActiveXObject){
　　　　　　XMLHttp = new ActiveXObject("Microsoft.XMLHTTP")
　　　　}
　　return XMLHttp;
　　}
　　//XMLHttpFactory.createXMLHttp()这个方法根据当前环境的具体情况返回一个XHR对象。
```

**观察者模式**

观察者模式又叫发布订阅模式（Publish/Subscribe），它定义了一种一对多的关系，让多个观察者同时监听一个主题对象，这个主题对象的状态发生变化时就会通知所有的观察者

```
var events = (function () {
    var topics = {};

    return {
        publish: function (topic, info) {
            console.log('publish a topic:' + topic);
            if (topics.hasOwnProperty(topic)) {
                topics[topic].forEach(function (handler) {
                    handler(info ? info : {});
                })
            }
        },
        subscribe: function (topic, handler) {
            console.log('subscribe a topic:' + topic);
            if (!topics.hasOwnProperty(topic)) {
                topics[topic] = [];
            }

            topics[topic].push(handler);
        },
        remove: function (topic, handler) {
            if (!topics.hasOwnProperty(topic)) {
                return;
            }

            var handlerIndex = -1;
            topics[topic].forEach(function (element, index) {
                if (element === handler) {
                    handlerIndex = index;
                }
            });

            if (handlerIndex >= 0) {
                ////从第 handlerIndex 位开始删除 1 个元素
                topics[topic].splice(handlerIndex, 1);
            }
        },
        removeAll: function (topic) {
            console.log('remove all the handler on the topic:' + topic);
            if (topics.hasOwnProperty(topic)) {
                topics[topic].length = 0;
            }
        }
    }
})();


//主题监听函数
var handler = function (info) {
    console.log(info);
};

//订阅hello主题
events.subscribe('hello', handler);

//发布hello主题
events.publish('hello', 'hello world');
```

**职责链模式**

是使多个对象都有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系。将这个对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理他为止

>DOM里的事件冒泡机制和此类似，比如点击一个按钮以后，如果不阻止冒泡，其click事件将一直向父元素冒泡，利用这个机制也可以处理很多相关的问题


**建造者模式**可以将一个复杂对象的构建与其表示相分离，使得同样的构建过程可以创建不同的表示。

```
function getBeerById(id, callback) {
    // 使用ID来请求数据，然后返回数据.
    asyncRequest('GET', 'beer.uri?id=' + id, function (resp) {
        // callback调用 response
        callback(resp.responseText);
    });
}
```
### 公钥加密和私钥加密。

**公开密钥加密** 也称为非对称加密，需要一对密钥，一个是**私人密钥**，另一个则是**公开密钥**。这两个密钥是数学相关，用某用户密钥加密后所得的信息，只能用该用户的解密密钥才能解密。如果知道了其中一个，并不能计算出另外一个。因此如果公开了一对密钥中的一个，并不会危害到另外一个的秘密性质。称公开的密钥为公钥；不公开的密钥为私钥。**RSA**是常见的公钥加密算法。

**对称密钥加密** 又称为**私钥加密**，是密码学中的一类加密算法。这类算法在**加密和解密时使用相同的密钥**，或是使用两个可以简单地相互推算的密钥。实务上，这组密钥成为在两个或多个成员间的共同秘密，以便维持专属的通讯联系。与公开密钥加密相比，要求双方取得相同的密钥是对称密钥加密的主要缺点之一。常见的对称加密算法有 **DES、3DES、AES** 等


### **前端性能优化的方法**？

1.减少/最小化 http 请求数
2.延迟加载组件
3.使用CDN
4.加Expires或者Cache-Control头部
5.传输时用gzip等压缩组件
6.把样式放在顶部
7.把脚本放到底部
8.压缩JS和CSS

https://github.com/creeperyang/blog/issues/1

### **谈一谈你对ECMAScript6的了解**？

**箭头函数**

函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象

```
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

var id = 21;

foo.call({ id: 42 });
// id: 42
```

上面代码中，setTimeout的参数是一个箭头函数，这个箭头函数的定义生效是在foo函数生成时，而它的真正执行要等到100毫秒后。如果是**普通函数**，执行时this应该指向**全局对象window**，这时应该输出21。但是，箭头函数导致this**总是指向函数定义生效时所在的对象**（本例是{id: 42}），所以输出的是42。
 
**Class**

Class 是基于原型继承的语法糖

```
  class Circle {
        constructor(radius) {
            this.radius = radius;
            Circle.circlesMade++;
        };
        static draw(circle, canvas) {
            // Canvas绘制代码
        };
        static get circlesMade() {
            return !this._count ? 0 : this._count;
        };
        static set circlesMade(val) {
            this._count = val;
        };
        area() {
            return Math.pow(this.radius, 2) * Math.PI;
        };
        get radius() {
            return this._radius;
        };
        set radius(radius) {
            if (!Number.isInteger(radius))
                throw new Error("圆的半径必须为整数。");
            this._radius = radius;
        };
    }
```

类似于

```
function Circle(radius) {
        this.radius = radius;
        Circle.circlesMade++;
    }
    Circle.draw = function draw(circle, canvas) { /* Canvas绘制代码 */ }
    Object.defineProperty(Circle, "circlesMade", {
        get: function() {
            return !this._count ? 0 : this._count;
        },
        set: function(val) {
            this._count = val;
        }
    });
    Circle.prototype = {
        area: function area() {
            return Math.pow(this.radius, 2) * Math.PI;
        }
    };
    Object.defineProperty(Circle.prototype, "radius", {
        get: function() {
            return this._radius;
        },
        set: function(radius) {
            if (!Number.isInteger(radius))
                throw new Error("圆的半径必须为整数。");
            this._radius = radius;
        }
    });
```

Template Strings 模板字符串
 
// 字符串中嵌入变量
var name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`
 
http://babeljs.io/learn-es2015/


### **Promise**

为了解决callback hell,

所谓 Promise，简单说就是一个容器，里面保存着**某个未来才会结束的事件**（通常是一个异步操作）的结果。

Promise 对象代表一个**异步操作**，有三种状态：Pending（进行中）、Resolved（已完成，又称Fulfilled）和 Rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。


```
new Promise((resolve, reject) => {
    setTimeout(resolve('done'), 100);
}).then(value =>
    console.log(value)
).catch(error =>
    console.log(error)
);
```

### **谈谈你对 ES6 新的声明变量的方式的一些看法**

**let**

1.let声明的变量拥有**块级作用域**；ES5 只有全局作用域和函数作用域，没有块级作用域

```
// 用来计数的循环变量泄露为全局变量
var s = 'hello';

for (var i = 0; i < s.length; i++) {
  console.log(s[i]);
}

console.log(i); // 5
```

2.var命令会发生”变量提升“现象，let命令改变了语法行为，它所声明的变量一定要在声明后使用，否则报错

```
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```

**const**

const声明一个只读的常量。一旦声明，常量的值就**不能改变**。

```
const PI = 3.1415;
PI // 3.1415

PI = 3;
// TypeError: Assignment to constant variable.
```

### **const 声明的是常量，不能被改变喽**？

>const保证的并不是变量的值不得改动，而是变量指向的那个**内存地址不得改动**。
>
>对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。
>
>但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指针，const只能保证这个指针是固定的，至于它指向的数据结构是不是可变的，就完全不能控制了。

```
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
```

- 你说 Vue 中如果对象属性被修改无法被检测到，那么你有什么解决方案？
- 你提到了 Set 类型，那你讲下对 Es6 里 Map 类型的看法。

**Set**

它类似于数组，但是成员的值都是唯一的，没有重复的值


**Map**

它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

```
var m = new Map();
var o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
```