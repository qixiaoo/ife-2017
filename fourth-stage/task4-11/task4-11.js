var mdPattern = {
    blockCode: /```.*?\n(.*\s*)*```(?:\n+|$)/g,
    inlineCode: /`\u0020*.+?\u0020*`/g,
    quote: /\n*>\s*.*(?:\n+|$)/g,
    h: /\n*#{1,6} *.*(?:\n+|$)/g,
    img: /!\[[\w\.\/ :%\-#&=!\?]*\]\([\w\.\/ :%\-#&=!\?]+\)/g,
    a: /\[[\w\.\/ :%\-#&=!\?]*\]\([\w\.\/ :%\-#&=!\?]+\)/g,
    strong: /[^\\]__\w+[^\\]__|[^\\]\*\*\w+[^\\]\*\*/g,
    em: /_\w+_|\*\w+\*/g,
    horizontal: /\n-{3,}\n|\n\*{3,}\n/g,
    u_li: /([\*\-\+] +\w*\n*)+/g,
    o_li: /(\d\. +\w*\n*)+/g
    /*
    p: /\.+?\n/g
    */
}

// 把数据渲染成 html
function render(innerHTML) {
    var preview = document.getElementById("preview");
    preview.innerHTML = innerHTML;
}

// 把匹配项变成标签
function itemToTag(text, key, itemArr) {
    var item,
        H1 = ["<h1>", "</h1>"],
        H2 = ["<h2>", "</h2>"],
        H3 = ["<h3>", "</h3>"],
        H4 = ["<h4>", "</h4>"],
        H5 = ["<h5>", "</h5>"],
        H6 = ["<h6>", "</h6>"],
        P = ["<p>", "</p>"],
        UL = ["<ul>", "</ul>"],
        OL = ["<ol>", "</ol>"],
        LI = ["<li>", "</li>"],
        BLOCKQUOTE = ["<blockquote>", "</blockquote>"],
        IMG = ["<img src='", "' alt='", "'>"],
        A = ["<a href='", "'>", "</a>"],
        STRONG = ["<strong>", "</strong>"],
        EM = ["<em>", "</em>"],
        CODE = ["<code class='inline-code'>", "</code>"],
        BLOCKCODE = ["<pre class='block-code'><code>", "</code></pre>"],
        HR = "<hr>";

    key += "";

    switch (key) {
        case "h":
            if (itemArr === null)
                return text;

            itemArr.forEach(function (element, index, array) {
                var level = element.trim().split(/\s+/)[0].length; // 获取标题的级别
                var content;
                switch (level) {
                    case 1:
                        content = H1.join(element.trim().replace(/#+\s+/, ""));
                        break;
                    case 2:
                        content = H2.join(element.trim().replace(/#+\s+/, ""));
                        break;
                    case 3:
                        content = H3.join(element.trim().replace(/#+\s+/, ""));
                        break;
                    case 4:
                        content = H4.join(element.trim().replace(/#+\s+/, ""));
                        break;
                    case 5:
                        content = H5.join(element.trim().replace(/#+\s+/, ""));
                        break;
                    case 6:
                        content = H6.join(element.trim().replace(/#+\s+/, ""));
                        break;
                    default:
                        console.log("error in parsing h");
                        break;
                }
                text = text.replace(element.trim(), content);
            });
            break;
        case "p":
            if (itemArr === null)
                return text;

            itemArr.forEach(function (element, index, array) {
                var content = element.trim();
                content = P.join(content);

                text = text.replace(element, content);
            });
            break;
        case "u_li":
            if (itemArr === null)
                return text;

            itemArr.forEach(function (element, index, array) {
                var contentArr = element.match(/[\*\-\+] +\w*\n*/g);

                contentArr.forEach(function (e, i, arr) {
                    arr[i] = e.trim().replace(/[\*\-\+]\s+/, "");
                });

                var content = "";

                contentArr.forEach(function (e, i, arr) {
                    content += LI.join(e);
                });

                content = UL.join(content);
                text = text.replace(element, content);
            });
            break;
        case "o_li":
            if (itemArr === null)
                return text;

            itemArr.forEach(function (element, index, array) {
                var contentArr = element.match(/\d\. +\w*\n*/g);

                contentArr.forEach(function (e, i, arr) {
                    arr[i] = e.trim().replace(/\d\.\s+/, "");
                });

                var content = "";

                contentArr.forEach(function (e, i, arr) {
                    content += LI.join(e);
                });

                content = OL.join(content);
                text = text.replace(element, content);
            });
            break;
        case "quote":
            if (itemArr === null)
                return text;

            itemArr.forEach(function (element, index, array) {
                var content = element.trim().replace(/>\s*/, "");
                content = BLOCKQUOTE.join(content);
                text = text.replace(element.trim(), content);
            });
            break;
        case "img":
            if (itemArr === null)
                return text;

            itemArr.forEach(function (element, index, array) {
                var href = element.split(/[\(\)]/)[1];
                var alt = element.split(/[\[\]]/)[1];
                var content = IMG[0] + href + IMG[1] + alt + IMG[2];

                text = text.replace(element, content);
            });
            break;
        case "a":
            if (itemArr === null)
                return text;

            itemArr.forEach(function (element, index, array) {
                var href = element.split(/[\(\)]/)[1];
                var foo = element.split(/[\[\]]/)[1];
                var content = A[0] + href + A[1] + foo + A[2];

                text = text.replace(element, content);
            });
            break;
        case "strong":
            if (itemArr === null)
                return text;

            itemArr.forEach(function (element, index, array) {
                var content = element.trim();
                content = content.substring(2, content.length - 2);
                content = STRONG.join(content);

                text = text.replace(element, content);
            });
            break;
        case "em":
            if (itemArr === null)
                return text;

            itemArr.forEach(function (element, index, array) {
                var content = element.trim();
                content = content.substring(1, content.length - 1);
                content = EM.join(content);

                text = text.replace(element, content);
            });
            break;
        case "inlineCode":
            if (itemArr === null)
                return text;

            itemArr.forEach(function (element, index, array) {
                var content = element.trim();
                content = content.substring(1, content.length - 1);
                content = CODE.join(content);

                text = text.replace(element, content);
            });
            break;
        case "blockCode":
            if (itemArr === null)
                return text;

            itemArr.forEach(function (element, index, array) {
                var content = element.trim();
                content = content.replace(/```\w*?(?:\n)/, "");
                content = content.replace(/(?:\n)```/, "");
                content = BLOCKCODE.join(content);

                text = text.replace(element, content);
            });
            break;
        case "horizontal":
            if (itemArr === null)
                return text;

            itemArr.forEach(function (element, index, array) {
                text = text.replace(element, HR);
            });
            break;
        default:
            break;
    }

    return text;
}

// 解析文本
function parseMD(text) {
    var temp,
        key,
        pattern,
        itemArr;

    for (key in mdPattern) {
        pattern = mdPattern[key];
        itemArr = text.match(pattern);
        text = itemToTag(text, key, itemArr);
    }

    render(text);
}

// editor onchannge 事件的处理程序，监听输入文本变化，并处理
function listen() {
    var editor = this;
    var text = this.value;

    parseMD(text);
}

window.onload = function () {
    document.getElementById('editor').onchange = listen;
};