import AbstractApplication from 'scripts/views/AbstractApplication';
import 'utils/GeometryUtils';
import Text from 'scripts/text';
import UIColor from 'scripts/ui_color';

import dat from 'dat-gui';

class Main extends AbstractApplication {
  constructor(){
    super();
    this.initScene();
    this.populateScene();
    // this.postProcessing();
    this.initGui();
    this.animate();
  }

  initScene() {
    this._material = new THREE.MeshBasicMaterial({ wireframe: false });
  }

  populateScene() {
    const text = new Text();
    this._textMesh = text.getMesh(this._material);
    this._scene.add(this._textMesh);
  }

  postProcessing() {
    this._composer.passes.forEach(function(pass) { pass.renderToScreen = false; });
    // TODO add post processing here with its pass renderToScreen = true
  }

  initGui() {
    // changing the scene control needs to change local storage
    // changing local storage need to change the actual value
    //
    const gui = new dat.GUI();
    const uiColor = this._uiColor = new UIColor();
    uiColor.addToGui(gui);
  }


  update() {
    if (this._material) {
      const level = 7 * Math.pow(this._audioLevel, 2);
      this._material.color = this._uiColor.toFloat(level);
    }
  }
}

export default Main;
