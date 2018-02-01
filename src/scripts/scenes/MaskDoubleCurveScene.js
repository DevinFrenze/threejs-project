import MaskScene from 'scripts/scenes/MaskScene';

export default class MaskDoubleCurveScene extends MaskScene {
  constructor(updateContext, maskedScene, radius) {
    super(updateContext, maskedScene);

    this.radius = radius;
    this.velocity = 0;
    this.thetaLength = 0.33 * Math.PI;
    const thetaStart = Math.random() * 2 * Math.PI;
    this.changeRotation = this._changeRotation.bind(this);

    const geometry1 = new THREE.CircleGeometry( radius, 100, thetaStart, this.thetaLength );
    this.curve1 = new THREE.Mesh(geometry1);
    this.scene.add(this.curve1);

    const geometry2 = new THREE.CircleGeometry( radius, 100, thetaStart + Math.PI, this.thetaLength );
    this.curve2 = new THREE.Mesh(geometry2);
    this.scene.add(this.curve2);

    setInterval(this.changeRotation, 10000);
  }

  _changeRotation() {
    this.velocity = Math.random() - 0.5;
  }

  update(delta, elapsedTime) {
    this.curve1.rotation.z += delta * this.velocity;
    this.curve2.rotation.z += delta * this.velocity;
  }
}
