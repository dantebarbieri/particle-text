const time = 3;
const margin = 7;
const terms = {
  "words" : ["Democracy", "America", "President", "Voice", "Responsibility", "Power",
  "Duty", "Congress", "Representatives", "Useless", "Controversial", "Independence",
  "Necessary", "Patriotic", "Standing", "Liberty", "Gerrymandering", "Election", "Senate",
  "Suffering", "Citizen"],
  "weights" : [4, 3, 3, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};
const minSize = 45;
const maxSize = 85;
const minRes = 0.1;
const maxRes = 0.205;

let minVMax = 20;
let maxVMax = 35;

let words = [];

let font;
let t0;
let d;
let seekers;
let w;
let start;

function preload() {
  font = loadFont('AvenirNextLTPro-Demi.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  w = 0;
  minWeight = min(terms.weights);
  maxWeight = max(terms.weights);
  for (let i = 0; i < terms.words.length; i++) {
    words.push(new Word(terms.words[i], map(terms.weights[i], minWeight, maxWeight, minSize, maxSize), createVector(random(width / margin, (margin - 1) * width / margin), random(height / margin, (margin - 1) * height / margin)), random(-QUARTER_PI / 2, QUARTER_PI / 2), new Color(), map(terms.weights[i], minWeight, maxWeight, maxRes, minRes)));
    minVMax += 6;
    minVMax += 6;
  }
  start = 0;
  // stroke(255);
  // fill(204);
  // strokeWeight(1.5);
  noStroke();
  // textFont(font);
  // textAlign(CENTER);
  // t0 = new Date().getTime();
  // background(26.5);
}

function draw() {
  background(26.5, 26.5, 26.5, 177.5);
  // if (new Date().getTime() >= t0 + time * 1000) {
  //   // console.log(t0);
  //   t0 = new Date().getTime();
  //   start++;
  // }
  if(start < words.length){
    words[start].update();
    // words[start].draw();
    if(words[start].stopped){
      start++;
    }
  }
  for(let i = 0; i < min(words.length, start + 1); i++){
    words[i].draw();
  }
}
