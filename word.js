class Word {
  constructor(text, size, pos, rotationAngle, color, resolution) {
    this.text = text;
    this.tSize = size;
    this.pos = pos.copy();
    this.rot = rotationAngle;
    this.color = color;
    this.resolution = resolution;
    this.points = this.createSeekers();

    let overlap = true;
    while (overlap) {
      let toRedraw = false;
      scanning: {
        for (let i = 0; i < words.length; i++) {
          for (let point of this.points) {
            for (let dot of words[i].points){
              let distance = (p5.Vector.sub(point.target, dot.target)).mag();
              if(distance <= (point.rad + dot.rad) / 2){
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
      seekers.push(new Seeker(createVector(random(width), random(height)), createVector(0, 0), createVector(target.x, target.y), 1 / map(this.tSize, minSize, maxSize, 1.5 * this.resolution, 1.25 * this.resolution)));
    }
    return seekers;
  }
}
