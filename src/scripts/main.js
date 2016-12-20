import AbstractApplication from 'scripts/views/AbstractApplication'
import 'utils/GeometryUtils'
import 'shaders/DigitalGlitch';
import 'postprocessing/GlitchPass';

import dat from 'dat-gui';
import font from 'droid/droid_sans_regular.typeface.json'

class Main extends AbstractApplication {
  constructor(){
    super();
    this.createText();
    localStorage.setItem('color', [0.5, 0.5, 0.5]);
    // this.postProcessing();
    this.initGui();
    this.animate();
  }

  initGui() {
    // changing the scene control needs to change local storage
    // changing local storage need to change the actual value
    const sceneControl = function() {
      this.color = [ 255, 255, 255 ];
    };

    this._sceneControl = new sceneControl();
    const gui = new dat.GUI();

    const colorControl = gui.addColor(this._sceneControl, 'color'); 
    colorControl.onChange(function(value) {
      localStorage.setItem('color', value);
    });
  }

  createText() {
    var loader = new THREE.FontLoader();
    this.font = loader.parse(font);
    const size = 200;
    const textGeo = new THREE.TextGeometry("RBD", {
      font: this.font,
      height: 0,
      size,
      curveSegments: 16,
    });

    textGeo.computeBoundingBox();

    const centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    const material = this._material = new THREE.MeshBasicMaterial({ wireframe: false });

    const textMesh = this._textMesh = new THREE.Mesh( textGeo, material );
    textMesh.position.x = centerOffset;
    textMesh.position.y = -0.5 * size;;
    textMesh.rotation.y = Math.PI * 2;

    this._scene.add(this._textMesh);
  }

  postProcessing() {
    this._composer.passes.forEach(function(pass) { pass.renderToScreen = false; });
    this._glitchPass = new THREE.GlitchPass(128);
    this._glitchPass.renderToScreen = true;
    this._composer.addPass( this._glitchPass );
    setInterval(() => {
      this._glitchPass.goWild = !this._glitchPass.goWild;
    }, 1500);
  }

  update() {
    if (this._material) {
      const level = 7 * Math.pow(this._audioLevel, 2);
      this._material.color = localStorage.getItem('color').split(',').map((v) => level * parseInt(v) / 255);
    }
  }
}

export default Main;
