import MaskScene from 'scripts/scenes/MaskScene';

export default class MaskCircleScene extends MaskScene {
  constructor(updateContext, maskedScene, radius) {
    super(updateContext, maskedScene);
    const geometry = new THREE.CircleGeometry( radius, 100);
    const circle = new THREE.Mesh(geometry);
    this.scene.add(circle);
  }
}
