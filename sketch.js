const time = 3;
const margin = 7;
let dbug = false;

let minRes = 0.1;
let maxRes = 0.205;
let minSize = 45;
let maxSize = 85;
let minVMax = 20;
let maxVMax = 35;

let terms;
let words = [];

let font;
let t0;
let d;
let seekers;
let start;

function preload() {
  font = loadFont('AvenirNextLTPro-Demi.otf');
  terms = loadJSON('voting_terms.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  minRes = 185 / width;
  maxRes = 265 / width;
  minSize = width / 33;
  maxSize = width / 17.6;
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
  rectMode(CENTER);
}

function draw() {
  background(26.5, 26.5, 26.5, 177.5);
  if (dbug) {
    for (let i = 0; i < words.length; i++) {
      for (let j = 0; j < words[i].points.length; j++) {
        let bbox = font.textBounds(words[i].text, 0, 0, words[i].tSize);
        let t = words[i].points[j].target.copy();
        let o = createVector(words[i].pos.x, words[i].pos.y - bbox.h / 2);
        ellipse(o.x, o.y, map(mouseX, 0, width, 0, 75));
        t.sub(o);
        t.rotate(map(mouseY, 0, height, 0, 2 * words[i].rot));
        t.add(o);
        ellipse(t.x, t.y, map(mouseX, 0, width, 0, 2 * words[i].points[j].rad));
        push();
        noFill();
        stroke(255);
        strokeWeight(2);
        rect(words[i].pos.x, words[i].pos.y - bbox.h / 2, bbox.w, bbox.h);
        pop();
      }
    }
  }
  // if (new Date().getTime() >= t0 + time * 1000) {
  //   // console.log(t0);
  //   t0 = new Date().getTime();
  //   start++;
  // }
  if (start < words.length) {
    words[start].update();
    // words[start].draw();
    if (words[start].stopped) {
      start++;
    }
  }
  for (let i = 0; i < min(words.length, start + 1); i++) {
    words[i].draw();
  }
}
