/* 左侧入按钮的事件处理程序 */
function leftIn() {

    var itemArray = createItem();
    var panel = document.getElementById("panel");

    itemArray.forEach(function (item, index, array) {

        item.classList.add("grow");

        if (panel.childElementCount >= 60) {
            alert("最多添加60条数据");
            return false;
        }
        
        panel.insertBefore(item, panel.firstElementChild);
    });

    return false;
}

/* 右侧入按钮的事件处理程序 */
function rightIn() {
    
    var itemArray = createItem();
    var panel = document.getElementById("panel");

    itemArray.forEach(function (item, index, array) {

        item.classList.add("grow");

        if (panel.childElementCount >= 60) {
            alert("最多添加60条数据");
            return false;
        }
        
        panel.appendChild(item);
    });

    return false;
}

/* 左侧出按钮的事件处理程序 */
function leftOut() {

    var panel = document.getElementById("panel");
    panel.firstElementChild.classList.add("shrink");

    var handler = setTimeout(function () {

        panel.removeChild(panel.firstElementChild);
        clearTimeout(handler);

    }, 600);

    return false;
}

/* 右侧出按钮事件的处理程序 */
function rightOut() {

    var panel = document.getElementById("panel");
    panel.lastElementChild.classList.add("shrink");

    var handler = setTimeout(function () {

        panel.removeChild(panel.lastElementChild);
        clearTimeout(handler);

    }, 600);

    return false;
}

/* 搜索按钮的事件处理程序 */
function find() {

    var panel = document.getElementById("panel");
    var items = panel.childNodes;
    var text = document.getElementById("search").value;
    var left = "<span class=\"mark\">", right = "</span>";
    var left_exp = /<span class=\"mark\">/g, right_exp = /<\/span>/g;
    var str, newStr;
    
    for (var i = 0; i < items.length; i++) {
        
        // 清除上一次匹配的痕迹
        str = items[i].innerHTML.replace(left_exp, "");
        str = str.replace(right_exp, "");
        
        newStr = str.split(text).join(left + text + right);
        items[i].innerHTML = newStr;
        
    }
    
    document.getElementById("search").value = "";
}

/* 清空按钮事件处理程序 */
function clear() {

    document.getElementById("panel").innerHTML = "";
}

/* 排序按钮的事件处理程序（使用冒泡排序） */
function sort() {

    var panel = document.getElementById("panel");
    var itemArray = new Array();

    var item;
    var a, b;

    // 获取item数组
    for (var i = 0; i < panel.childNodes.length; i++)
        itemArray[i] = panel.childNodes[i];

    // 遍历排序
    for (i = 0; i < itemArray.length - 1; i++) {

        var flag = 0; // 若一轮比较未发生交换，则说明顺序已排好，flag 为判断是否发生交换的标记

        for (var j = 0; j < itemArray.length - i - 1; j++) {

            a = parseInt(itemArray[j].getAttribute("height"));
            b = parseInt(itemArray[j + 1].getAttribute("height"));

            if (a > b) {

                panel.insertBefore(itemArray[j + 1], itemArray[j]);
                itemArray[j + 1].classList.remove("grow");
                itemArray[j + 1].classList.add("grow");

                item = itemArray[j + 1];
                itemArray[j + 1] = itemArray[j];
                itemArray[j] = item;

                flag = 1;
            }
        }

        if (flag == 1) flag = 0;
        else break;
    }

    return false;
}

/* 队列item被点击时的事件处理程序 */
function removeItem() {

    var item = this;
    var panel = document.getElementById("panel");

    // 传统方式处理类好麻烦
    var classes = item.className.split(" ");
    classes.push("shrink");
    item.className = classes.join(" ");

    var handler = setTimeout(function () {

        panel.removeChild(item);
        clearTimeout(handler);

    }, 600);

}

/* 为按钮绑定事件 */
function bindEventForBtn() {

    document.getElementById("left-in").onclick = leftIn;
    document.getElementById("right-in").onclick = rightIn;
    document.getElementById("left-out").onclick = leftOut;
    document.getElementById("right-out").onclick = rightOut;
    document.getElementById("sort").onclick = sort;
    document.getElementById("clear").onclick = clear;
    document.getElementById("init").onclick = init;
    document.getElementById("find").onclick = find;

}

/* 为队列item绑定事件 */
function bindEventForItem(item) {

    item.onclick = removeItem;

}

/* 创建item，返回一个item数组 */
function createItem(height) {

    var item = document.createElement("div");
    var itemArray = [];
    var text = document.getElementById("data").value; // 获取输入框的文本
    document.getElementById("data").value = "";

    if (height)
        text = height + "";
    else {
        text = text.split(/[,，、;；\s]+/g);
    }

    if (!height) {

        for (var idx = 0; idx < text.length; idx++) {

            item = document.createElement("div");
            
            if (text[idx] == "")
                continue;
            
            item.className = "item";
            item.setAttribute("title", "点击删除");
            item.innerHTML = text[idx];
            bindEventForItem(item);
            
            var number = Math.floor(Math.random() * 100 % 100);
            if (number < 10)
                number += 10;
            number = 3.9 * number;
            
            item.style.height = number + "px";
            item.setAttribute("height", number);

            itemArray.push(item);
        }

        return itemArray;
    }


    // 为 item 设置合适的高度
    num = checkNum(text);
    item.style.height = num + "px";
    item.setAttribute("height", num);

    item.className = "item";
    item.setAttribute("title", "点击删除");
    item.innerHTML = text;
    bindEventForItem(item);

    itemArray.push(item);

    return itemArray;
}

/* 检查输入是否为数字，若为数字，则按比例放大 */
function checkNum(data) {

    // 验证表单输入是否为数字
    if (data == "" || isNaN(data)) {
        alert("必需为数字");
        return null;
    }

    var num = parseInt(data);
    if (num < 10 || num > 100) {
        alert("数字必需在10-100之间");
        return null;
    }

    num = 3.9 * num;

    return num;
}

/* 初始化页面，创建几个item */
function init() {

    var item, num;
    var panel = document.getElementById("panel");

    if (panel.childElementCount >= 60) {
        alert("最多添加60条数据");
        return false;
    }

    for (var i = 0; i < 60; i++) {
        num = Math.floor(Math.random() * 100 % 100);
        if (num < 10)
            num += 10;
        item = createItem(num)[0];

        panel.appendChild(item);
    }

}

window.onload = function () {
    init();
    bindEventForBtn();
}