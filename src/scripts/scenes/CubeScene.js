import Scene from 'scripts/scenes/Scene';

export default class CubeScene extends Scene {
  constructor(updateContext) {
    super(updateContext);

    const geometry = new THREE.BoxGeometry( 300, 300, 300);
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
