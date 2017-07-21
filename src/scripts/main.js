import AbstractApplication from 'scripts/views/AbstractApplication';
import 'utils/GeometryUtils';
import UIColor from 'scripts/ui/ui_color';

import 'shaders/DigitalGlitch';
import 'postprocessing/GlitchPass';

import AudioAnalyser from 'scripts/plugins/audioAnalyser';
import Controls from 'scripts/controls/mouse_from_center';

const {
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial
} = THREE;

class Main extends AbstractApplication {
  constructor(dev = true){
    super(dev);
    this.initGui();
    this.initScene();
    this.animate(); // always call this.animate at the end of constructor
  }

  initGui() {
    const gui = new dat.GUI();
    this._uiColor = new UIColor(gui);
  }

  initScene() {
    const controls = new Controls(this, this.scene, 1);

    this.camera.position.z = 250;
    this.camera.position.y = 100;

    this._material = new MeshBasicMaterial({ wireframe: false });
    const icoGeometry = new IcosahedronGeometry(200, 2);
    this.addToScene(new Mesh(icoGeometry, this._material));

    const wireMaterial = new MeshBasicMaterial({
      wireframe: true,
      color: "#000000"
    });

    this.addToScene(new Mesh(icoGeometry, wireMaterial));
  }

  update() {
    super.update();
    this._material.color = this._uiColor.toFloat();
  }
}

export default Main;
