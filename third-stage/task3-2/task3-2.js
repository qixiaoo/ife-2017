var tip1 = "必填，长度为为4~16个字符",
    tip2 = "可以为字母、数字或下划线",
    tip3 = "再次输入相同的密码",
    tip4 = "你的邮箱地址",
    tip5 = "你的手机号码";

var info1 = "名称不能为空",
    info2 = "密码不能为空",
    info3 = "邮箱不能为空",
    info4 = "手机不能为空",
    info5 = "密码不一致",
    info6 = "密码可用",
    info7 = "密码输入一致",
    info8 = "邮箱格式正确",
    info9 = "邮箱格式错误",
    info10 = "手机格式正确",
    info11 = "手机格式错误",
    info12 = "名称不可用",
    info13 = "名称可用",
    info14 = "密码不可用";

/**
 * 获取元素的便捷方法
 */
function $(str) {

    return document.querySelectorAll(str);
}

/**
 * 清除上一次匹配结果的样式
 */
function clearStyle(input) {

    var tipBox = input.parentNode.nextElementSibling;
    
    input.classList.remove("info-error");
    input.classList.remove("info-success");
    
    tipBox.classList.remove("info-error");
    tipBox.classList.remove("info-success");
}

/**
 * 检验表单中的数据
 */
function check(input) {

    var id = input.getAttribute("id");
    var value = input.value;
    var patternName = /^[0-9a-zA-Z\u4e00-\u9fa5]{4,16}$/g,
        patternPassword = /[\da-zA-Z_]+/g,
        patternMail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/g,
        patternPhone = /^1[3|4|5|8][0-9]\d{4,8}$/g;
    
    if (id === "name") {
        return patternName.test(value);
    } 
    if (id === "password") {
        return patternPassword.test(value);
    } 
    if (id === "confirm") {
        var password = $("#password")[0].value;
        if (value.length === 0)
            return false;
        return (value === password);
    } 
    if (id === "e-mail") {
        return patternMail.test(value);
    } 
    if (id === "phone") {
        return patternPhone.test(value);
    }
}

/**
 * 检验表单，添加样式
 */
function test(input) {
    
    var value = input.value;
    var id = input.getAttribute("id");
    var tipBox = input.parentNode.nextElementSibling;
    var isTrue = check(input);
    
    if (isTrue) {
        input.classList.add("info-success");
        tipBox.classList.add("info-success");
    }
    else {
        input.classList.add("info-error");
        tipBox.classList.add("info-error");
    }
    
    if (id === "name") {
        if (isTrue)
            tipBox.innerHTML = info13;
        else if (value.length === 0)
            tipBox.innerHTML = info1;
        else
            tipBox.innerHTML = info12;
    } 
    if (id === "password") {
        if (isTrue)
            tipBox.innerHTML = info6;
        else if (value.length === 0)
            tipBox.innerHTML = info2;
        else
            tipBox.innerHTML = info14;
    } 
    if (id === "confirm") {
        if (isTrue)
            tipBox.innerHTML = info7;
        else
            tipBox.innerHTML = info5;
    } 
    if (id === "e-mail") {
        if (isTrue)
            tipBox.innerHTML = info8;
        else if (value.length === 0)
            tipBox.innerHTML = info3;
        else
            tipBox.innerHTML = info9;
    } 
    if (id === "phone") {
        if (isTrue)
            tipBox.innerHTML = info10;
        else if (value.length === 0)
            tipBox.innerHTML = info4;
        else
            tipBox.innerHTML = info11;
    }
}

/**
 * “提交”按钮的事件处理程序
 */
function submit() {
    
    inputs = $("input");
    
    for (var i = 0; i < inputs.length; i++) {
        test(inputs[i]);
    }
}

/**
 * input 获得焦点时的事件处理程序
 */
function focus() {
    
    clearStyle(this);
    var id = this.getAttribute("id");
    var tipBox = this.parentNode.nextElementSibling;
    
    if (id === "name") {
        tipBox.innerHTML = tip1;
    }
    if (id === "password") {
        tipBox.innerHTML = tip2;
    }
    if (id === "confirm") {
        tipBox.innerHTML = tip3;
    }
    if (id === "e-mail") {
        tipBox.innerHTML = tip4;
    } 
    if (id === "phone") {
        tipBox.innerHTML = tip5;
    }
}

/**
 * input 失去焦点时的事件处理程序
 */
function blur() {
    
    test(this);
}

/**
 * 为按钮绑定事件
 */
function bindEventForBtn() {

    $("#submit")[0].onclick = submit;
}

/**
 * 为输入框绑定事件
 */
function bindEventForInput() {
    
    var inputs = $("input");
    
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].onfocus = focus;
        inputs[i].onblur = blur;
    }
}

window.onload = function () {
    bindEventForBtn();
    bindEventForInput();
}