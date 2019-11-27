class Game {
  constructor() {
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      100
    );
    // this.camera.position.set(10, 10, 200);
    this.camera.position.z = 200

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 20, 10);
    const ambient = new THREE.AmbientLight(0x707070); // soft white light

    this.controls = new THREE.OrbitControls(this.camera);

    this.scene.add(light);
    this.scene.add(ambient);

    const loader = new THREE.FBXLoader();
    const game = this;

    loader.load("./assets/Audi_R8.fbx", function (object) {
      game.car = object;
      game.scene.add(object);
      game.controls.target = object.position.clone();
      game.controls.update();
      // object.position.y -= 60;

      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = child.receiveShadow = true;
        }
      });

      game.animate();

    }, null, function (error) {
      console.error(error);
    })
  }

  animate() {
    const game = this;
    requestAnimationFrame(function () { game.animate(); });

    this.renderer.render(this.scene, this.camera);
  }
}