let game = game || {};
game.threejs = game.threejs || {};

game.threejs.Particles = (opts) => {
  this.black = new THREE.Color(0x000000);
  this.white = new THREE.Color(0xffffff);

  this.material = new THREE.ParticaleBasicMaterial({
    color: opts.tint == undefined ? 0xffffff : opts.tint,
    map: opts.texture == undefined ? null : opts.texture,
    size: opts.size == undefined ? 4 : opts.size,
    blending: opts.blending == undefined ? THREE.AdditiveBlending : opts.blending,
    depthTest: opts.depthTest == undefined ? false : opts.depthTest,
    transparent: opts.transparent == undefined ? true : opts.transparent,
    vertexColors: true,
    opacity: opts.opacity == undefined ? 1.0 : opts.opacity,
    sizeAttenuation: true
  });

  this.max = opts.max == undefined ? 1000 : opts.max;
  this.spawnRate = opts.spawnRate == undefined ? 0 : opts.spawnRate;

  this.spawn = opts.spawn == undefined ? new THREE.Vector3() : opts.spawn;
  this.velocity = opts.velocity == undefined ? new THREE.Vector3() : opts.velocity;
  this.randomness = opts.randomness == undefined ? new THREE.Vector3() : opts.randomness;
  this.force = opts.force == undefined ? new THREE.Vector3() : opts.force;
  this.spawnRadius = opts.spawnRadius == undefined ? new THREE.Vector3() : opts.spawnRadius;
  this.life = opts.life == undefined ? 60 : opts.life;
  this.ageing = 1 / this.life;
  this.friction = opts.friction == undefined ? 1.0 : opts.friction;
  this.color = new THREE.Color(opts.color == undefined ? 0xffffff : opts.color);
  this.color2 = opts.color2 == undefined ? null : new THREE.Color(opts.color2);

  this.position = opts.position == undefined ? new THREE.Vector3() : opts.position;
  this.rotation = opts.rotation == undefined ? new THREE.Vector3() : opts.rotation;
  this.sort = opts.sort == undefined ? false : opts.sort;

  this.pool = [];
  this.buffer = [];
  this.geometry = null;
  this.system = null;

  this.build();
}

game.threejs.Particales.prototype.build = () => {
  this.geometry = new THREE.Geometry();
  this.geometry.dynamic = true;

  this.pool = [];
  this.buffer = [];

  for (let i = 0; i < this.max; i++) {
    let par = new game.threejs.Particles();
    this.pool.push(par);
    this.buffer.push(par);
    this.geometry.vertices.push(par.position);
    this.geometry.colors.push(par.color);
  }

  this.system = new THREE.ParticleSystem(this.geometry, this.material);
  this.system.position = this.position;
  this.system.rotation = this.rotation;
  this.system.sort = this.sort;
}

game.threejs.Particles.prototype.emit = (count) => {
  let emitable = Math.min(count, this.pool.length);
  for (let i = 0; i < emitable; i++) {
    let pop = this.pool.pop();
    pop.available = false;
    pop.position.copy(this.spaw)
      .addSelf(
        this.randomVector()
        .multiplySelf(this.spawnRadius)
      );
  }
}