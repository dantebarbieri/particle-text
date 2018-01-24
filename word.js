class Word {
  constructor(text, size, pos, rotationAngle, color, resolution) {
    this.text = text;
    this.tSize = size;
    this.pos = pos.copy();
    this.rot = rotationAngle;
    this.color = color;
    this.resolution = resolution;
    this.points = this.createSeekers();
    this.stopped = false;

    this.resolveOverlap(); // Slow Algorithm High Success Rate
    // this.fastResolveOverlap(); // Fast Algorithm Low Success Rate

    this.color.cv = 0.1;
    this.color.update();
    this.color.v(204);
  }

  update() {
    this.color.update();
    this.color.v(204);
    let toStop = true;
    for (let point of this.points) {
      if (!this.stopped && !point.finished) {
        point.update();
        if (toStop) {
          toStop = false;
        }
      }
    }
    if (toStop) {
      this.stopped = true;
    }
  }

  draw() {
    push();
    let bbox = font.textBounds(this.text, 0, 0, this.tSize);
    translate(this.pos.x, this.pos.y - bbox.h / 2);
    rotate(this.rot);
    translate(-this.pos.x, -this.pos.y + bbox.h / 2);
    fill(this.color.r, this.color.g, this.color.b);
    for (let point of this.points) {
      point.draw();
    }
    pop();
  }

  createSeekers() {
    let seekers = [];
    let bbox = font.textBounds(this.text, 0, 0, this.tSize);
    let ps = font.textToPoints(this.text, this.pos.x - bbox.w / 2, this.pos.y, this.tSize, {
      sampleFactor: this.resolution
    });
    for (let i = 0; i < ps.length; i++) {
      let target = ps[i];
      seekers.push(new Seeker(createVector(random(width), random(height)), createVector(0, 0), createVector(target.x, target.y), 1 / map(this.tSize, minSize, maxSize, 1.5 * this.resolution, 1.25 * this.resolution), random(minVMax, maxVMax)));
    }
    return seekers;
  }

  resolveOverlap() {
    let overlap = true;
    let bboxPoints = font.textBounds(this.text, 0, 0, this.tSize);
    while (overlap) {
      let pointsCenter = createVector(this.pos.x, this.pos.y - bboxPoints.h / 2);
      let toRedraw = false;
      scanning: {
        for (let i = 0; i < words.length; i++) {
          let bboxDots = font.textBounds(words[i].text, 0, 0, words[i].tSize);
          let dotsCenter = createVector(words[i].pos.x, words[i].pos.y - bboxDots.h / 2);
          for (let j = 0; j < this.points.length; j++) {
            let realPoint = this.points[j].target.copy();
            realPoint.sub(pointsCenter);
            realPoint.rotate(this.rot);
            realPoint.add(pointsCenter);
            for (let k = 0; k < words[i].points.length; k++) {
              let realDot = words[i].points[k].target.copy();
              realDot.sub(dotsCenter);
              realDot.rotate(words[i].rot);
              realDot.add(dotsCenter);
              let displacement = p5.Vector.sub(realPoint, realDot);
              let distance = displacement.mag();
              if (distance <= (this.points[j].rad + words[i].points[k].rad) / 2) {
                toRedraw = true;
                break scanning;
              }
            }
          }
        }
      }
      if (toRedraw) {
        this.pos = createVector(random(width / margin, (margin - 1) * width / margin), random(height / margin, (margin - 1) * height / margin));
        this.rot = random(-QUARTER_PI / 2, QUARTER_PI / 2);
        this.points = this.createSeekers();
        console.log("\"" + this.text + "\" is being Redrawn");
      } else {
        overlap = false;
        console.log("\"" + this.text + "\" Placed");
      }
    }
  }

  fastResolveOverlap() {
    let overlap = true;
    let bboxPoints = font.textBounds(this.text, 0, 0, this.tSize);
    while (overlap) {
      let pointsCenter = createVector(this.pos.x, this.pos.y - bboxPoints.h / 2);
      let toRedraw = false;
      scanning: {
        for (let i = 0; i < words.length; i++) {
          let bboxDots = font.textBounds(words[i].text, 0, 0, words[i].tSize);
          let dotsCenter = createVector(words[i].pos.x, words[i].pos.y - bboxDots.h / 2);
          let displacement = p5.Vector.sub(pointsCenter, dotsCenter);
          let distance = displacement.mag();
          if (distance <= (max(bboxPoints.w, bboxPoints.h) + max(bboxDots.w, bboxDots.h)) / 2) {
            // console.log(distance + " <= " + (max(bboxPoints.w, bboxPoints.h) + max(bboxDots.w, bboxDots.h)) / 2);
            toRedraw = true;
            break scanning;
          }
        }
      }
      if (toRedraw) {
        this.pos = createVector(random(width / margin, (margin - 1) * width / margin), random(height / margin, (margin - 1) * height / margin));
        this.rot = random(-QUARTER_PI / 2, QUARTER_PI / 2);
        this.points = this.createSeekers();
        console.log("\"" + this.text + "\" is being Redrawn");
      } else {
        overlap = false;
        console.log("\"" + this.text + "\" Placed");
      }
    }
  }
}
