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
 * 左转按钮的事件处理程序
 */
function turnLeft() {
    var block = $("#block"),
        angleNow = angle(block);
    
    angleNow = angleNow - 90;
    
    angle(block, angleNow);
}

/**
 * 右转按钮的事件处理程序
 */
function turnRight() {
    var block = $("#block"),
        angleNow = angle(block);
    
    angleNow = angleNow + 90;
    
    angle(block, angleNow);
}

/**
 * 向后转按钮的事件处理程序
 */
function turnBack() {
    var block = $("#block"),
        angleNow = angle(block);
    
    angleNow = angleNow + 180;
    
    angle(block, angleNow);
}

/**
 * go 转按钮的事件处理程序
 */
function go() {
    var block = $("#block"),
        angleNow = angle(block);
    
    angleNow = angleNow % 360;
    angleNow = angleNow >= 0 ? angleNow : (angleNow + 360);
    
    var left = parseInt(block.style.left),
        top = parseInt(block.style.top);
    
    if (angleNow == 0) {
        if (top >= 50)
            block.style.top = (top - 50) + "px";
    }
    if (angleNow == 90) {
        if (left <= 400)
            block.style.left = (left + 50) + "px";
    }
    if (angleNow == 180) {
        if (top <= 400)
            block.style.top = (top + 50) + "px";
    }
    if (angleNow == 270) {
        if (left >= 50)
            block.style.left = (left - 50) + "px";
    }
}

/**
 * 为按钮绑定事件
 */
function bindEventForBtn() {
    $("#go").onclick = go;
    $("#turn-left").onclick = turnLeft;
    $("#turn-right").onclick = turnRight;
    $("#turn-back").onclick = turnBack;
}

window.onload = bindEventForBtn;