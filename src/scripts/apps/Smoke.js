import AbstractApplication from 'scripts/views/AbstractApplication';
import Smoke from 'scripts/objects/Smoke';
import ColorPalette from 'scripts/objects/ColorPalette';

// NOTE: this program runs slow when antialiasing is turned on
export default class SmokeExample extends AbstractApplication {
  constructor(dev = false){
    super(dev);

    this.camera.position.set( 0, 0, 1000);
    this.camera.lookAt( new THREE.Vector3(0,0,0) );
    this.initGui();
    this.initScene();
    this.animate(); // always call this.animate at the end of constructor
  }

  initGui() {
    this.colorPalette = new ColorPalette(this, new THREE.Color(0,1,1), 10000);
  }

  initScene() {
    const light = new THREE.DirectionalLight(0xffffff,0.5);
    light.position.set(-1,0,1);
    this.addToScene(light);

    const color1 = this.colorPalette.color(0);
    this.smoke1 = new Smoke(this, 100, 0.8, color1);
    this.smoke1.scale.set(0.75, 0.75, 0.75);

    const color2 = this.colorPalette.color(2);
    this.smoke2 = new Smoke(this, 150, 0.7, color2);
    this.smoke2.scale.set(1.85, 1.85, 1);
    this.smoke2.position.z = -500;
  }
}
