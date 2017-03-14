var modal = {

    /**
     * 供用户调用的方法，据传入的 option 来设置模态框参数
     * 
     * option 对象的属性
     * 1. opacity：背景的透明度（默认为）
     * 2. duration：出现的时间（默认为）
     * 3. top：距离顶部的高度（默认为）
     */
    setModal: function (modalId, option) {

    },

    /**
     * 供内部使用的方法，用于打开或关闭模态框的背景层
     */
    modalOverlay: function (operation) {
        var div,
            overlay,
            parent,
            transition,
            i;

        if (operation === "open") {
            div = document.createElement("div");
            div.className = "modal-overlay";

            document.getElementsByTagName("body")[0].appendChild(div);
            div.style.opacity = ".5";
            div.style.display = "block";
            document.getElementsByTagName("main")[0].className = "mask";
        }

        if (operation === "close") {
            overlay = document.getElementsByClassName("modal-overlay");

            for (i = 0; i < overlay.length; i++) {
                transition = window.getComputedStyle(overlay[i], null); // 获取元素的计算样式（不是兼容IE的写法）
                transition = parseFloat(transition) * 1000;

                overlay[i].style.opacity = "0";
                overlay[i].style.display = "none";
                document.getElementsByTagName("main")[0].className = "";

                // TODO 易错
                (function (item) {
                    setTimeout(function () {
                        item.parentNode.removeChild(item);
                    }, transition);
                })(overlay[i]);
            }
        }
    },

    /**
     * 供用户调用的方法，打开模态框
     */
    open: function (modalId) {
        var myModal = document.getElementById(modalId);
        
        modal.modalOverlay("open");
        
        myModal.style.display = "block";
        myModal.style.opacity = "1";
        myModal.style.transform = "scale(1, 1)";
    },

    /**
     * 供用户调用的方法，关闭模态框
     */
    close: function (modalId) {
        var myModal = document.getElementById(modalId);
        
        modal.modalOverlay("close");
        
        myModal.style.display = "none";
        myModal.style.opacity = "0";
        myModal.style.transform = "scale(0, 0)";
    },
    
    /**
     * 供内部使用的方法，modal-trigger 和 modal-close 的事件处理程序
     */
    toggle: function () {
        var targetModal = this.getAttribute("modal-target"),
            className = this.className;
        
        if (className.indexOf("modal-trigger") !== -1) 
            modal.open(targetModal);
        if (className.indexOf("modal-close") !== -1) 
            modal.close(targetModal);
        
        return false;
    },

    /**
     * 供用户调用的方法，初始化，为 modal-trigger 和 modal-close 绑定事件处理程序
     */
    init: function () {
        var doc = document,
            trigger = doc.getElementsByClassName("modal-trigger"),
            close = doc.getElementsByClassName("modal-close"),
            i;

        for (i = 0; i < trigger.length; i++) {
            trigger[i].onclick = this.toggle;
        }
        for (i = 0; i < close.length; i++) {
            close[i].onclick = this.toggle;
        }
    }
};

window.onload = function () {
    modal.init();
};