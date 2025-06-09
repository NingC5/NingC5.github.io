// 响应式背景：根据窗口尺寸区分手机端和电脑端，实时切换背景。当 banner 占据页面小于一定比例，则显示背景；否则隐藏背景。
(function() {
// 定义背景图片链接（your bg address）
const mobileBgImageUrl = "url('/image/bg/和泉纱雾mob5.jpg')";
const desktopBgImageUrl = "url('/image/bg/white.webp')";

// 获取元素
const webBg = document.querySelector('#web_bg');
const banner = document.querySelector('#banner');

// 控制是否在请求动画帧中执行
let isUpdating = false;

// 设置背景图片的函数
function setBackground() {
  // window.innerWidth < 768，用来区分手机端和电脑端。
  if (window.innerWidth < 768) {
    // 手机端背景
    webBg.style.backgroundImage = mobileBgImageUrl;
  } else {
    // 电脑端背景
    webBg.style.backgroundImage = desktopBgImageUrl;
  }
  // 保持其他样式
  webBg.style.position = 'fixed';
  webBg.style.top = '0';
  webBg.style.left = '0';
  webBg.style.width = '100%';
  webBg.style.height = '100%';
  webBg.style.zIndex = '-1';
  webBg.style.backgroundSize = 'cover';
  webBg.style.backgroundRepeat = 'no-repeat';
}

// 根据 banner 在页面的占比，决定显示/隐藏 web_bg（背景）。
function updateVisibility() {
  // 每次滚动时获取元素在视口中的位置和尺寸。
  // bottom：元素底部距离视口顶部的距离。top：元素顶部距离视口顶部的距离。height：元素高度。
  const rect = banner.getBoundingClientRect();

  // 设置阈值。比如：视口高度（界面高度）的20%。
  const threshold = window.innerHeight * 0.2;

  if (rect.bottom > threshold) {
    // 若 banner 底部距离视口顶部大于阈值，则隐藏背景。
    webBg.style.display = 'none';
  } else {
    // 否则显示背景。
    webBg.style.display = 'block';
  }
  isUpdating = false; // 允许下一帧更新
}

// 绑定 load 事件，页面加载完成后调用。
window.addEventListener('DOMContentLoaded', () => {
  setBackground();       // 页面加载时设置背景
  updateVisibility();    // 初次检测
});

// 绑定 resize 事件，窗口变化时调用。
window.addEventListener('resize', () => {
  setBackground();       // 改变窗口时设置背景
  // 立即检测 banner 位置，调整背景显示状态。
  if (!isUpdating) {
    isUpdating = true;
    window.requestAnimationFrame(updateVisibility);
  }
});

// 绑定滚动事件，鼠标滚动时调用。
window.addEventListener('scroll', () => {
  if (!isUpdating) {
    isUpdating = true;
    window.requestAnimationFrame(updateVisibility);
  }
});
})();