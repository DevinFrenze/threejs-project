import AbstractApplication from 'scripts/views/AbstractApplication'
import 'utils/GeometryUtils'
import 'shaders/DigitalGlitch';
import 'postprocessing/GlitchPass';

import font from 'droid/droid_sans_regular.typeface.json'

class Main extends AbstractApplication {
  constructor(){
    super();
    var loader = new THREE.FontLoader();
    this.font = loader.parse(font);
    this.createText();
    // this.postProcessing();
    this.animate();
  }

  createText() {
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
      this._material.color = Array(3).fill(2* this._audioLevel);
    }
  }
}
export default Main;
