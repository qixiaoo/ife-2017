var orderTable = {

    /**
     * 获取表格 td 所属的 table
     */
    _getParentTable: function (td) {
        parent = td.parentNode;

        while (parent.className.indexOf("order-table") === -1) {
            parent = parent.parentNode;
        }

        return parent;
    },

    /**
     * 获取 td 在它所在行内的索引
     */
    _getTdIndex: function (td) {
        var tr,
            count,
            element,
            i = 0;

        tr = td.parentNode;
        count = tr.childElementCount;

        element = tr.firstElementChild;

        while (td !== element) {
            element = element.nextElementSibling;
            i++;
        }

        return i;
    },

    /**
     * 根据传入参数创建一个排序表格
     *
     * data 为一个 JSON 字符串
     */
    createTable: function (tableId, data) {
        var doc = document;
        var table = doc.getElementById(tableId);
        var tbody = table.getElementsByTagName("tbody")[0];
        var data = JSON.parse(data);

        var key,
            tr,
            th,
            td,
            i,
            dataArr;

        for (key in data) {
            tr = doc.createElement("tr");
            tbody.appendChild(tr);
            dataArr = data[key];

            for (i = 0; i < dataArr.length; i++) {
                td = doc.createElement("td");
                td.innerHTML = dataArr[i];
                tr.appendChild(td);
            }
        }

        this.init(tableId);
    },

    /**
     * 默认的大小比较方法（为null时，sort 函数会使用数组默认的按比较字符串排序）
     */
    compare: null,

    /**
     * 用户自定义大小比较方法
     */
    setCompare: function (fun) {
        this.compare = function (tdA, tdB) {
            var a = tdA.innerHTML;
            var b = tdB.innerHTML;
            return fun(a, b);
        }
    },

    /**
     * 恢复使用默认的大小比较方法
     */
    resetCompare: function () {
        this.compare = null;
    },

    /**
     * 排序
     */
    sort: function () {

        var table = orderTable._getParentTable(this);
        var index = orderTable._getTdIndex(this);
        var trs = table.getElementsByTagName("tr");
        trs = Array.prototype.slice.call(trs, 0); // 把 NodeList 转化为数组

        var tdList = [],
            ths, tr, tbody;


        tbody = table.getElementsByTagName("tbody")[0];
        tbody.innerHTML = "";
        ths = trs[0].getElementsByTagName("th");

        for (var i = 1; i < trs.length; i++) {
            tdList[i - 1] = trs[i].getElementsByTagName("td")[index];
        }

        for (i = 0; i < ths.length; i++) {
            if (ths[i] !== this)
                ths[i].removeAttribute("order");
        }

        // 未定义compare时，使用默认的比较字符串来排序
        if (orderTable.compare !== null)
            tdList.sort(orderTable.compare);
        else
            tdList.sort();

        if (this.getAttribute("order") === "mark") {
            tdList.reverse();
            this.removeAttribute("order");
        } else {
            this.setAttribute("order", "mark");
        }

        for (i = 0; i < tdList.length; i++) {
            tr = tdList[i].parentNode;
            tbody.appendChild(tr);
        }
    },

    /**
     * 初始化，为 .order-control 绑定事件处理程序
     */
    init: function (tableId) {
        var controls = document.getElementsByClassName("order-control");

        for (var i = 0; i < controls.length; i++) {
            controls[i].onclick = this.sort;
        }
    }
}

window.onload = function () {

    var json_str = "{\"小红\":[\"小红\",11,22,33,44,55],\"小明\":[\"小明\",23,34,45,56,67],\"小强\":[\"小强\",33,75,95,74,83],\"小智\":[\"小智\",26,86,97,83,88],\"小刚\":[\"小刚\",66,85,73,91,77],\"小瑶\":[\"小瑶\",93,84,72,62,82]}";
    
    orderTable.createTable("table1", json_str); // 创建表格

    // 自定义表格中内容大小比较规则
    orderTable.setCompare(function (a, b) {

        a = parseFloat(a);
        b = parseFloat(b);

        if (a > b)
            return 1;
        else if (a < b)
            return -1;
        else
            return 0;
    });
};