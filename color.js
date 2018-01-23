class Color {
  constructor() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.rpos = random(10000);
    this.gpos = random(10000);
    this.bpos = random(10000);
    this.apos = random(10000);
    this.cv = 0;
  }

  toArray() {
    return [this.r, this.g, this.b];
  }

  update() {
    this.r = 255 * noise(this.rpos);
    this.g = 255 * noise(this.gpos);
    this.b = 255 * noise(this.bpos);
    this.a = 255 * noise(this.apos);
    this.rpos += this.cv;
    this.gpos += this.cv;
    this.bpos += this.cv;
    this.apos += this.cv;
  }

  draw() {
    push();
    noStroke();
    fill(this.r, this.g, this.b);
    ellipse(mouseX, mouseY, min(width / 20, height / 20));
    pop();
  }

  copy() {
    return new Color(this.r, this.g, this.b, this.a);
  }

  average(other) {
    return new Color((this.r + other.r) / 2, (this.g + other.g) / 2, (this.b + other.b) / 2, (this.a + other.a) / 2);
  }

  lerp(other, k) {
    let r = -1;
    let g = -1;
    let b = -1;
    let a = -1;
    if (this.r == other.r) {
      r = this.r;
    }
    if (this.g == other.g) {
      g = this.g;
    }
    if (this.b == other.b) {
      b = this.b;
    }
    if (this.a == other.a) {
      a = this.a;
    }
    if (r == -1) {
      r = map(k, 0, 1, other.r, this.r);
    }
    if (g == -1) {
      g = map(k, 0, 1, other.g, this.g);
    }
    if (b == -1) {
      b = map(k, 0, 1, other.b, this.b);
    }
    if (a == -1) {
      a = map(k, 0, 1, other.a, this.a);
    }
    return new Color(r, g, b, a);
  }

  h(h){
    let hsv = RGBtoHSV(this.toArray());
    hsv[0] = this.bound(h, 0, 255);
    let rgb = HSVtoRGB(hsv);
    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
  }

  s(s) {
    let hsv = RGBtoHSV(this.toArray());
    hsv[1] = this.bound(s, 0, 360);
    let rgb = HSVtoRGB(hsv);
    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
  }

  v(v) {
    let hsv = RGBtoHSV(this.toArray());
    hsv[2] = this.bound(v, 0, 255);
    let rgb = HSVtoRGB(hsv);
    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
  }

  bound(val, minV, maxV){
    if(val < minV){
      val = minV;
    }
    if(val > maxV){
      val = maxV;
    }
    return val;
  }

  add(other) {
    let r = this.r + other.r;
    let g = this.g + other.g;
    let b = this.b + other.b;
    let a = this.a + other.a;
    if (r > 255) {
      r = 255;
    }
    if (g > 255) {
      g = 255;
    }
    if (b > 255) {
      b = 255;
    }
    if (a > 255) {
      a = 255;
    }
    return new Color(r, g, b, a);
  }

  sub(other) {
    let r = this.r - other.r;
    let g = this.g - other.g;
    let b = this.b - other.b;
    let a = this.a - other.a;
    if (r < 0) {
      r = 0;
    }
    if (g < 0) {
      g = 0;
    }
    if (b < 0) {
      b = 0;
    }
    if (a < 0) {
      a = 0;
    }
    return new Color(r, g, b, a);
  }
}

RGBtoHSV = function(color) {
  var r, g, b, h, s, v;
  r = color[0];
  g = color[1];
  b = color[2];
  minimum = min(r, g, b);
  maximum = max(r, g, b);


  v = maximum;
  delta = maximum - minimum;
  if (maximum != 0)
    s = delta / maximum; // s
  else {
    // r = g = b = 0        // s = 0, v is undefined
    s = 0;
    h = -1;
    return [h, s, undefined];
  }
  if (r === maximum)
    h = (g - b) / delta; // between yellow & magenta
  else if (g === maximum)
    h = 2 + (b - r) / delta; // between cyan & yellow
  else
    h = 4 + (r - g) / delta; // between magenta & cyan
  h *= 60; // degrees
  if (h < 0)
    h += 360;
  if (isNaN(h))
    h = 0;
  return [h, s, b];
};

HSVtoRGB = function(color) {
  var i;
  var h, s, v, r, g, b;
  h = color[0];
  s = color[1];
  v = color[2];
  if (s === 0) {
    // achromatic (grey)
    r = g = b = v;
    return [r, g, b];
  }
  h /= 60; // sector 0 to 5
  i = floor(h);
  f = h - i; // factorial part of h
  p = v * (1 - s);
  q = v * (1 - s * f);
  t = v * (1 - s * (1 - f));
  switch (i) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    default: // case 5:
      r = v;
      g = p;
      b = q;
      break;
  }
  return [r, g, b];
}
