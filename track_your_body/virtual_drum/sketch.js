let video;
let handpose;
let predictions = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on('predict', results => {
    predictions = results;
  });
}

function modelReady() {
  console.log('Model Loaded!');
}

function draw() {
  image(video, 0, 0, width, height);
  drawHand();
  checkDrumHits();
}

function drawHand() {
  for (let i = 0; i < predictions.length; i++) {
    let prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j++) {
      let keypoint = prediction.landmarks[j];
      fill(0, 0, 255);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}

function checkDrumHits() {
  if (predictions.length > 0) {
    let hand = predictions[0];
    let x = hand.landmarks[8][0]; // Index finger tip x position
    let y = hand.landmarks[8][1]; // Index finger tip y position

    // Check voor hits op verschillende drums
    if (x < width / 3 && y > height - 100) {
      console.log('Kick drum hit!');
    } else if (x > width / 3 && x < 2 * width / 3 && y > height - 100) {
      console.log('Snare drum hit!');
    } else if (x > 2 * width / 3 && y > height - 100) {
      console.log('Hi-hat hit!');
    }
  }
}
