class Seeker{
  constructor(pos, vel, target, rad, vmax){
    this.pos = pos;
    this.vel = vel;
    this.acc = createVector(0, 0);
    this.rad = rad;
    this.vmax = vmax;
    this.target = target;
    this.finished = false;
  }

  update(){
    this.acc = this.applyForce();
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }

  draw(){
    ellipse(this.pos.x, this.pos.y, this.rad);
  }

  applyForce(){
    let slowing_distance = 2 * this.vmax;
    let target_offset = p5.Vector.sub(this.target, this.pos);
    let distance = target_offset.mag();
    if(distance < this.rad / 2){
      this.finished = true;
    }
    let ramped_speed = this.vmax * (distance / slowing_distance);
    let clipped_speed = min(ramped_speed, this.vmax);
    let desired_velocity = p5.Vector.mult(target_offset, (clipped_speed / distance));
    let steering = p5.Vector.sub(desired_velocity, this.vel);
    return steering;
  }
}
