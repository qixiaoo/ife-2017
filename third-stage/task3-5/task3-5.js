/**
 * 获取或设置元素的旋转角度
 */
function angle(element, ang) {
    // 参数为1，获取元素旋转角度
    if (arguments.length === 1) {
        var text = element.style.transform;
        text = text.substring(7, text.length);
        text = parseInt(text);
        return text;
    }
    // 参数为2，设置元素旋转角度
    if (arguments.length === 2) {
        element.style.transform = "rotate(" + ang + "deg)";
        return;
    }
}

/**
 * 便捷的据 id 获取元素的方法
 */
function $(id_selector) {
    return document.getElementById(id_selector.substring(1, id_selector.length));
}

/**
 * 根据传入的参数平移一格
 */
function go(direction) {

    var block = $("#block");
    var left = parseInt(block.style.left),
        top = parseInt(block.style.top);

    if (direction === "lef")
        if (left >= 50)
            block.style.left = (left - 50) + "px";
    if (direction === "top")
        if (top >= 50)
            block.style.top = (top - 50) + "px";
    if (direction === "rig")
        if (left <= 400)
            block.style.left = (left + 50) + "px";
    if (direction === "bot")
        if (top <= 400)
            block.style.top = (top + 50) + "px";
}

/**
 * TRA-* 按钮的事件处理程序
 */
function trace() {
    
    var direction = this.getAttribute("id").split("-")[1];
    
    go(direction);
}

/**
 * mov-* 按钮的事件处理程序
 */
function move() {
    
    var block = $("#block");
    var direction = this.getAttribute("id").split("-")[1];
    
    if (direction === "lef") {
        angle(block, 270);
        go(direction);
    }
    if (direction === "top") {
        angle(block, 0);
        go(direction);
    }
    if (direction === "rig") {
        angle(block, 90);
        go(direction);
    }
    if (direction === "bot") {
        angle(block, 180);
        go(direction);
    }
}

/**
 * 为按钮绑定事件
 */
function bindEventForBtn() {
    $("#mov-lef").onclick = move;
    $("#mov-top").onclick = move;
    $("#mov-rig").onclick = move;
    $("#mov-bot").onclick = move;
    
    $("#tra-lef").onclick = trace;
    $("#tra-top").onclick = trace;
    $("#tra-rig").onclick = trace;
    $("#tra-bot").onclick = trace;
}

window.onload = bindEventForBtn;