import Scene from 'scripts/scenes/Scene';

export default class ConeScene extends Scene {
  constructor(updateContext) {
    super(updateContext);

    this.scene.background = new THREE.Color( 0x00ffff );
    const geometry = new THREE.ConeGeometry( 5, 5, 5);
    const material = new THREE.MeshBasicMaterial(
      {
        color: 0xff00ff,
        side: THREE.DoubleSide
      }
    );
    this.cone = new THREE.Mesh(geometry, material);
    this.cone.position.z = -3;
    this.addToScene(this.cone);
  }

  update(delta) {
    this.cone.rotation.z += delta * 0.5;
  }
}
