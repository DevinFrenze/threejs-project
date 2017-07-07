import AbstractApplication from 'scripts/views/AbstractApplication';
import 'utils/GeometryUtils';
import Text from 'scripts/text';
import UIColor from 'scripts/ui_color';

import 'shaders/DigitalGlitch';
import 'postprocessing/GlitchPass';

import AudioAnalyser from 'scripts/audioAnalyser';
import Controls from 'scripts/Controls';

class Main extends AbstractApplication {
  constructor(){
    super();
    this._updateComponents = [];

    this.initGui();
    this.initScene();
    this.initEffects();
    this.animate();
  }

  initGui() {
    const gui = new dat.GUI();
    this._uiColor = new UIColor(gui);

    const stats = new Stats();
    document.body.appendChild( stats.dom );
    this.subscribeToUpdate(stats);

    const controls = new Controls(this.camera, this.renderer.domElement );
    this.subscribeToUpdate(controls);
  }

  initScene() {
    this._material = new THREE.MeshBasicMaterial({ wireframe: false });
    const textMesh = new Text().getMesh(this._material);
    this.scene.add(textMesh);
  }

  initEffects() {
    this._glitchPass = new THREE.GlitchPass(128);
    setInterval(() => {
      this._glitchPass.goWild = !this._glitchPass.goWild;
    }, 1500);
    this.addToRenderChain(this._glitchPass);
  }

  update() {
    this._material.color = this._uiColor.toFloat();

    super.update();
    this._updateComponents.forEach((component) => component.update());
  }

  subscribeToUpdate(component) {
    this._updateComponents.push(component);
  }
}

export default Main;
