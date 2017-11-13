const DEFAULT_NUMBER_OF_SMOKE_PARTICLES = 150;

export default class Smoke extends THREE.Object3D {
  constructor(abstractApplication,
      numParticles = DEFAULT_NUMBER_OF_PARTICLES,
      speed = 1,
      color
    ) {
    super();

    this._speed = speed;
    this.initGeometry(numParticles, color);
    abstractApplication.addToScene(this);
    abstractApplication.subscribeToUpdate(this);
  }

  initGeometry(numParticles, color) {
    const textureLoader = new THREE.TextureLoader();
    const smokeTexture = new textureLoader.load('/textures/Smoke-Element.png');
    const smokeMaterial = new THREE.MeshLambertMaterial({
      map: smokeTexture,
      transparent: true
    });
    // setting color outside of constructor links changes to color
    smokeMaterial.color = color;
    const smokeGeo = new THREE.PlaneGeometry(300,300);
    this.smokeParticles = [];

    for (let p = 0; p < numParticles; p++) {
      let particle = new THREE.Mesh(smokeGeo,smokeMaterial);
      particle.position.set(
        Math.random() * 500 - 250,
        Math.random() * 500 - 250,
        Math.random() * 1000 - 100
      );
      particle.rotation.z = Math.random() * 360;
      this.add(particle);
      this.smokeParticles.push(particle);
    }
  }

  get speed() {
    this._speed;
  }

  set speed(speed) {
    this._speed = speed;
  }

  update(delta) {
    let sp = this.smokeParticles.length;
    while (sp--) {
      this.smokeParticles[sp].rotation.z += (delta * 0.2 * this._speed);
    }
  }
}
