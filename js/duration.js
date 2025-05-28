(function () {
  // 设置建站时间（修改为你的时间），格式：月/日/年 时:分:秒
  var startTime = new Date("04/07/2025 00:00:00");
  function updateTime() {
    var now = new Date();
    // 计算时间差（毫秒）
    var diff = now - startTime;
	
    // 转换为天、小时、分钟、秒
    var totalSeconds = Math.floor(diff / 1000);

    var days = Math.floor(totalSeconds / (60 * 60 * 24));
    var hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    var minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    var seconds = totalSeconds % 60;

    // 补零
    var hStr = hours.toString().padStart(2, "0");
    var mStr = minutes.toString().padStart(2, "0");
    var sStr = seconds.toString().padStart(2, "0");

    document.getElementById("timeDate").innerHTML =
      "本站已安全运行&nbsp" + days + "&nbsp天&nbsp";
    document.getElementById("times").innerHTML =
      hStr + "&nbsp小时&nbsp" + mStr + "&nbsp分&nbsp" + sStr + "&nbsp秒";
  }

  // 初次调用
  updateTime();
  // 每250毫秒刷新一次
  setInterval(updateTime, 250);
})();
