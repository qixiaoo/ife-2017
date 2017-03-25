var Event = {
    // handlers 对象以事件名作为属性名，绑定的回调函数数组作为属性值
    handlers: {},

    // 注册监听的函数
    $watch: function (event, handler) {
        var self = this;

        // 若 handlers 不存在此事件，则添加进去
        if (!(event in self.handlers)) {
            self.handlers[event] = [];
        }
        self.handlers[event].push(handler); // 将事件处理程序加入回调函数数组
        return this;
    },

    // 取消对事件的监听
    $detach: function (event) {
        var self = this;

        for (var key in self.handlers) {
            if (self.handlers.hasOwnProperty(key) && key == event) {
                delete self.handlers[key];
            }
        }
    },

    // 发布事件的函数
    emit: function (event) {
        var self = this;
        var handlerArgs = Array.prototype.slice.call(arguments, 1); // 回调函数的参数数组
        var eventArr = event.split(".");

        // 从父元素将事件传递给子元素
        for (var idx = 0; idx < eventArr.length; idx++) {
            event = eventArr[idx];
            // 若没有函数监听此事件，返回
            if (!(event in self.handlers))
                continue;

            // 依次调用所有回调函数
            for (var i = 0; i < self.handlers[event].length; i++) {
                self.handlers[event][i].apply(self, handlerArgs);
            }
        }
        return self;
    }
}

// 安装事件
function installEvent(obj, event) {

    for (var key in event) {
        obj[key] = event[key];
    }
}

// Vue 的构造函数
function Vue(data) {
    this.parent = Array.prototype.slice.call(arguments, 1)[0] || "data";
    this.data = data;
    this.walk(data);
}

var p = Vue.prototype; // 构造函数的原型对象

// 遍历对象自己拥有的属性，为它们添加访问器方法
p.walk = function (obj) {
    var key,
        val;

    // 遍历对象的属性
    for (key in obj) {
        // 获取对象本身拥有的属性
        if (obj.hasOwnProperty(key)) {
            val = obj[key];

            if (typeof val === "object") {
                new Vue(val, this.parent + "." + key); // 如果属性仍然为对象，则递归遍历
            }

            this.convert(key, val, this.parent); // 为拥有属性的对象添加访问器属性,并传递负父元素
        }
    }
};

// 为对象添加访问器属性
p.convert = function (key, val, parent) {
    var self = this;
    var keys = parent + "." + key;

    Object.defineProperty(self.data, key, {
        enumerable: true,
        configurable: true,
        // get 和 set 函数是个闭包，可以通过它们访问 val，使 val 驻留在内存中
        get: function () {
            console.log("你访问了 " + key);
            return val;
        },
        set: function (newVal) {
            console.log("你设置了 " + key + "，新的值为 " + newVal);

            if (typeof newVal === "object" && newVal !== null) {
                // 为对象的属性绑定访问器属性
                new Vue(newVal, parent);
            }

            // 发布事件
            self.emit(keys, newVal);

            val = newVal;
        }
    });
};

// 安装事件
installEvent(p, Event);

let app2 = new Vue({
    el: '#app',
    data: {
        user: {
            name: 'youngwind',
            age: 25
        }
    }
});

// 把数据渲染成内容
window.onload =  function () {
    var dom = document.querySelectorAll(app2.data.el);
    
    for (var i = 0; i < dom.length; i++) {
        var mark = dom[i].innerHTML.match(/\{\{.*\}\}/g);
        
        for (var j = 0; j < mark.length; j++) {
            var keys = mark[j].replace(/[\{\}]/g, "");
            var property = keys.split(".");
            var text = app2.data.data;
            
            for (var k = 0; k < property.length; k++) {
                var pro = property[k];
                text = text[pro];
            }
            
            dom[i].innerHTML = dom[i].innerHTML.replace(mark[j], text);
        }
    }
}