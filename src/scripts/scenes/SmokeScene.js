import Smoke from 'scripts/objects/Smoke';
import Scene from 'scripts/scenes/Scene';

export default class SmokeScene extends Scene {
  constructor(updateContext) {
    super(updateContext);

    const light = new THREE.DirectionalLight(0xffffff,1);
    light.position.set(-1,0,1);
    light.name = 'light';
    this.scene.add(light);

    this.smoke = new Smoke(30, 1, 230, new THREE.Color(0x888888));
    this.scene.add(this.smoke);

    const geo = new THREE.CircleBufferGeometry(500, 100);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const circle = new THREE.Mesh(geo, mat);
    this.scene.add(circle);

    updateContext.subscribeToUpdate(this.smoke);
  }
}
