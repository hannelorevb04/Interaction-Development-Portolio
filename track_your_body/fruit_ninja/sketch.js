let video;
let handpose;
let predictions = [];
let fruits = [];

function preload() {
  // Geluidsformaten aangeven, ook al gebruik je momenteel geen geluid
  // soundFormats('mp3', 'ogg');
  // sliceSound = loadSound('slice.mp3'); // Zorg ervoor dat je een slice geluid hebt in de juiste map
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Controleer of de ml5 bibliotheek correct geladen is
  try {
    if (ml5) {
      handpose = ml5.handpose(video, modelReady);
      handpose.on('predict', results => {
        predictions = results;
      });
    } else {
      throw new Error("ml5 library is not loaded properly.");
    }
  } catch (error) {
    console.error(error.message);
  }

  for (let i = 0; i < 5; i++) {
    fruits.push(new Fruit(random(width), random(height), random(2, 5), random(0.5, 1.5)));
  }
}

function modelReady() {
  console.log('Model Loaded!');
}

function draw() {
  image(video, 0, 0, width, height);
  drawHand();
  updateFruits();
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

function updateFruits() {
  for (let fruit of fruits) {
    fruit.show();
    fruit.update();
    fruit.checkSlice(predictions);
  }
}

class Fruit {
  constructor(x, y, speed, size) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = size;
    this.sliced = false;
  }

  show() {
    if (!this.sliced) {
      fill(0, 255, 0);
      ellipse(this.x, this.y, this.size * 20);
    }
  }

  update() {
    if (!this.sliced) {
      this.y += this.speed;
      if (this.y > height) {
        this.y = random(-100, -10);
        this.x = random(width);
      }
    }
  }

  checkSlice(predictions) {
    if (predictions.length > 0) {
      let hand = predictions[0];
      let x = hand.landmarks[8][0]; // Index finger tip x position
      let y = hand.landmarks[8][1]; // Index finger tip y position

      if (dist(x, y, this.x, this.y) < this.size * 10) {
        this.sliced = true;
        // sliceSound.play(); // Zorg ervoor dat je het slice geluid hebt als je dit activeert
      }
    }
  }
}
