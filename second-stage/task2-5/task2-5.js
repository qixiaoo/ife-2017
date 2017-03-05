/* 左侧入按钮事件处理程序 */
function leftIn() {

    var item = createItem();
    item.classList.add("grow");

    var panel = document.getElementById("panel");

    if (panel.childElementCount >= 60) {
        alert("最多添加60条数据");
        return false;
    }

    panel.insertBefore(item, panel.firstElementChild);

    return false;
}

/* 右侧入按钮事件处理程序 */
function rightIn() {

    var item = createItem();
    item.classList.add("grow");

    var panel = document.getElementById("panel");

    if (panel.childElementCount >= 60) {
        alert("最多添加60条数据");
        return false;
    }

    panel.appendChild(item);

    return false;
}

/* 左侧出按钮事件处理程序 */
function leftOut() {

    var panel = document.getElementById("panel");
    panel.firstElementChild.classList.add("shrink");

    var handler = setTimeout(function () {

        panel.removeChild(panel.firstElementChild);
        clearTimeout(handler);

    }, 600);

    return false;
}

/* 右侧出按钮事件处理程序 */
function rightOut() {

    var panel = document.getElementById("panel");
    panel.lastElementChild.classList.add("shrink");

    var handler = setTimeout(function () {

        panel.removeChild(panel.lastElementChild);
        clearTimeout(handler);

    }, 600);

    return false;
}

/* 清空按钮事件处理程序 */
function clear() {

    document.getElementById("panel").innerHTML = "";
}

/* 清空动画效果 */
function clearAnimation() {
    
    var items = document.getElementById("panel").childNodes;
    
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove("grow");
    }
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

    // 用 setInterval 函数代替for循环来遍历排序        
    i = 0;
    var handler = setInterval(function () {

        if (i >= itemArray.length - 1) {
            clearInterval(handler);
        }

        var flag = 0; // 若一轮比较未发生交换，则说明顺序已排好，flag 为判断是否发生交换的标记

        for (var j = 0; j < itemArray.length - i - 1; j++) {

            a = parseInt(itemArray[j].innerHTML);
            b = parseInt(itemArray[j + 1].innerHTML);

            if (a > b) {

                clearAnimation();
                panel.insertBefore(itemArray[j + 1], itemArray[j]);
                itemArray[j + 1].classList.add("grow");

                item = itemArray[j + 1];
                itemArray[j + 1] = itemArray[j];
                itemArray[j] = item;

                flag = 1;
            }
        }

        i++;

        if (flag == 1) flag = 0;
        else clearInterval(handler);
        
    }, 500);

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

}

/* 为队列item绑定事件 */
function bindEventForItem(item) {

    item.onclick = removeItem;

}

/* 创建一个item */
function createItem(height) {

    var item = document.createElement("div");
    var text = document.getElementById("data").value; // 获取输入框的文本

    if (height)
        text = height + "";
    else {
        // 验证表单输入是否为数字
        if (text == "" || isNaN(text)) {
            alert("必需为数字");
            return null;
        }
    }

    var num = parseInt(text);
    if (num < 10 || num > 100) {
        alert("数字必需在10-100之间");
        return null;
    }

    // 为 item 设置合适的高度
    num = 3.9 * num;
    item.style.height = num + "px";

    document.getElementById("data").value = "";
    item.className = "item";
    item.setAttribute("title", "点击删除");
    item.innerHTML = text;
    bindEventForItem(item);

    return item;
}

/* 初始化页面，创建几个item */
function init() {

    var item, num;
    var panel = document.getElementById("panel");

    if (panel.childElementCount >= 60) {
        alert("最多添加60条数据");
        return false;
    }

    for (var i = 0; i < 10; i++) {
        num = Math.floor(Math.random() * 100 % 100);
        if (num < 10)
            num += 10;
        item = createItem(num);

        panel.appendChild(item);
    }

}

window.onload = function () {
    init();
    bindEventForBtn();
}