/* 左侧入按钮事件处理程序 */
function leftIn() {
    
    var item = createItem();
    item.classList.add("slideInLeft");
    
    var queue = document.getElementById("queue");
    queue.insertBefore(item, queue.firstElementChild);
    
}

/* 右侧入按钮事件处理程序 */
function rightIn() {
    
    var item = createItem();
    item.classList.add("slideInRight");
    
    document.getElementById("queue").appendChild(item);
    
}

/* 左侧出按钮事件处理程序 */
function leftOut() {
    
    var queue = document.getElementById("queue");
    queue.firstElementChild.classList.add("slideOutLeft");
    
    var handler = setTimeout(function() {
        
        queue.removeChild(queue.firstElementChild);
        clearTimeout(handler);
        
    }, 1000);
    
}

/* 右侧出按钮事件处理程序 */
function rightOut() {
    
    var queue = document.getElementById("queue");
    queue.lastElementChild.classList.add("slideOutRight");
    
    var handler = setTimeout(function() {
        
        queue.removeChild(queue.lastElementChild);
        clearTimeout(handler);
        
    }, 1000);
    
}

/* 队列item被点击时的事件处理程序 */
function removeItem() {
    
    // 传统方式处理类好麻烦
    var classes = this.className.split(" ");
    classes.push("slideOutRight");
    this.className = classes.join(" ");
    
}

/* 为按钮绑定事件 */
function bindEventForBtn() {
    
    document.getElementById("left-in").onclick = leftIn;
    document.getElementById("right-in").onclick = rightIn;
    document.getElementById("left-out").onclick = leftOut;
    document.getElementById("right-out").onclick = rightOut;
    
}

/* 为队列item绑定事件 */
function bindEventForItem(item) {
    
    item.onclick = removeItem;
    
}

/* 创建一个item */
function createItem() {
    
    var item = document.createElement("div");
    var text = document.getElementById("mid-text").value;
    
    document.getElementById("mid-text").value = "";
    item.className = "item";
    item.innerHTML = text;
    bindEventForItem(item);
    
    return item;
}

window.onload = bindEventForBtn;