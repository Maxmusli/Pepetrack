let pepetrack = pepetrack || {};
pepetrack.game = pepetrack.game || {};
// pepetrack.game.tracks = pepetrack.game.tracks || {};

pepetrack.game.tracks = {
  lib: null,
  materials: {},
  name: 'track',

  checkpoints: {
    list: [0, 1, 2],
    start: 0,
    last: 2
  },

  spawn: {
    x: -1134 * 2,
    y: 387,
    z: -443 * 2
  },

  spawnRotation: {
    x: 0,
    y: 0,
    z: 0
  },
  
  load: (opts) => {
    this.lib = new pepetrack.threejs.Loader();

    this.lib.load({
      textures: {
        'track.diffuse': "textures/tracks/diffuse.jpg",
      },
      geometries: {
        'bonus.base': "geometries/bonus/base/base.json",
        'booster': "geometries/booster/booster.json",
        'ship.feisar': "geometries/ships/feisar/feisar.json",
        'track.cityscape': "geometries/tracks/cityscape/track.json",
        'track.cityscape.scrapers1': "geometries/tracks/cityscape/scrapers1.json",
        'track.cityscape.scrapers2': "geometries/tracks/cityscape/scrapers2.json",
        'track.cityscape.start': "geometries/tracks/cityscape/start.json",
        'track.cityscape.start.banner': "geometries/tracks/cityscape/startbanner.json",
        'track.cityscape.bonus.speed': "geometries/tracks/cityscape/bonus/speed.json"
      },
      analysers: {
        'track.cityscape.collision': "textures/tracks/collision.png",
        'track.cityscape.height': "textures/tracks/height.png"
      },
    })
  },

  buildMaterials: () => {
    this.materials.track = bkcore.Utils.createNormalMaterial({
      diffuse: this.lib.get("textures", "track.diffuse"),
      specular: this.lib.get("textures", "track.specular"),
      normal: this.lib.get("textures", "track.normal"),
      ambient: 0xffffff,
      shininess: 42,
      metal: true,
      perPixel: true
    });

    this.materials.ship = bkcore.Utils.createNormalMaterial({
      diffuse: this.lib.get("textures", "ship.feisar.diffuse"), // change to car 
      ambient: 0x444444,
      shininess: 42,
      metal: true,
      perPixel: false
    });
  }
}