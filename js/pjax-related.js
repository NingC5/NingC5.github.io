$(document).on("pjax:send", function () {
  NProgress.start(); // NProgress进度条
});

$(document).on("pjax:complete", function () {
  NProgress.done();
});

/*
点击<a>链接在当前窗口打开时，通过AJAX请求对应页面的内容;
提取请求返回内容中的#container-pjax部分，插入到当前页面的#container-pjax容器内，8秒请求超时。
*/

$(document).pjax(
  'a[target!="_blank"]:not(.fancybox-image)',
  "#container-pjax",
  {
    fragment: "#container-pjax",
    timeout: 8000,
  }
);
// "a[target!=_blank]"
$(document).on("pjax:end", function () {
  // reload necessary scripts（麻烦！）
  pjax_reload(); // 在此函数中集中设置必要的scripts
});

function pjax_reload() {
  $("script[data-pjax]").each(function () {
    $(this).parent().append($(this).remove());
  });

  // call necessary functions
  Fluid.events.registerNavbarEvent();
  Fluid.events.registerParallaxEvent();
  Fluid.events.registerScrollDownArrowEvent();
  Fluid.events.registerScrollTopArrowEvent();
  Fluid.events.registerImageLoadedEvent();

  $.getScript(
    "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
  );

  // 如果元素（id="toc"）存在，即目标页面为文章页，则生成文章目录
  if ($("#toc").length > 0) applyTocbot();

  /* 无条件执行函数fancyBox()，可能存在问题。
  本地测试时，借助"data-pjax"属性遍历，虽然浏览器控制台报错（fancyBox已初始化），但未发现问题。
  上线测试时，点击文章页的图片打开fancyBox，该文章页的所有图片都在文章页底部爆了。
  那只能将fancyBox的JS和CSS注入到所有页面，直接执行函数fancyBox()，以避免遍历时的重复初始化了。
  （函数fancyBox()是调用fancyBox提供的API作用于页面图片。）
  */
  Fluid.plugins.fancyBox();

  /*
  打开搜索框，页面插入div元素：<div class="modal-backdrop fade show"></div>
  关闭搜索框，该元素被remove
  pjax请求搜索到的博文，页面存在该div元素导致页面无法点击
  故采用以下方式临时处理（暂时找不到该元素是哪个函数注入到页面的）
  */
  var $modalBackdrop = $(".modal-backdrop");
  if ($modalBackdrop.length > 0) $modalBackdrop.remove();
}

// 生成文章目录
function applyTocbot() {
  var toc = jQuery("#toc");
  if (toc.length === 0 || !window.tocbot) {
    return;
  }
  var boardCtn = jQuery("#board-ctn");
  var boardTop = boardCtn.offset().top;

  window.tocbot.init(
    Object.assign(
      {
        tocSelector: "#toc-body",
        contentSelector: ".markdown-body",
        linkClass: "tocbot-link",
        activeLinkClass: "tocbot-active-link",
        listClass: "tocbot-list",
        isCollapsedClass: "tocbot-is-collapsed",
        collapsibleClass: "tocbot-is-collapsible",
        scrollSmooth: true,
        includeTitleTags: true,
        headingsOffset: -boardTop,
      },
      CONFIG.toc
    )
  );
  if (toc.find(".toc-list-item").length > 0) {
    toc.css("visibility", "visible");
  }

  Fluid.events.registerRefreshCallback(function () {
    if ("tocbot" in window) {
      tocbot.refresh();
      var toc = jQuery("#toc");
      if (toc.length === 0 || !tocbot) {
        return;
      }
      if (toc.find(".toc-list-item").length > 0) {
        toc.css("visibility", "visible");
      }
    }
  });
}

// loadFuncAndRemoveScriptExists(injectTocbotAndApply, 'script[funcDesc="tocbot-js-api"]');

function loadFuncAndRemoveScriptExists(funcItem, scriptFuncDesc) {
  console.log(scriptFuncDesc);
  var $el = $(scriptFuncDesc);
  if ($el.length === 0) {
    funcItem();
  } else {
    $el.remove();
    funcItem();
  }
}

