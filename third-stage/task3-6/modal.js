/**
 * modal.js 可以与 modal.css 一起被引入 HTML 中，创建一个可以同用户交互的模态框
 */

var modal = {
    
    property: {
        opacity: ".5",
        duration: ".5s",
        top: "20%",
        dismissible: false
    },

    /**
     * 供用户调用的方法，据传入的 option 来设置模态框参数。参数模仿 Materialize
     * 
     * option 对象的属性
     * 1. opacity：背景的透明度（默认为0.5）
     * 2. duration：出现的时间（默认为0.5s）
     * 3. top：距离顶部的高度（默认为距离顶部20%处）
     * 4. dismissible：是否可以点击模态框外部退出（默认为false）
     */
    setModal: function (modalId, option) {
        var doc,
            myModal,
            overlay;
        
        doc = document;
        myModal = doc.getElementById(modalId);
        overlay = doc.getElementsByClassName("modal-overlay")[0];
        
        if (option.opacity)
            this.property.opacity = option.opacity;
        if (option.duration) {
            myModal.style.transitionDuration = option.duration;
            overlay.style.transitionDuration = option.duration;
        }
        if (option.top)
            myModal.style.top = option.top;
        if (option.dismissible)
            overlay.onclick = function () {
                modal.close(modalId);
            };
    },

    /**
     * 供内部使用的方法，用于打开或关闭模态框的背景层
     */
    modalOverlay: function (operation) {
        var overlay,
            parent,
            transition,
            i;

        if (operation === "open") {
            overlay = document.getElementsByClassName("modal-overlay")[0];
            overlay.style.visibility = "visible";
            overlay.style.opacity = this.property.opacity;
            document.getElementsByTagName("main")[0].className = "mask";
        }

        if (operation === "close") {
            overlay = document.getElementsByClassName("modal-overlay")[0];
            overlay.style.visibility = "hidden";
            overlay.style.opacity = "0";
            document.getElementsByTagName("main")[0].className = "";
        }
    },

    /**
     * 供用户调用的方法，打开模态框
     */
    open: function (modalId) {
        var myModal = document.getElementById(modalId);

        modal.modalOverlay("open");

        myModal.style.visibility = "visible";
        myModal.style.opacity = "1";
        myModal.style.transform = "scale(1, 1)";
    },

    /**
     * 供用户调用的方法，关闭模态框
     */
    close: function (modalId) {
        var myModal = document.getElementById(modalId);

        modal.modalOverlay("close");

        myModal.style.visibility = "hidden";
        myModal.style.opacity = "0";
        myModal.style.transform = "scale(0.7, 0.7)";
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
     * 供用户调用的方法，初始化，第一次使用模态框之前调用一次
     * 为 modal-trigger 和 modal-close 绑定事件处理程序
     */
    init: function () {
        var doc = document,
            trigger = doc.getElementsByClassName("modal-trigger"),
            close = doc.getElementsByClassName("modal-close"),
            i,
            overlay;

        // 遍历绑定事件
        for (i = 0; i < trigger.length; i++) {
            trigger[i].onclick = modal.toggle;
        }
        for (i = 0; i < close.length; i++) {
            close[i].onclick = modal.toggle;
        }
        
        // 创建模态框的背景层：modal-overlay
        overlay = doc.createElement("div");
        overlay.className = "modal-overlay";
        doc.getElementsByTagName("body")[0].appendChild(overlay);
    }
};