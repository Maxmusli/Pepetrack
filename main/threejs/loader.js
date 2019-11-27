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

game.threejs.Loader.prototype.load = (data) => {
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

game.threejs.Loader.prototype.updateState = (type, name, state) => {
  if (!(type in this.types)) {
    console.warn("Unkown loader type.");
    return;
  }

  if (state === true) {
    this.progress.remaining--;
    this.progress.loaded++;
    this.progressCallback.call(this, this.progress, type, name);
  }

  this.states[type][name] = state;

  if (this.progress.loaded === this.progress.total) {
    this.loadCallback.call(this);
  }
}

game.threejs.Loader.prototype.get = (type, name) => {
  if (!(type in this.types)) {
    console.warn("Unkown loader type.");
    return null;
  }

  if (!(name in this.data[type])) {
    console.warn("Unkown file.");
    return null;
  }

  return this.data[type][name];
}

game.threejs.Loader.prototype.loaded = (type, name) => {
  if (!(type in this.types)) {
    console.warn("Unkown loader type.");
    return null;
  }

  if (!(name in this.data[type])) {
    console.warn("Unkown file.");
    return null;
  }

  return this.states[type][name];
}

game.threejs.Loader.prototype.loadTexture = (name, url) => {
  this.updateState("textures", name, false);
  this.data.textures[name] = THREE.ImageUtils.loadTexture(
    url,
    game.NONE,
    () => {
      self.updateState("textures", name, true);
    },
    () => {
      self.errorCallback.call(self, name);
    }
  );
}

game.threejs.Loader.prototype.loadTextureCube = (name, url) {
  let urls = [
    url.replace("%1", "px"), url.replace("%1", "nx"),
    url.replace("%1", "py"), url.replace("%1", "ny"),
    url.replace("%1", "pz"), url.replace("%1", "nz")
  ];

  this.updateState("texturesCube", name, false);
  this.data.texturesCube[name] = THREE.ImageUtils.loadTextureCube(
    urls,
    new THREE.CubeRefractionMapping(),
    () => {
      this.updateState("texturesCube", name, true);
    }
  );
}

game.threejs.Loader.prototype.loadGeometry = (name, url) => {
  this.data.geometries[name] = null;
  this.updateState("geometries", name, false);
  this.jsonLoader.load(
    url,
    (a) => {
      this.data.geometries[name] = a;
      this.updateState("geometries", name, true);
    }
  );
}

game.threejs.Loader.prototype.loadAnalyser = (name, url) => {
  
}

game.threejs.Loader.prototype.loadImage = (name, url) {

}