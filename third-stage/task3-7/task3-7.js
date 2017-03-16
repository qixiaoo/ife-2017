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
     * 根据传入参数设置表格样式
     */
    style: function (tableId, option) {
        // TODO
    },

    /**
     * 默认的大小比较方法（为null时，sort 函数会使用数组默认的按比较字符串排序）
     */
    compare: null,

    /**
     * 用户自定义大小比较方法
     */
    setCompare: function (fun) {
        this.compare = fun;
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
        var datas = [];
        var text, tds;

        for (var i = 1; i < trs.length; i++) {
            tds = trs[i].getElementsByTagName("td");
            text = tds[index].innerHTML;
            datas.push(text);
        }

        if (orderTable.compare !== null)
            datas.sort(orderTable.compare);
        else
            datas.sort();

        for (i = 1; i < trs.length; i++) {
            tds = trs[i].getElementsByTagName("td");
            tds[index].innerHTML = datas[i - 1];
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
    orderTable.init("table1");
    
    orderTable.setCompare(function(a, b) {
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