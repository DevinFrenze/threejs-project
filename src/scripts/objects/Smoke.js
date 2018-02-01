const DEFAULT_NUMBER_OF_SMOKE_PARTICLES = 150;

export default class Smoke extends THREE.Object3D {
  constructor(
      numParticles = DEFAULT_NUMBER_OF_PARTICLES,
      speed = 1,
      spread = 250,
      color = new THREE.Color(0x000000)
    ) {
    super();

    this._speed = speed;
    this._spread = spread;
    this.name = 'smoke';
    this.initGeometry(numParticles, color);
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
        Math.random() * this._spread - (this._spread / 2),
        Math.random() * this._spread - (this._spread / 2),
        Math.random() * this._spread * 2 - (this._spread / 5)
      );
      particle.rotation.z = Math.random() * 360;
      this.add(particle);
      this.smokeParticles.push(particle);
    }
  }

  update(delta) {
    let sp = this.smokeParticles.length;
    while (sp--) {
      this.smokeParticles[sp].rotateZ(delta * 0.2 * this._speed);
    }
  }

  get spread() { this._spread; }
  get speed() { this._speed; }
  set speed(speed) { this._speed = speed; }
}
