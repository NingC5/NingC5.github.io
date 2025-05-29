
  
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
  if ($('script[func="tocbot-js-func"]').length === 0) {
	var script = $('<script src="https://lib.baomitu.com/tocbot/4.20.1/tocbot.min.js" type="text/javascript" charset="UTF-8" func="tocbot-js-func"></script>');
	script.onload = function(){
	  var toc = jQuery('#toc');
      if (toc.length === 0 || !window.tocbot) { return; }
      var boardCtn = jQuery('#board-ctn');
      var boardTop = boardCtn.offset().top;
      
      window.tocbot.init(Object.assign({
        tocSelector     : '#toc-body',
        contentSelector : '.markdown-body',
        linkClass       : 'tocbot-link',
        activeLinkClass : 'tocbot-active-link',
        listClass       : 'tocbot-list',
        isCollapsedClass: 'tocbot-is-collapsed',
        collapsibleClass: 'tocbot-is-collapsible',
        scrollSmooth    : true,
        includeTitleTags: true,
        headingsOffset  : -boardTop,
      }, CONFIG.toc));
      if (toc.find('.toc-list-item').length > 0) {
        toc.css('visibility', 'visible');
      }
      
      Fluid.events.registerRefreshCallback(function() {
        if ('tocbot' in window) {
          tocbot.refresh();
          var toc = jQuery('#toc');
          if (toc.length === 0 || !tocbot) {
            return;
          }
          if (toc.find('.toc-list-item').length > 0) {
            toc.css('visibility', 'visible');
          }
        }
      });
	};
    $("body").append(script);
    console.log("刷新页非post页：tocbot-js-func");
  }
    
  if ($('script[func="clipboard"]').length === 0) {
    console.log("clipboard");
    var script = $('<script src="https://lib.baomitu.com/clipboard.js/2.0.11/clipboard.min.js"></script>');
    $("body").append(script);
  }

  if ($('script[func="codeWidget"]').length === 0) {
    console.log("codeWidget");
    var script = $('<script data-pjax func="codeWidget">Fluid.plugins.codeWidget();</script>');
    $("body").append(script);
    // Fluid.plugins.codeWidget();
  }

  
  // <link rel="stylesheet" href="https://lib.baomitu.com/fancybox/3.5.7/jquery.fancybox.min.css">
} 