import MaskScene from 'scripts/scenes/MaskScene';

export default class MaskCurveScene extends MaskScene {
  constructor(updateContext, maskedScene, radius) {
    super(updateContext, maskedScene);

    this.radius = radius;
    this.velocity = 0;
    this.thetaLength = (0.27 * Math.PI) + Math.random();
    const thetaStart = Math.random() * 2 * Math.PI;
    this.changeRotation = this._changeRotation.bind(this);

    const geometry = new THREE.CircleBufferGeometry( radius, 100, thetaStart, this.thetaLength );
    this.curve = new THREE.Mesh(geometry);
    this.scene.add(this.curve);
    setInterval(this.changeRotation, 10000);
  }

  _changeRotation() {
    this.velocity = Math.random() - 0.5;
  }

  update(delta, elapsedTime) {
    this.curve.rotation.z += delta * this.velocity;
  }
}
