import AbstractApplication from 'scripts/views/AbstractApplication';
import 'utils/GeometryUtils';
import UIColor from 'scripts/ui/ui_color';

import 'shaders/DigitalGlitch';
import 'postprocessing/GlitchPass';

import AudioAnalyser from 'scripts/plugins/audioAnalyser';
import Controls from 'scripts/controls/mouse_from_center';
import Text from 'scripts/objects/text';

import Please from 'pleasejs';
const {
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial
} = THREE;

class Main extends AbstractApplication {
  constructor(dev = true){
    super(dev);
    this.initGui();
    this.generateColorPalette();
    this.initScene();
    this.animate(); // always call this.animate at the end of constructor
  }

  initGui() {
    const gui = new dat.GUI();
    this.uiColor1 = new UIColor(gui, "color1");
    this.uiButton1 = gui.add(this, 'generateColorPalette');
    // this.uiColor2 = new UIColor(gui, "color2", new THREE.Color(0,0,0));
    // this.uiColor3 = new UIColor(gui, "color3");
  }

  initScene() {
    const controls = new Controls(this, this.scene, 1);

    const material1 = new MeshBasicMaterial({
      transparent: true,  // transparent true enables blending
    });
    material1.color = this._colorPalette[0]; // binds color to ui

    const icoGeometry = new IcosahedronGeometry(200, 2);
    this.addToScene(new Mesh(icoGeometry, material1));

    const wireMaterial = new MeshBasicMaterial({
      wireframe: true,
      transparent: true
    });
    wireMaterial.color = this._colorPalette[1];
    this.addToScene(new Mesh(icoGeometry, wireMaterial));

    const material3 = new MeshBasicMaterial({
      transparent: true,
      blending: THREE.CustomBlending,
      blendEquation: THREE.SubtractEquation,
      blendSrc: THREE.DstAlphaFactor,
      blendDst: THREE.SrcAlphaFactor
    });
    material3.color = this._colorPalette[2];


    const textMesh = new Text().getMesh(material3);
    textMesh.position.z = 200;
    this.addToScene(textMesh);
  }

  generateColorPalette() {
    if (!this._colorPalette) {
      this._colorPalette = [];
    }

    const rgbObject = {
      r: this.uiColor1.color.r * 255,
      g: this.uiColor1.color.g * 255,
      b: this.uiColor1.color.b * 255
    };
    const hsvObject = Please.RGB_to_HSV(rgbObject);

    const palette = Please.make_scheme(
      hsvObject,
      { format: 'rgb', scheme_type: 'split' }
    );

    palette.map((rgb, index) => {
      let color = this._colorPalette[index];

      if (!color) {
        color = new THREE.Color();
        this._colorPalette.push(color);
      }

      color.setRGB(rgb.r / 255, rgb.g / 255, rgb.b / 255);
    });
  }
}

export default Main;
