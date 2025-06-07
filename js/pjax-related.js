/* ————丐版PJAX请求开始———— */

var firstPage = true;
var isfirstPagePosts = null;
var pjaxFlag = true; // 若刷新页非文章页，控制完全刷新仅执行一次

$(document).on("click", "a[target!=_blank]", function (event) {
  // 获取当前路径uriPath部分
  var currentPath = window.location.pathname;
  // 获取目标路径uriPath部分
  var linkHref = $(this).attr("href"); // 获取当前<a>元素的href属性值
  var targetPath = new URL(linkHref, window.location.origin).pathname;
  // 判断当前路径与目标路径是否为文章页（"/posts/"替换为你的文章路径部分）
  var isCurrentPosts = currentPath.startsWith("/posts/");
  var isTargetPosts = targetPath.startsWith("/posts/");

  if (firstPage) {
    isfirstPagePosts = isCurrentPosts;
    firstPage = false;
  }

  if (isfirstPagePosts) {
    // 若刷新页为文章页，全局PJAX
    pjaxClick();
  } else {
    // 若刷新页非文章页，首次请求文章页时，采用完全刷新；其余采用PJAX。
    if (pjaxFlag) {
      // 获取当前路径uriPath部分
      var currentPath = window.location.pathname;
      // 获取目标路径uriPath部分
      var linkHref = $(this).attr("href"); // 获取当前<a>元素的href属性值
      var targetPath = new URL(linkHref, window.location.origin).pathname;
      // 判断当前路径与目标路径是否为文章页（"/posts/"替换为你的文章路径部分）
      var isCurrentPosts = currentPath.startsWith("/posts/");
      var isTargetPosts = targetPath.startsWith("/posts/");

      // 在非文章页访问文章页时，采用一次完全刷新
      if (!isCurrentPosts && isTargetPosts) {
        window.location.href = targetPath;
        pjaxFlag = false;
      } else {
        pjaxClick();
      }
    } else {
      pjaxClick();
    }
  }

  function pjaxClick() {
    $.pjax.click(event, {
      container: "#container-pjax",
      fragment: "#container-pjax",
      timeout: 8000,
    });
  }
});

/* ————丐版PJAX请求结束———— */

/* 请使用上方丐版PJAX请求 */
/*
$(document).pjax('a[target!="_blank"]', "#container-pjax", {
  fragment: "#container-pjax",
  timeout: 8000,
});
*/

$(document).on("pjax:send", function () {
  NProgress.start(); // NProgress进度条
});

$(document).on("pjax:complete", function () {
  NProgress.done();
});

// "a[target!=_blank]"
$(document).on("pjax:end", function () {
  // reload necessary scripts（麻烦！）
  pjax_reload(); // 在此函数中集中设置必要的scripts
});

function pjax_reload() {
  // 避免pjax请求后，浏览器回退或前进时，造成typed打字机光标字符重复（视觉欺骗，其实干了）
  $("span[class~='typed-cursor']").remove();

  $("script[data-pjax]").each(function () {
    $(this).parent().append($(this).remove());
  });

  /* call necessary functions */

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

  // 如果元素（id="toc"）存在，即目标页面为文章页，则生成文章目录
  if ($("#toc").length > 0) applyTocbot();

  /* 无条件执行函数fancyBox()，可能存在问题。
  借助"data-pjax"属性，可以遍历重载fancyBox。
  虽然控制台一直报告（fancyBox already initialized），但其实没影响。
  为了消除该报告，直接将fancyBox的JS和CSS注入到所有页面，然后执行函数fancyBox()。
  （函数fancyBox()是调用fancyBox提供的API作用于页面图片。）
 */
  Fluid.plugins.fancyBox();

  /*
  打开搜索框，页面插入div元素：<div class="modal-backdrop fade show"></div>
  关闭搜索框，该元素被remove
  搜索框搜索到文章，点击其中的链接，发起pjax请求，导致页面存在该div元素而无法被点击。
  暂时找不到该元素是哪个函数注入到页面的，故采用以下方式临时处理。
  */
  $(".modal-backdrop").remove();

  // busuanzi.js是func-applay，而不单是func-API，注入到页面相当于执行功能函数
  $.getScript(
    "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
  );
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

/* 下面是纯JS版的pjax，可略 */

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

  Fluid.events.registerNavbarEvent();
  Fluid.events.registerParallaxEvent();
  Fluid.events.registerScrollDownArrowEvent();
  Fluid.events.registerScrollTopArrowEvent();
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
若刷新页非文章页，首次请求文章页时，额外注入文章页独有的JS、CSS（必要scripts）。
采用丐版PJAX，或修改Fluid主题布局使得所有页面都有文章页独有的JS和CSS，则无需此操作。
*/
// ......

// 示例：loadFuncAndRemoveScriptExists(injectTocbotAndApply, 'script[funcDesc="tocbot-js-api"]');

/*
加载功能模块，并移除已存在的script元素。针对函数Fluid.utils.createScriptSt设计。
PJAX请求后，删除已存在的script元素，避免元素堆积。
  funcItem(func): 功能模块本身
  scriptFuncDesc(String): script元素的funcDesc属性值，表明该JS文件的作用
		tocbot-js-api: tocbot.min.js，仅提供API
		busuanzi-js-apply: busuanzi.pure.mini.js，直接作用于页面元素（这类js并不需要使用funcItem）
*/
/*
function loadFuncAndRemoveScriptExists(funcItem, scriptFuncDesc) {
  var ele = document.querySelector(scriptFuncDesc);
  if (ele === null) {
    funcItem();
  } else {
    ele.remove();
    funcItem();
  }
}
*/
/* jQuery版本
function loadFuncAndRemoveScriptExists(funcItem, scriptFuncDesc) {
  var $el = $(scriptFuncDesc);
  if ($el.length === 0) {
    funcItem();
  } else {
    $el.remove();
    funcItem();
  }
}
*/

/* 抽取Fluid主题集成的功能模块：tocbot
函数createScriptST通过创建script元素并插入到页面的方式引入外部JS文件——tocbot.min.js，
该js仅提供API；该script元素onload事件绑定的函数调用API作用于页面元素。
如果借助"data-pjax"属性在PJAX请求时遍历重载，多次执行会造成页面script元素堆积，需要删除。
*/
/*
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
*/
