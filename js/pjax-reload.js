function pjax_reload() {

  $("script[data-pjax]").each(function () {
    $(this).parent().append($(this).remove());
  });
  // 导航栏特效：鼠标向下滚动一定距离，导航栏采用深色样式
  Fluid.events.registerNavbarEvent();
  // banner（横幅/顶部图）特效：视差滚动效果（没看出）
  Fluid.events.registerParallaxEvent();
  // 鼠标点击箭头，向下滚动（banner）
  Fluid.events.registerScrollDownArrowEvent();
  // 鼠标点击箭头，滚动到顶部（页面）
  Fluid.events.registerScrollTopArrowEvent();
  // 在页面加载过程中，通过监听背景图和非懒加载图片的加载状态，逐步更新加载进度条（NProgress）。
  Fluid.events.registerImageLoadedEvent();
  $.getScript("https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js");
  
  
  /*
  如果页面没有此元素，则创建此元素并插入到页面。
  在刷新页非post页的情况下使用。非post页面是无此元素的，而PJAX请求的替换内容无此必要script。
  */

// var fancybox_js_func = $('script[func="fancybox-js-func"]');
// if(fancybox-js-func) fancybox-js-func.remove();




function loadFancybox() {
  Fluid.utils.createScriptST(
    "https://lib.baomitu.com/fancybox/3.5.7/jquery.fancybox.min.js",
    "fancybox-js-func",
    function () {
      Fluid.plugins.fancyBox();
    },
  );
}

var fancybox_js_func = $('script[func="fancybox-js-func"]');
if (fancybox_js_func.length === 0) {
  console.log("刷新页非post页：第一次fancybox-js-func生效");
  loadFancybox();
  // 刷新页非post页，第一次发起PJAX请求时添加CSS
  var css = $('<link rel="stylesheet" href="https://lib.baomitu.com/fancybox/3.5.7/jquery.fancybox.min.css">');
  $("head").append(css);
} else {
  console.log("每次PJAX请求，fancybox-js-func都会生效。正常情况是只有文章页才有此脚本。");
  fancybox_js_func.remove();
  loadFancybox();
}

	
 
} 