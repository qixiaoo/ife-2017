/**
 * 便捷的据 CSS id 选择器获取元素的方法
 */
function $(selector) {

    return document.getElementById(selector.substring(1, selector.length));
}

/**
 * 树的先序遍历算法
 */
function preOrderTraverse(e) {

    if (e != null) {

        match(e, arguments[1]);

        var count = e.childElementCount;
        var node = e.firstElementChild;

        for (var i = 0; i < count; i++) {
            preOrderTraverse(node, arguments[1]);
            node = node.nextElementSibling;
        }
    }
}

/**
 * 树的后序遍历算法
 */
function postOrderTraverse(e) {

    if (e != null) {

        var count = e.childElementCount;
        var node = e.firstElementChild;

        for (var i = 0; i < count; i++) {
            postOrderTraverse(node, arguments[1]);
            node = node.nextElementSibling;
        }

        match(e, arguments[1]);
    }
}

/**
 * 为页面中的所有节点绑定选择的事件处理程序
 */
function bindEventForNodes() {

    var nodes = document.querySelectorAll(".node");

    // 遍历节点，绑定事件处理程序
    for (var i = 0; i < nodes.length; i++) {

        nodes[i].onclick = function (event) {

            // 清除之前选中元素的痕迹
            var selectedNodes = document.querySelectorAll(".selected");
            for (var j = 0; j < selectedNodes.length; j++) {
                selectedNodes[j].classList.remove("selected");
                selectedNodes[j].classList.remove("mark");
            }

            this.classList.add("selected");
            this.classList.add("mark");

            event.stopPropagation(); // 阻止事件进一步传播
        };
    }
}

/**
 * 清除搜索匹配的痕迹的函数
 */
function clearSearchInfo() {

    var str = tree.innerHTML;
    str = str.replace(/<span class=\"red\">/g, "");
    str = str.replace(/<\/span>/g, "");
    tree.innerHTML = str;

    var nodes = document.querySelectorAll(".node");
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].removeAttribute("pattern"); // 清除上一次匹配节点添加的pattern属性
        nodes[i].classList.remove("mark");
    }
}

/**
 * “搜索”按钮的事件处理程序
 */
function find() {

    // 清除上一次匹配的痕迹
    clearSearchInfo();

    animationQueue = [];
    preOrderTraverse(tree.firstElementChild, $("#search").value);
    renderQueue();

    $("#search").value = "";
}

/**
 * “删除”按钮的事件处理程序
 */
function deleteNode() {

    var node = document.querySelectorAll(".selected");
    
    if (node.length == 0) {
        alert("请先选中要删除的节点");
        return;
    }
    
    node[0].parentNode.removeChild(node[0]);
}

/**
 * “添加”按钮的事件处理程序
 */
function add() {

    var text = $("#data").value;
    var selectedNodes = document.querySelectorAll(".selected");
    $("#data").value = "";
    
    if (selectedNodes.length == 0) {
        alert("请先选中一个节点");
        return;
    }

    var node = document.createElement("div");
    node.setAttribute("class", "node");
    node.appendChild(document.createTextNode(text));
    selectedNodes[0].appendChild(node);

    node.onclick = function (event) {

        // 清除之前选中元素的痕迹
        var nodes = document.querySelectorAll(".selected");
        for (var j = 0; j < nodes.length; j++) {
            nodes[j].classList.remove("selected");
            nodes[j].classList.remove("mark");
        }

        this.classList.add("selected");
        this.classList.add("mark");

        event.stopPropagation(); // 阻止事件进一步传播
    };

    // 清除之前选中元素的痕迹
    selectedNodes[0].classList.remove("selected");
    selectedNodes[0].classList.remove("mark");
}

/**
 * 为按钮绑定事件
 */
function bindEventForBtn() {

    $("#pre-order").onclick = function () {
        animationQueue = []; // 重置动画队列
        clearSearchInfo(); // 清除搜索匹配的痕迹
        preOrderTraverse(tree.firstElementChild);
        renderQueue(); // 渲染结果
    };

    $("#post-order").onclick = function () {
        animationQueue = []; // 重置动画队列
        clearSearchInfo(); // 清除搜索匹配的痕迹
        postOrderTraverse(tree.firstElementChild);
        renderQueue(); // 渲染结果
    }

    $("#find").onclick = find;

    $("#add").onclick = add;

    $("#delete").onclick = deleteNode;
}

/**
 * 检查节点是否包含指定字符串，并加入动画队列
 */
function match(e, str) {

    var children = e.childNodes;

    for (var i = 0; i < children.length; i++) {

        // 若为文本节点
        if (children[i].nodeType === 3 && children[i].nodeValue.indexOf(str) !== -1) {
            e.setAttribute("pattern", str); // 若文本节点包含搜索的内容，给此节点加上pattern属性作为标记
        }
    }

    animationQueue.push(e);
}

/**
 * 渲染动画
 */
function renderQueue() {

    var i = 0; // 动画队列索引

    // 用setInterval函数来遍历动画队列
    var handler = setInterval(function () {

        // 若i超过动画队列长度，退出
        if (i >= animationQueue.length) {
            clearInterval(handler);
            animationQueue[i - 1].classList.remove("mark"); // 清除上一次遍历的痕迹
            return;
        }

        if (i != 0)
            animationQueue[i - 1].classList.remove("mark"); // 清除上一次遍历的痕迹

        var pattern = animationQueue[i].getAttribute("pattern"); // pattern为节点所匹配的字符串

        // 若节点匹配搜索框中的字符串，突出显示匹配的文本
        if (pattern) {

            var children = Array.prototype.slice.call(animationQueue[i].childNodes); // 获取节点的子元素数组
            var length = children.length;

            for (var j = 0; j < length; j++) { // 遍历节点的子元素数组

                // 将节点的文本子节点匹配pattern的部分突出显示
                if (children[j].nodeType === 3 && children[j].nodeValue.indexOf(pattern) !== -1) {

                    var text = children[j].nodeValue.split(pattern);
                    animationQueue[i].removeChild(children[j]);

                    for (var k = text.length - 1; k >= 0; k--) {
                        var textNode = document.createTextNode(text[k]);
                        animationQueue[i].insertBefore(textNode, animationQueue[i].firstChild);

                        if (k === 0)
                            break;

                        var span = document.createElement("span");
                        span.setAttribute("class", "red");
                        span.appendChild(document.createTextNode(pattern));
                        animationQueue[i].insertBefore(span, animationQueue[i].firstChild);
                    }

                }
            }

        }

        animationQueue[i].classList.add("mark");
        i++;

    }, 1000);
}

var tree = $("#tree");
var animationQueue = [];

window.onload = function () {
    bindEventForBtn();
    bindEventForNodes();
};