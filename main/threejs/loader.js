let game = game || {};
game.threejs = game.threejs || {};

game.NONE = undefined;

game.threejs.Loader = (opts) => {
  this.jsonLoader = new THREE.JSONLoader();

  this.errorCallback = opts.onError === undefined ? 
    (s) => { console.warn("Error while loading %s.".replace("%s", s)) } :
    opts.onError;
  this.loadCallback = opts.onLoad === undefined ? 
    () => { console.log("Loaded.") } : 
    opts.onLoad;
  this.progressCallback = opts.onProgress === undefined ? 
    (progress, type, name) => { 
      console.log(`error: ${progress}, ${type}, ${name}`) 
    } : opts.onProgress;

  this.types = {
    textures: null,
    texturesCube: null,
    geometries: null,
    analysers: null,
    images: null,
    sounds: null
  };

  this.states = {};
  this.data = {};

  for (let t in this.types) {
    this.data[t] = {};
    this.states[t] = {};
  }

  this.progress = {
    total: 0,
    remaining: 0,
    loaded: 0,
    finished: false
  }
}

game.threeejs.Loader.prototype.load = (data) => {
  for (let k in this.types) {
    if (k in data) {
      let size = 0;
      for (let j in data[k]) {
        size++;
      }
      this.progress.total += size;
      this.progress.remaining += size;
    }
  }

  for (let t in data.textures) {
    this.loadTexture(t, data.textures[t]);
  }

  for (let c in data.texturesCube) {
    this.loadTextureCube(c, data.texturesCube[c]);
  }

  for (let g in data.geometries) {
    this.loadGeometry(g, data.geometries[g]);
  }

  for (let a in data.analysers) {
    this.loadAnalyser(a, data.analysers[a]);
  }

  for (let i in data.images) {
    this.loadImage(i, data.images[i]);
  }

  // sound goes here

  this.progressCallback.call(this, this.progress);
}