/* 抽取Fluid主题集成的功能模块：tocbot
函数createScriptST通过创建script元素并插入到页面的方式引入外部JS文件——tocbot.min.js，
该js仅提供API；该script元素onload事件绑定的函数调用API作用于页面元素。
如果采用PJAX，该函数多次执行会造成页面script元素堆积，需要删除。
*/
function injectTocbotAndApply() {
  Fluid.utils.createScriptST(
    "https://lib.baomitu.com/tocbot/4.20.1/tocbot.min.js",
    "tocbot-js-api",
    function () {
      var toc = jQuery("#toc");
      if (toc.length === 0 || !window.tocbot) {
        return;
      }
      var boardCtn = jQuery("#board-ctn");
      var boardTop = boardCtn.offset().top;

      window.tocbot.init(
        Object.assign(
          {
            tocSelector: "#toc-body",
            contentSelector: ".markdown-body",
            linkClass: "tocbot-link",
            activeLinkClass: "tocbot-active-link",
            listClass: "tocbot-list",
            isCollapsedClass: "tocbot-is-collapsed",
            collapsibleClass: "tocbot-is-collapsible",
            scrollSmooth: true,
            includeTitleTags: true,
            headingsOffset: -boardTop,
          },
          CONFIG.toc
        )
      );
      if (toc.find(".toc-list-item").length > 0) {
        toc.css("visibility", "visible");
      }

      Fluid.events.registerRefreshCallback(function () {
        if ("tocbot" in window) {
          tocbot.refresh();
          var toc = jQuery("#toc");
          if (toc.length === 0 || !tocbot) {
            return;
          }
          if (toc.find(".toc-list-item").length > 0) {
            toc.css("visibility", "visible");
          }
        }
      });
    }
  );
}

/*
document.addEventListener("DOMContentLoaded", function () {

  const links = document.querySelectorAll('a:not([target="_blank"]');
  for (var i = 0; i < links.length; i++) {
    var el = links[i];
    el.addEventListener("click", function (e) {
      // 获取当前路径uriPath部分
      var currentPath = window.location.pathname;
      // 获取目标路径uriPath部分
      var linkHref = this.href; // 获取当前<a>元素的href属性值
      var targetPath = new URL(linkHref, window.location.origin).pathname;
      console.log(currentPath);
      console.log(targetPath);
      // 判断当前路径与目标路径是否为post页（/posts/替换为your文章路径部分）
      var isCurrentPosts = currentPath.startsWith("/posts/");
      var isTargetPosts = targetPath.startsWith("/posts/");

      // 如果当前页非文章页，且目标页是文章页，则阻止 Pjax 接收该事件，采用完全刷新。
      if (!isCurrentPosts && isTargetPosts) {
        window.location.href = targetPath;
        e.preventDefault();
        console.log("刷新页非文章页，访问文章页，完全刷新！");
      }
    });
  }

  const pjax = new Pjax({
    elements: 'a:not([target="_blank"])',
// selectors: ["#banner", "main"],
// selectors: ["main"],
    selectors: ["#container-pjax"],

  });
});

*/

/*
document.addEventListener("pjax:send", function () {
  NProgress.start();
});
document.addEventListener("pjax:complete", function () {
  NProgress.done();
});
*/

/*
document.addEventListener("pjax:success", function () {
  const elements = document.querySelectorAll("script[data-pjax]");
  elements.forEach(function (element) {
    const code = element.text || element.textContent || element.innerHTML || "";
    const script = document.createElement("script");
    if (element.id) {
      script.id = element.id;
    }
    if (element.className) {
      script.className = element.className;
    }
    if (element.type) {
      script.type = element.type;
    }
    if (element.src) {
      script.src = element.src;
      // Force synchronous loading of peripheral JS.
      script.async = false;
    }
    if (element.dataset.pjax !== undefined) {
      script.dataset.pjax = "";
    }
    if (code !== "") {
      script.appendChild(document.createTextNode(code));
    }
    element.parentNode.replaceChild(script, element);
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

  $.getScript(
    "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
  );
  loadFuncAndRemoveScriptExists(
    'script[func="tocbot-js-api"]',
    injectTocbotAndApply
  );
});
*/

/*
  当刷新页为"非文章页"，请求"文章页"时，额外注入文章页独有的 JS、CSS（必要scripts）。
  如果页面没有此元素，则创建此元素并插入到页面。
  */

/*
加载功能模块，并移除已存在的script元素。针对函数Fluid.utils.createScriptSt设计。
PJAX请求后，删除已存在的script元素，避免元素堆积。
  scriptFuncDesc(String): script元素的funcDesc属性值，表明该JS文件的作用
					tocbot-js-api: tocbot.min.js，仅提供API
					file-js-apply: 直接生效作用于页面元素
  funcItem(func): 功能模块本身
*/

/*
function loadFuncAndRemoveScriptExists(scriptFuncDesc, funcItem) {
  var ele = document.querySelector(scriptFuncDesc);
  if (ele === null) {
    funcItem();
  } else {
    ele.remove();
    funcItem();
  }
}
*/
