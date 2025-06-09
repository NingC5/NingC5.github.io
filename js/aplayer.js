(function() {
  var oldLoadAp = window.onload;
  window.onload = function () {
    oldLoadAp && oldLoadAp();
    new APlayer({
      container: document.getElementById('aplayer'),
      fixed: true,	// 开启吸底模式
	  // mini: true,	// 开启迷你模式
      autoplay: false,	// 关闭音频自动播放
      order: 'random',
      theme: '#b7daff',
      preload: 'none',	// 不预加载
	  volume: '0.1', // 音量0.1
      audio: [
        {
          name: 'Hoping She Would Be There',
          artist: 'Steve Barakatt',
          url: 'https://music.163.com/song/media/outer/url?id=1992459.mp3',
          cover: '/image/post/girl.jpg'
        }, {
          name: 'Sometimes when it Rains',
          artist: 'Wouter Harbers/Robert Cekov',
          url: 'https://music.163.com/song/media/outer/url?id=1445599175.mp3',
          cover: '/image/post/girl.jpg'
        }, {
          name: 'Autumn Walk',
          artist: 'Brad Jacobsen',
          url: 'https://music.163.com/song/media/outer/url?id=28661573.mp3',
          cover: '/image/post/girl.jpg'
        }, {
          name: 'Angels',
          artist: 'Joshua Radin',
          url: 'https://music.163.com/song/media/outer/url?id=29950496.mp3',
          cover: '/image/post/girl.jpg'
        }, {
          name: 'Without You',
          artist: 'X JAPAN',
          url: 'https://music.163.com/song/media/outer/url?id=37820373.mp3',
          cover: '/image/post/girl.jpg'
        }, {
          name: '夢のしずく',
          artist: 'Takako Matsu',
          url: 'https://music.163.com/song/media/outer/url?id=22822226.mp3',
          cover: '/image/post/girl.jpg'
        }, {
          name: 'Left Nanjing, Silence Follows',
          artist: 'Mr. Li',
          url: '/music/Left Nanjing, Silence Follows.mp3',
          cover: '/image/post/girl.jpg'
        }, {
          name: 'Angel',
          artist: 'David Tao',
          url: '/music/Angel.mp3',
          cover: '/image/post/girl.jpg'
        }, {
          name: 'current',
          artist: 'KOKIA',
          url: 'https://music.163.com/song/media/outer/url?id=28285362.mp3',
          cover: '/image/post/girl.jpg'
        }, {
          name: 'さがしものは歌の中',
          artist: 'KOKIA',
          url: 'https://music.163.com/song/media/outer/url?id=1972701477.mp3',
          cover: '/image/post/girl.jpg'
        }, {
          name: '時計仕掛けのTikTok',
          artist: 'KOKIA',
          url: 'https://music.163.com/song/media/outer/url?id=2133747616.mp3',
          cover: '/image/post/girl.jpg'
        }, {
          name: 'Melody',
          artist: 'KOKIA',
          url: 'https://music.163.com/song/media/outer/url?id=27872014.mp3',
          cover: '/image/post/girl.jpg'
        }
      ]
    });
  }
})();