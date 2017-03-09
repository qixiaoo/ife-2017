/**
 * 据id获取元素的方法
 */
function $(str) {

    return document.getElementById(str.substring(1, str.length));
}

/**
 * 清除上一次匹配结果的样式
 */
function clearStyle() {

    var tips = document.querySelectorAll(".tip");
    var inputs = document.querySelectorAll("input");

    tips[0].classList.remove("info-error");
    tips[0].classList.remove("info-success");


    inputs[0].classList.remove("info-error");
    inputs[0].classList.remove("info-success");
}

/**
 * check-1 按钮的事件处理程序
 */
function check_1() {

    var input = $("#input-1");
    var tip = document.getElementsByClassName("tip")[0];
    var count = countLength(input.value);
    
    clearStyle();

    if (count >= 4 && count <= 16) {
        tip.innerHTML = "名称格式正确";
        tip.classList.add("info-success");
        input.classList.add("info-success");
    } else if (count == 0) {
        tip.innerHTML = "姓名不能为空";
        tip.classList.add("info-error");
        input.classList.add("info-error");
    } else {
        tip.innerHTML = "名称格式不正确";
        tip.classList.add("info-error");
        input.classList.add("info-error");
    }
}

/**
 * 检测字符数
 */
function countLength(str) {
    
    var inputLength = 0;
    
    for (var i = 0; i < str.length; i++) {
        var countCode = str.charCodeAt(i);
        if (countCode >= 0 && countCode <= 128) {
            inputLength += 1;
        } else {
            inputLength += 2;
        }
    }
    return inputLength;
}

/**
 * 为按钮绑定事件
 */
function bindEventForBtn() {

    $("#check-1").onclick = check_1;
}

window.onload = bindEventForBtn;