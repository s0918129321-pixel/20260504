let capture;

function setup() {
  // 建立與視窗大小相同的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設產生的 HTML5 video 元件，我們只要在畫布上繪製它
  capture.hide();
}

function draw() {
  // 設定畫布背景顏色
  background('#e7c6ff');

  // 計算影像顯示的寬高（全螢幕寬高的 50%）
  let videoW = width * 0.5;
  let videoH = height * 0.5;

  // 計算置中座標
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  push();
  // 為了達成左右顛倒（鏡像）：
  // 1. 先將原點移至影像預計顯示位置的右側邊界 (x + videoW)
  translate(x + videoW, y);
  // 2. 在 X 軸進行 -1 倍縮放，達成水平翻轉
  scale(-1, 1);
  
  // 3. 繪製影像。此時 (0, 0) 是剛剛 translate 過去的位置
  image(capture, 0, 0, videoW, videoH);
  pop();
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

