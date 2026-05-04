let capture;
let faceMesh;
let predictions = [];

function setup() {
  // 建立與視窗大小相同的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設產生的 HTML5 video 元件，我們只要在畫布上繪製它
  capture.hide();

  // 初始化 FaceMesh 模型
  faceMesh = ml5.facemesh(capture, () => console.log("模型準備就緒"));

  // 當偵測到臉部特徵時，更新資料
  faceMesh.on("predict", results => predictions = results);
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

  // 繪製臉部特徵連線
  if (predictions.length > 0) {
    drawFaceLines(predictions[0].scaledMesh, videoW, videoH);
  }
  pop();
}

// 繪製指定的臉部線條
function drawFaceLines(mesh, w, h) {
  // 定義多組要串接的點編號
  const paths = [
    [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291],
    [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184],
    // 左眼外圈 (包含編號 247)
    [130, 247, 30, 29, 27, 28, 56, 190, 243, 112, 26, 22, 23, 24, 110, 25, 130],
    // 左眼內圈 (包含編號 246)
    [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 33],
    // 右眼外圈 (包含編號 467)
    [359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255, 359],
    // 右眼內圈 (包含編號 466)
    [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466, 263],
    // 臉部最外層輪廓 (Face Oval)
    [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10]
  ];
  
  stroke(255, 0, 0); // 紅色線條
  strokeWeight(1);   // 粗細為 1
  
  let scaleX = w / capture.width;
  let scaleY = h / capture.height;

  // 巡覽所有路徑並繪製線條
  paths.forEach(indices => {
    for (let i = 0; i < indices.length - 1; i++) {
      let p1 = mesh[indices[i]];
      let p2 = mesh[indices[i + 1]];
      line(p1[0] * scaleX, p1[1] * scaleY, p2[0] * scaleX, p2[1] * scaleY);
    }
  });
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
