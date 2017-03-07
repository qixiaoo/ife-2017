/**
 * 便捷的据 CSS id 选择器获取元素的方法
 */
function $(selector) {

    return document.getElementById(selector.substring(1, selector.length));
}

/**
 * 二叉树的先序遍历算法
 */
function preOrderTraverse(e) {

    if (e != null) {

        addToQueue(e);

        preOrderTraverse(e.firstElementChild);

        if (e.firstElementChild != null)
            preOrderTraverse(e.firstElementChild.nextElementSibling);
    }
}

/**
 * 二叉树的中序遍历算法
 */
function inOrderTraverse(e) {

    if (e != null) {

        inOrderTraverse(e.firstElementChild);

        addToQueue(e);

        if (e.firstElementChild != null)
            inOrderTraverse(e.firstElementChild.nextElementSibling);
    }
}

/**
 * 二叉树的后序遍历算法
 */
function postOrderTraverse(e) {

    if (e != null) {

        postOrderTraverse(e.firstElementChild);

        if (e.firstElementChild != null)
            postOrderTraverse(e.firstElementChild.nextElementSibling);
        
        addToQueue(e);
    }
}

/**
 * 为按钮绑定事件
 */
function bindEventForBtn() {

    $("#pre-order").onclick = function () {
        animationQueue = [];
        preOrderTraverse(tree.firstElementChild);
        renderQueue();
    };

    $("#in-order").onclick = function () {
        animationQueue = [];
        inOrderTraverse(tree.firstElementChild);
        renderQueue();
    }

    $("#post-order").onclick = function () {
        animationQueue = [];
        postOrderTraverse(tree.firstElementChild);
        renderQueue();
    }
}

/**
 * 将节点添加到动画队列
 */
function addToQueue(e) {

    animationQueue.push(e);
}

/**
 * 渲染动画
 */
function renderQueue() {

    var i = 0;

    var handler = setInterval(function () {

        if (i >= animationQueue.length)
            clearInterval(handler);

        if (i != 0)
            animationQueue[i - 1].classList.remove("mark"); // 清除上一次遍历的痕迹

        animationQueue[i].classList.add("mark");
        i++;

    }, 1000);
}

var tree = $("#tree");
var animationQueue = [];

window.onload = bindEventForBtn;