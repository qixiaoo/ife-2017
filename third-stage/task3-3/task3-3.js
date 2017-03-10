var select1 = "<option value=\"1-1\">北京大学</option><option value=\"1-2\">清华大学</option><option value=\"1-3\">中国人民大学</option>";
var select2 = "<option value=\"2-1\">上海交通大学</option><option value=\"2-2\">复旦大学</option><option value=\"2-3\">同济大学</option>";
var select3 = "<option value=\"3-1\">南开大学</option><option value=\"3-2\">天津大学</option><option value=\"3-3\">天津师范大学</option>";

/**
 * 便捷的选择元素方法
 */
function $(selector) {
    
    return document.querySelectorAll(selector);
}

/**
 * radio 被点击触发的事件
 */
function toggle() {
    
    var id = this.getAttribute("id");
    var row2 = $(".row")[1];
    var row3 = $(".row")[2];
    
    if (id === "student") {
        row2.style.display = "block";
        row3.style.display = "none";
    } else {
        row3.style.display = "block";
        row2.style.display = "none";
    }
}

/**
 * 为 radio 绑定事件
 */
function bindEventForRadio() {
    
    var radios = $("input[type='radio']");
    
    for (var i = 0; i < radios.length; i++) {
        radios[i].onclick = toggle;
    }
}

/**
 * 为 province 下拉菜单绑定事件
 */
function bindEventForProvinceSelect() {
    
    var province = $("#province")[0];
    var school = $("#school")[0];
    
    province.onblur = function () {
        
        var city = this.value;
        
        if (city === "Beijing") {
            school.innerHTML = select1;
        }
        if (city === "Shanghai") {
            school.innerHTML = select2;
        }
        if (city === "Tianjin") {
            school.innerHTML = select3;
        }
        
    }
}

/**
 * 初始化
 */
function init() {
    
    var row2 = $(".row")[1];
    var row3 = $(".row")[2];
    
    row2.style.display = "none";
    row3.style.display = "none";
    
    bindEventForRadio();
    bindEventForProvinceSelect();
}


window.onload = init;