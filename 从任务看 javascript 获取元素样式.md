# 从任务看 Javascript 获取 CSS 样式

> 一点小总结

------

## 问题

在[任务四 听指令的小方块（一）](http://ife.baidu.com/course/detail/id/109)中，要求使用输入的指令来移动小方块。一看题目就觉得很简单，不就是把小方块用 `position: absolute;` 定位，再用 js 来改变 `left | top` 属性的值就可以了吗？

&nbsp;
有了想法就开始行动，我写了如下代码：

HTML：
```html
<td>
	<div class="block" id="block">
	</div>
</td>
```

CSS：
```css
.block {
	position: absolute;
	left: 0;
	top: 0;
}
```

为了避免出错，我又写了下面的 js 看看效果（没错，我就是这么细心~~）
```javascript
window.onload = function () {
	var block = document.getElementById("block");
	console.log(block.style.left); // 输出空字符串
};
```

结果，打开控制台，结果发现是这个样子。
![demo](http://p1.bqimg.com/567571/6dd9f7df9fc9782e.png)

what？浏览器怎么不按套路出牌？不应该输出 `0px` 吗？一定是浏览器坏了。。。嗯。。。

------

## 原因

&nbsp;
其实原因 hin 简单，在这里浏览器只输出了一个空字符串，于是就变成图中的样子咯。（别问我是怎么知道他是个空字符串的，这是一个很长的故事 ┭┮﹏┭┮）

&nbsp;
这个现象的根本原因在于在上面的 js 代码里面我们用到了 `block.style.left` 。

正如我们都知道的，我们在 HTML 中可以通过 `<link>` 标签、`<style>` 标签和元素的 `style` 属性来给元素添加样式。而我们平时访问元素的 CSS 样式时使用的 `element.style` 其实访问的是元素的 `style` 属性，也就是元素的**行内样式**。而上面的代码中，我是将样式写在 `<link>` 标签引入的样式表文件里的，于是 `style` 属性自然访问不到，因此 `console.log(block.style.left)` 自然就输出了空字符串。

------

## 解决方法

那么怎么获取小方块通过样式表层叠而来的 CSS 样式信息呢？我们可以利用 DOM2 级提供的 `getComputedStyle()` 方法。

&nbsp;
在“DOM2 级样式”中提供了 `getComputedStyle()` 方法。这个方法接受两个参数：要取得计算样式的元素和一个伪元素字符串（例如":after"）。如果不需要伪元素信息，第二个参数可以是 null。`getComputedStyle()` 方法返回一个 CSSStyleDeclaration 对象（与 `style` 属性的类型相同），其中包含当前元素的所有计算的样式。———— 以上来自《JavaScript 高级程序设计》

简言之，就是要获取元素来自层叠样式表的 CSS 样式的话，可以用 `window.getComputedStyle(目标元素, null)` 来代替我们上面使用的 `目标元素.style` 。

&nbsp;
于是我把代码改成了这样：

```javascript
window.onload = function () {
	var block = document.getElementById("block");
	console.log(window.getComputedStyle(block, null).left); // 输出 “0px”
};
```

打开浏览器查看结果：
![demo](http://i1.piimg.com/567571/6b813fcf1b29b586.png)

&nbsp;
值得注意的是，IE7、8、9 不支持 `getComputedStyle()` 方法，但它有一种类似的概念。在 IE 中，每个具有 `style` 属性的元素还有一个 `currentStyle` 属性。这个属性是 CSSStyleDeclaration 的实例，包含当前元素全部计算后的样式。可以按 `目标元素.currentStyle` 来使用。

```javascript
window.onload = function () {
	var block = document.getElementById("block");
	console.log(block.currentStyle.left); // 输出“0px”
};
```

&nbsp;
兼容的写法，用一个函数来屏蔽浏览器差异：

```javascript
// 兼容的写法
function getStyle (obj,attr) {
	return obj.currentStyle ? obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}

window.onload = function () {
	var block = document.getElementById("block");
	console.log(getStyle(block, "left")); // 输出“0px”
};
```

------

## 最后

忘了说一句，无论在哪个浏览器中，最重要的一条是要记住所有计算的样式都是**只读的**。

**只读的**。
**读的**。。
**的**。。。

&nbsp;
**w(ﾟДﾟ)w 啊啊啊啊!!!!!**
**只读我该怎么改变它的位置啊！！！！**

&nbsp;
还好，DOM2 级拓展还提供了操作样式的 API。不过，**相 当 繁 杂**。限于篇幅，我就不提了（其实是懒得写了）。

&nbsp;
**Σ(っ °Д °;)っ 等等！那怎么改变位置啊？**

&nbsp;
很简单，机智的我把样式写在 `style` 属性里了。

```css
<td>
	<div class="block" id="block" style="position: absolute;left: 0;top: 0;">
	</div>
</td>
```
这样就可以用原来的 js 访问 `left` 了。**`目标元素.style` 是可读可写的**。