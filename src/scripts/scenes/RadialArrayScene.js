import Scene from 'scripts/scenes/Scene';

export default class RadialArrayScene extends Scene {
  constructor(updateContext) {
    super(updateContext);
    this.changeRotation = this._changeRotation.bind(this);
    this.velocity = 0;
    this.parentObject = new THREE.Object3D();
    this.blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.addArray();
    this.addToScene(this.parentObject);
    setInterval(this.changeRotation, 20000);
  }

  addArray() {
    const pieces = 60;
    const size = 2 * Math.PI / (7 * pieces);
    for (let i = 0; i < 60; i++) {
      const geometry1 = new THREE.RingBufferGeometry(
          550, 596,
          3, 1,
          2 * Math.PI * i / pieces, size
      );
      const ring1 = new THREE.Mesh(geometry1, this.blackMaterial);
      this.parentObject.add(ring1);

      const geometry2 = new THREE.RingBufferGeometry(
          552, 594,
          3, 1,
          (2 * Math.PI * i / pieces) + 0.004, size - 0.008
      );
      const ring2 = new THREE.Mesh(geometry2, this.whiteMaterial);
      this.parentObject.add(ring2);
    }
  }

  _changeRotation() {
    this.velocity = Math.random() - 0.5;
  }

  update(delta) {
    this.parentObject.rotateZ(delta * this.velocity);
  }
}
