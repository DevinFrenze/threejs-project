import Scene from 'scripts/scenes/Scene';

export default class CubeScene extends Scene {
  constructor(updateContext) {
    super();
    updateContext.subscribeToUpdate(this);

    this.scene.background = new THREE.Color( 0xff0000 );
    const geometry = new THREE.BoxGeometry( 1, 1, 1);
    const material = new THREE.MeshBasicMaterial(
      {
        color: 0xffff00,
        side: THREE.DoubleSide
      }
    );
    this.box = new THREE.Mesh(geometry, material);
    this.addToScene(this.box);
  }

  update(delta) {
    this.box.rotation.x += delta * 0.5;
    this.box.rotation.y += delta * 0.5;
  }
}
