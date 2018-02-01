import Smoke from 'scripts/objects/Smoke';
import Scene from 'scripts/scenes/Scene';

export default class SmokeScene extends Scene {
  constructor(updateContext) {
    super(updateContext);

    const light = new THREE.DirectionalLight(0xffffff,1);
    light.position.set(-1,0,1);
    light.name = 'light';
    this.scene.add(light);

    this.smoke = new Smoke(50);
    this.scene.add(this.smoke);

    updateContext.subscribeToUpdate(this.smoke);
  }
}
