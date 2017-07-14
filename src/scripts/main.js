import AbstractApplication from 'scripts/views/AbstractApplication';
import 'utils/GeometryUtils';
import Text from 'scripts/objects/text';
import UIColor from 'scripts/ui/ui_color';

import 'shaders/DigitalGlitch';
import 'postprocessing/GlitchPass';

import AudioAnalyser from 'scripts/plugins/audioAnalyser';
import Controls from 'scripts/controls/Controls';

class Main extends AbstractApplication {
  constructor(){
    super();

    this.initGui();
    this.initNavigation();
    this.initScene();
    // this.initAudioAnalyser();
    // this.initEffects();
    this.animate();
  }

  initGui() {
    const gui = new dat.GUI();
    this._uiColor = new UIColor(gui);

    const stats = new Stats();
    document.body.appendChild( stats.dom );
    this.subscribeToUpdate(stats);
  }
  
  initNavigation() {
    const controls = new Controls(this.camera, this.renderer.domElement );
    this.subscribeToUpdate(controls);
  }

  initScene() {
    this._material = new THREE.MeshBasicMaterial({ wireframe: false });
    const textMesh = new Text().getMesh(this._material);
    this.addToScene(textMesh);
  }

  initAudioAnalyser() {
    this._audioAnalyser = new AudioAnalyser();
    this.subscribeToUpdate(this._audioAnalyser);
  }

  initEffects() {
    this._glitchPass = new THREE.GlitchPass(128);
    setInterval(() => {
      this._glitchPass.goWild = !this._glitchPass.goWild;
    }, 1500);
    this.addToRenderChain(this._glitchPass);
  }

  update() {
    super.update();

    // const audioLevel = this._audioAnalyser.level;
    // this._material.color = this._uiColor.toFloat().map((v) => v * audioLevel);

    this._material.color = this._uiColor.toFloat();
  }
}

export default Main;
