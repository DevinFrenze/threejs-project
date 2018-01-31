import Scene from 'scripts/scenes/Scene';

export default class CurveScene extends Scene {
  constructor(updateContext) {
    super(updateContext);

    this.scene.background = new THREE.Color( 0xaaaaaa );
    this.thetaLength = 0.33 * Math.PI;
    this.radius = 300;
    /*
    const geometry = new THREE.CircleGeometry( 100, 100, 0, this.thetaLength );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    this.curve = new THREE.Mesh(geometry, material);
    this.addToScene(this.curve);
    */
    const geometry = new THREE.CircleGeometry( this.radius, 100, 0, this.thetaLength );
    const material = new THREE.MeshBasicMaterial( { color: 0x000000 });
    this.curve = new THREE.Mesh(geometry, material);
    this.addToScene(this.curve);
  }

  update(delta, elapsedTime) {
    this.curve.rotation.z += delta * 0.5;
    const theta = this.thetaLength + (0.5 * Math.cos(elapsedTime));
    const geometry = new THREE.CircleGeometry( this.radius, 100, 0, theta );
    this.curve.geometry = geometry;
  }
}
