


// ���屳��ͼƬ����
const mobileBgImageUrl = "url('/images/bg/��Ȫɴ��mob1.avif')";
const desktopBgImageUrl = "url('/images/bg/bg.webp')";

// ��ȡԪ��
const webBg = document.querySelector('#web_bg');
const banner = document.querySelector('#banner');
const bannerMask = document.querySelector('#banner .mask');

// ���ñ���ͼƬ�ĺ���
function setBackground() {
  if (window.innerWidth < 768) {
    // �ֻ��˱���
    webBg.style.backgroundImage = mobileBgImageUrl;
  } else {
    // ���Զ˱���
    webBg.style.backgroundImage = desktopBgImageUrl;
  }
  // ����������ʽ
  webBg.style.position = 'fixed';
  webBg.style.width = '100%';
  webBg.style.height = '100%';
  webBg.style.zIndex = '-1';
  webBg.style.backgroundSize = 'cover';

  // ����banner����Ϊ��
  if (banner) {
    banner.style.backgroundImage = 'none';
  }

  // ����banner .mask ������ɫ͸��
  if (bannerMask) {
    bannerMask.style.backgroundColor = 'rgba(0,0,0,0)';
  }
}

// ҳ����غʹ��ڱ仯ʱ����
window.addEventListener('load', setBackground);
window.addEventListener('resize', setBackground);