let handpose;
let video;
let predictions = [];
let modelLoaded = false;

let grid = [];
let cols = 5;  // Decreased the number of columns to 4
let rows = 4;  // Decreased the number of rows to 3
let cardWidth, cardHeight;
let padding = 20; // Increased padding for more space between cards
let selectedCards = [];
let matchedCards = [];
let cardValues = [];
let totalPairs = (cols * rows) / 2;
let matchedPairs = 0;

let fingerStaysOnCardTime = 1000; // Time in milliseconds
let currentCard = null;
let cardHoveredStartTime = 0;

let loading = true;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  cardWidth = (width - (cols + 1) * padding) / cols;
  cardHeight = (height - (rows + 1) * padding) / rows;

  handpose = ml5.handpose(video, modelReady);

  handpose.on("predict", results => {
    predictions = results;
  });

  video.hide();

  // Initialize the game
  initializeGame();

  // Create a reset button
  let resetButton = createButton('Reset');
  resetButton.position(10, height + 125); // Position it below the canvas
  resetButton.mousePressed(resetGame);
}

function initializeGame() {
  // Reset game variables
  grid = [];
  selectedCards = [];
  matchedCards = [];
  matchedPairs = 0;

  // Initialize card values and shuffle
  cardValues = [];
  for (let i = 0; i < totalPairs; i++) {
    cardValues.push(i);
    cardValues.push(i);
  }
  cardValues = shuffle(cardValues);

  // Create grid of cards
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      let index = i * cols + j;
      row.push({ value: cardValues[index], revealed: false });
    }
    grid.push(row);
  }

  // Set loading to false once game is initialized
  loading = false;
}

function resetGame() {
  initializeGame();
}

function modelReady() {
  console.log("Model ready!");
  modelLoaded = true;
}

function draw() {
  frameRate(30);
  if (loading) {
    drawLoadingScreen();
  } else if (modelLoaded) {
    // Flip the video horizontally
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();
    
    drawGrid();
    drawFingers();
  }
}

function drawLoadingScreen() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Loading...", width / 2, height / 2);
}

function drawGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let card = grid[i][j];
      let x = j * (cardWidth + padding) + padding;
      let y = i * (cardHeight + padding) + padding;

      // Draw card background
      if (!matchedCards.includes(card)) {
        if (card.revealed) {
          fill(255);
          stroke(0);
          strokeWeight(2);
          rect(x, y, cardWidth, cardHeight, 10); // Rounded corners
          fill(0);
          noStroke();
          textSize(32);
          textAlign(CENTER, CENTER);
          text(card.value, x + cardWidth / 2, y + cardHeight / 2);
        } else {
          fill(50, 100, 200);
          stroke(0);
          strokeWeight(2);
          rect(x, y, cardWidth, cardHeight, 10); // Rounded corners
        }
      }
    }
  }
}

function drawFingers() {
  push();
  rectMode(CORNERS);
  noStroke();
  fill(255, 0, 0);
  if (predictions[0] && predictions[0].hasOwnProperty('annotations')) {
    let indexFinger = predictions[0].annotations.indexFinger[3];
    
    // Flip the finger coordinates horizontally
    let flippedX = width - indexFinger[0];
    circle(flippedX, indexFinger[1], 10);

    let col = Math.floor((flippedX - padding) / (cardWidth + padding));
    let row = Math.floor((indexFinger[1] - padding) / (cardHeight + padding));

    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      let hoveredCard = grid[row][col];

      if (hoveredCard !== currentCard) {
        currentCard = hoveredCard;
        cardHoveredStartTime = millis();
      } else if (millis() - cardHoveredStartTime > fingerStaysOnCardTime) {
        if (!hoveredCard.revealed && !matchedCards.includes(hoveredCard)) {
          hoveredCard.revealed = true;
          selectedCards.push(hoveredCard);

          if (selectedCards.length === 2) {
            if (selectedCards[0].value === selectedCards[1].value) {
              matchedCards.push(...selectedCards);
              matchedPairs++;
              selectedCards = [];
            } else {
              setTimeout(() => {
                selectedCards[0].revealed = false;
                selectedCards[1].revealed = false;
                selectedCards = [];
                currentCard = null; // Reset current card
              }, 1000);
            }
          }
        }
      }
    } else {
      currentCard = null;
    }
  }
  pop();

  if (matchedPairs === totalPairs) {
    fill(0, 255, 0);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("You Win!", width / 2, height / 2);
  }
}
