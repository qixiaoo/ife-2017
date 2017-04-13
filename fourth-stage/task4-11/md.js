// 简易的 markdown 解析器

(function (root) {

    var md = {};

    md.lastDoc = null;
    md.lines = [];
    md.blocks = [];

    // 匹配规则
    // todo 转义字符的处理
    var pattern = {
        blockCodeStart: /^```.*$/g, // ``` 能表示一个代码块
        blockCode_2: /^( {4}|\t).+$/g, // 4个空格或缩进能表示一个代码块
        blockCodeEnd: /^```$/g, // ``` 表示的代码块的结束标志
        horizontal: /^-{3,}$|^\*{3,}$/g, // 分割线
        quote: /^> *.*$/g, // 引用
        oLi: /^[0-9]+\. +.+$/g, // 有序列表
        uLi: /^[*-+] +.+$/g, // 无序列表
        h: /^#{1,6} +.*$/g, // 标题
        inlineCode: /`.*?`/g, // 行内代码
        img: /!\[[^<>]*]\([\w.\/ :%\-#&=!?]+\)/g, // 图片
        a: /\[[^<>]*]\([\w.\/ :%\-#&=!?]+\)/g, // 链接
        em: /_(?! ).*[^ ]_|\*(?! ).*[^ ]\*/g, // _ 或 * 不能紧跟着一个空格
        strong: /__(?! ).*[^ ]__|\*\*(?! ).+[^ ]\*\*/g // __ 或 ** 不能紧跟着一个空格
    };

    // 块级元素对象
    function Block(tag, line) {
        this.tag = tag;
        this.lines = [];
        line ? this.lines.push(line) : '';
    }

    // 行内元素对象
    function InlineBlock(tag, content) {
        this.tag = tag;
        this.content = content;
        this.arr = []; // 当 tag 为 strong 或 em 时，arr 存储元素内部嵌套的其它行内元素
    }

    // 行内元素转化为 HTML 字符串
    InlineBlock.prototype.toString = function () {
        if (this.tag === 'code')
            return '<code class="inline-code">' + this.content + '</code>'
        else if (this.tag === 'img')
            return '<img src="' + this.arr[0] + '" alt="' + this.arr[1] + '">';
        else if (this.tag === 'a')
            return '<a href="' + this.arr[0] + '">' + this.arr[1] + '</a>';
        else if (this.tag === 'strong' || this.tag === 'em') {
            var sum = this.arr.reduce(function (pre, cur) {
                return pre.toString() + cur.toString();
            });

            return this.tag === 'em' ? '<em>' + sum + '</em>' : '<strong>' + sum + '</strong>';
        }
    };

    // 将数组扁平化（[a, [a, b], c] -> [a, a, b, c]）
    function flat(arr) {
        var result = [],
            i,
            j;

        for (i = 0; i < arr.length; i++) {
            if (!Array.isArray(arr[i]))
                result.push(arr[i]);
            else
                for (j = 0; j < arr[i].length; j++)
                    result.push(arr[i][j]);

        }

        return result;
    }

    // 将 str 按参数 pattern 拆解，每一项用回调函数处理，之后合并
    function splitAndUnion(str, pattern, callback) {
        var splitArr,
            joinArr,
            result = [],
            i;

        splitArr = str.split(pattern); // 拆分数组
        joinArr = str.match(pattern);

        if (joinArr === null) {
            result.push(str); // joinArr 为 null 说明 str 不可拆分，直接返回
            return result;
        }

        // 用回调函数处理每一项
        for (i = 0; i < joinArr.length; i++)
            joinArr[i] = callback(joinArr[i]);

        // 合并成一个数组
        for (i = 0; i < splitArr.length; i++) {
            splitArr[i] !== '' ? result.push(splitArr[i]) : '';
            i < joinArr.length ? result.push(joinArr[i]) : '';
        }

        return result;
    }

    // 把文本分解文本行成数组
    function separate(text) {
        var temp = '',
            lines = [],
            i;
        // 把文本拆成多行
        for (i = 0; i < text.length; i++) {
            if (text[i] === '\n') {
                temp !== '' ? lines.push(temp) : lines.push('\n');
                temp = '';
                continue;
            }
            temp += text[i];
        }

        lines.push(temp);

        return lines;
    }

    // 把文本行数组解析成块级元素数组（块级元素用 Block 对象表示）
    // todo debug
    function toBlockArr(lines) {
        var flag, // flag 用于代码块解析；若到文本行数组最后都没有发现代码块结束标志，则 flag 取 0；发现结束标志，flag 取1
            line,
            block,
            blocks = [],
            i,
            j;

        // 遍历分析
        for (i = 0; i < lines.length; i++) {
            flag = 0;
            line = lines[i];

            // 解析块级代码
            if (pattern.blockCodeStart.test(line)) {
                for (j = i + 1; j < lines.length; j++) {
                    if (pattern.blockCodeEnd.test(lines[j])) {
                        block = new Block("blockCode"); // html 中没有名为 blockCode 的标签，渲染时需要特殊处理
                        block.lines = block.lines.concat(lines.slice(i + 1, j));
                        blocks.push(block);
                        flag = 1;
                        i = j;
                        break;
                    }
                }
                if (flag === 1) continue; // 若匹配到块级代码块的结束标志,终止后面的匹配
                if (flag === 0) { // 若没有匹配到块级代码块的结束标志
                    block = new Block("blockCode");
                    block.lines = block.lines.concat(lines.slice(i + 1, lines.length));
                    blocks.push(block);
                    break; // 跳出遍历分析
                }
            }

            // 解析块级代码
            if (pattern.blockCode_2.test(line)) {
                block = new Block("blockCode", line);
                for (j = i + 1; j < lines.length; j++) {
                    if (pattern.blockCode_2.test(lines[j])) {
                        block.lines.push(lines[j]);
                    } else {
                        blocks.push(block);
                        i = j - 1;
                        flag = 1;
                        break;
                    }
                }
                if (flag === 1) continue; // 若匹配到块级代码块的结束标志,终止后面的匹配
                if (flag === 0) { // 若没有匹配到块级代码块的结束标志
                    block = new Block("blockCode");
                    block.lines = block.lines.concat(lines.slice(i, lines.length));
                    blocks.push(block);
                    break; // 跳出遍历分析
                }
            }

            // 解析 ul
            if (pattern.uLi.test(line)) {
                block = new Block("ul", line.replace(/[*-+] +/, ''));
                for (j = i + 1; j < lines.length; j++) {
                    pattern.uLi.lastIndex = 0;
                    if (pattern.uLi.test(lines[j]))
                        block.lines.push(lines[j].replace(/[*-+] +/, ''));
                    else
                        break;
                }
                blocks.push(block);
                i = j - 1;
                continue;
            }

            // 解析 ol
            if (pattern.oLi.test(line)) {
                block = new Block("ol", line.replace(/\d+\. +/, ''));
                for (j = i + 1; j < lines.length; j++) {
                    pattern.oLi.lastIndex = 0;
                    if (pattern.oLi.test(lines[j]))
                        block.lines.push(lines[j].replace(/\d+\. +/, ''));
                    else
                        break;
                }
                blocks.push(block);
                i = j - 1;
                continue;
            }

            // 解析 分割线
            if (pattern.horizontal.test(line)) {
                block = new Block("hr", '');
                blocks.push(block);
                continue;
            }

            // 解析 标题
            if (pattern.h.test(line)) {
                var level = line.split(/ +/)[0].length;
                block = new Block('h' + level, line.replace(/#{1,6} +/, ''));
                blocks.push(block);
                continue;
            }

            // 解析 引用
            if (pattern.quote.test(line)) {
                block = new Block("blockquote", line.replace(/> */, ''));
                for (j = i + 1; j < lines.length; j++) {
                    if (lines[j] !== '\n') {
                        block.lines.push(lines[j]);
                    } else
                        break;
                }
                blocks.push(block);
                i = j - 1;
                continue;
            }

            // 段落
            block = new Block("p", line);
            blocks.push(block);
        }

        return blocks;
    }

    // 分析一个块级元素的 lines 数组中的一项（代表块级元素中的一行文本），提取出行内元素转化为 InlineBlock 与字符串的数组 ，并返回
    function parseLine(line) {

        // 解析 strong 元素（内部可以嵌套其它行内元素，优先解析）
        line = splitAndUnion(line, pattern.strong, function (str) {
            str = str.substring(2, str.length - 2);
            return new InlineBlock('strong', str);
        });

        // out => line = [str, strong, str] （上面处理的结果）

        // 解析 em 元素（内部可以嵌套其它行内元素，优先解析）
        line.forEach(function (e, i, arr) {
            if (typeof e === 'string')
                arr[i] = splitAndUnion(e, pattern.em, function (str) {
                    str = str.substring(1, str.length - 1);
                    return new InlineBlock('em', str);
                });
        });

        // out => line = [[str, em, str], strong, str]（上面处理的结果）

        line = flat(line); // out => line = [str, em, str, strong, str]（前面处理的结果）

        // 解析行内代码 code 元素（内部不能嵌套其它行内元素）
        line.forEach(function (e, i, arr) {
            if (typeof e === 'string')
                arr[i] = splitAndUnion(e, pattern.inlineCode, function (str) {
                    str = str.substring(1, str.length - 1);
                    return new InlineBlock('code', str);
                });

            if (e instanceof InlineBlock && e.tag === 'strong' || e instanceof InlineBlock && e.tag === 'em')
                e.arr = splitAndUnion(e.content, pattern.inlineCode, function (str) {
                    str = str.substring(1, str.length - 1);
                    return new InlineBlock('code', str);
                });
        });

        line = flat(line);

        // 解析 img 元素（内部不能嵌套其它行内元素）
        line.forEach(function (e, i, arr) {
            if (typeof e === 'string')
                arr[i] = splitAndUnion(e, pattern.img, function (str) {
                    var link = str.split(/[()]/)[1];
                    var alt = str.split(/[\[\]]/)[1];

                    // 图片的信息实际存在 arr 里面
                    var img = new InlineBlock('img', '');
                    img.arr.push(link);
                    img.arr.push(alt);

                    return img;
                });

            if (e instanceof InlineBlock && e.tag === 'strong' || e instanceof InlineBlock && e.tag === 'em') {
                // 遍历 strong 或 em 的 arr，分析里面可能包含的 img
                e.arr.forEach(function (item, idx, array) {
                    if (typeof  item === 'string')
                        array[idx] = splitAndUnion(item, pattern.img, function (str) {
                            var link = str.split(/[()]/)[1];
                            var alt = str.split(/[\[\]]/)[1];

                            // 图片的信息实际存在 arr 里面
                            var img = new InlineBlock('img', '');
                            img.arr.push(link);
                            img.arr.push(alt);

                            return img;
                        });
                });

                e.arr = flat(e.arr);
            }

        });

        line = flat(line);

        // 解析 a 元素（内部不能嵌套其它行内元素）
        line.forEach(function (e, i, arr) {
            if (typeof e === 'string')
                arr[i] = splitAndUnion(e, pattern.a, function (str) {
                    var link = str.split(/[()]/)[1];
                    var alt = str.split(/[\[\]]/)[1];

                    // 链接的信息实际存在 arr 里面
                    var a = new InlineBlock('a', '');
                    a.arr.push(link);
                    a.arr.push(alt);

                    return a;
                });

            if (e instanceof InlineBlock && e.tag === 'strong' || e instanceof InlineBlock && e.tag === 'em') {
                // 遍历 strong 或 em 的 arr，分析里面可能包含的 a
                e.arr.forEach(function (item, idx, array) {
                    if (typeof  item === 'string')
                        array[idx] = splitAndUnion(item, pattern.a, function (str) {
                            var link = str.split(/[()]/)[1];
                            var alt = str.split(/[\[\]]/)[1];

                            /// 链接的信息实际存在 arr 里面
                            var a = new InlineBlock('a', '');
                            a.arr.push(link);
                            a.arr.push(alt);

                            return a;
                        });
                });

                e.arr = flat(e.arr);
            }
        });

        line = flat(line);

        return line;
    }

    // 解析 blocks 数组，分析块级元素中的行内元素
    function processBlocks(blocks) {
        blocks.forEach(function (e, i, arr) {

            // 遍历 block 的 lines 数组，对每项进行处理
            e.lines.forEach(function (line, idx, lines) {
                if (e.tag !== 'blockCode' && e.tag !== 'hr') // 块级代码与分割线内部不能嵌套行内元素
                    lines[idx] = parseLine(line);
            });

            arr[i] = e;
        });

        return blocks;
    }

    // parse 函数，解析文档
    function parse(text) {

        md.lines = separate(text);
        md.blocks = toBlockArr(md.lines);
        md.blocks = processBlocks(md.blocks);
    }

    // render 函数，渲染输出
    function render(blocks, preview) {
        preview.innerHTML = '';
        blocks.forEach(function (e) {
            var element,
                li;

            if (e.tag === 'blockCode') {
                element = document.createElement('pre');
                element.className = 'block-code';
                element.appendChild(document.createElement('code'));

                element.firstElementChild.innerHTML = e.lines.reduce(function (pre, cur) {
                    return pre + '\n' + cur;
                });
                preview.appendChild(element);
            } else if (e.tag === 'hr') {
                element = document.createElement('hr');
                preview.appendChild(element);
            } else if (e.tag === 'ul' || e.tag === 'ol') {
                element = document.createElement(e.tag);

                e.lines.forEach(function (item, idx, array) {
                    li = document.createElement('li');
                    li.innerHTML = item.reduce(function (pre, cur) {
                        return pre.toString() + cur.toString();
                    });

                    element.appendChild(li);
                });

                preview.appendChild(element);
            } else {
                element = document.createElement(e.tag);

                e.lines.forEach(function (item) {
                    element.innerHTML += item.reduce(function (pre, cur) {
                        return pre.toString() + cur.toString();
                    });
                });

                preview.appendChild(element);
            }
        });
    }

    // listen 函数，监听输入
    md.listen = function (editor, preview) {

        setTimeout(function () {

            var doc = editor.value;

            if (doc !== md.lastDoc) {
                parse(doc);
                render(md.blocks, preview);
            }

            md.lastDoc = doc;

            setTimeout(arguments.callee, 2000);
        }, 1000)
    };

    root.md = md;
})(window);

window.onload = function () {
    var editor = document.getElementById('editor'),
        preview = document.getElementById('preview');

    md.listen(editor, preview);
};