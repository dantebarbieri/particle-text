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

    this.resolveOverlap();

    this.color.cv = 0.1;
    this.color.update();
    this.color.v(204);
  }

  update() {
    this.color.update();
    this.color.v(204);
    let toStop = true;
    for (let point of this.points) {
      if (!this.stopped) {
        point.update();
        if (toStop && !point.finished) {
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
    translate(width / 2, height / 2);
    rotate(this.rot);
    translate(-width / 2, -height / 2);
    fill(this.color.r, this.color.g, this.color.b);
    // stroke(255);
    for (let point of this.points) {
      point.draw();
    }
    // noFill();
    // stroke(0, 0, 0, 204);
    // strokeWeight(map(this.tSize, 25, 85, 3, 6.5));
    // textSize(this.tSize);
    // text(this.text, this.pos.x, this.pos.y);
    // strokeWeight(1.5);
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
    let pointsCenter = createVector(this.pos.x + bboxPoints.w, this.pos.y);
    while (overlap) {
      let toRedraw = false;
      scanning: {
        for (let i = 0; i < words.length; i++) {
          let bboxDots = font.textBounds(words[i].text, 0, 0, words[i].tSize);
          let dotsCenter = createVector(words[i].pos.x + bboxDots.w, words[i].pos.y);
          for (let point of this.points) {
            let realPoint = p5.Vector.sub(point.target, pointsCenter);
            let x0 = realPoint.x * cos(this.rot) - realPoint.y * sin(this.rot);
            let y0 = realPoint.x * sin(this.rot) + realPoint.y * cos(this.rot);
            realPoint.x = x0;
            realPoint.y = y0;
            realPoint.add(pointsCenter);
            for (let dot of words[i].points){
              // let realDot = p5.Vector.add((p5.Vector.sub(dot.target, dotsCenter)).rotate(words[i].rot), dotsCenter);
              let realDot = p5.Vector.sub(dot.target, dotsCenter);
              let x1 = realDot.x * cos(this.rot) - realDot.y * sin(this.rot);
              let y1 = realDot.x * sin(this.rot) + realDot.y * cos(this.rot);
              realDot.x = x1;
              realDot.y = y1;
              realDot.add(dotsCenter);
              let distance = (p5.Vector.sub(realPoint, realDot)).mag();
              if(distance <= (point.rad + dot.rad) / 2){
                // console.log("Conflict Between:");
                // console.log("Words:");
                // console.log(this);
                // console.log("and");
                // console.log(words[i]);
                // console.log("Points:");
                // console.log(realPoint);
                // console.log("and")
                // console.log(realDot);
                // console.log("Resolving...");
                toRedraw = true;
                break scanning;
              }
            }
          }
        }
      }
      if(toRedraw){
        this.pos = createVector(random(width / margin, (margin - 1) * width / margin), random(height / margin, (margin - 1) * height / margin));
        this.rot = random(-QUARTER_PI / 2, QUARTER_PI / 2);
        this.points = this.createSeekers();
      }else{
        overlap = false;
      }
    }
  }
}
