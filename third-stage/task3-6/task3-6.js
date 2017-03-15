window.onload = function () {
    var option = new Object();
    option.dismissible = true;
    
    modal.init(); // 初始化模态框
    modal.setModal("modal1", option); // 改变模态框参数（可选）
};