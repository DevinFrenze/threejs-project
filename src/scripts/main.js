import AbstractApplication from 'scripts/views/AbstractApplication';
import 'utils/GeometryUtils';
import UIColor from 'scripts/ui/ui_color';

import 'shaders/DigitalGlitch';
import 'postprocessing/GlitchPass';

import AudioAnalyser from 'scripts/plugins/audioAnalyser';
import Controls from 'scripts/controls/mouse_from_center';
import Text from 'scripts/objects/text';

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
    this.uiColor1 = new UIColor(gui, "color1");
    this.uiColor2 = new UIColor(gui, "color2", 0, 0, 0);
    this.uiColor3 = new UIColor(gui, "color3");
  }

  initScene() {
    // const controls = new Controls(this, this.scene, 1);

    const material1 = new MeshBasicMaterial({
      transparent: true,  // transparent true enables blending
    });
    material1.color = this.uiColor1.color; // binds color to ui

    const icoGeometry = new IcosahedronGeometry(200, 2);
    this.addToScene(new Mesh(icoGeometry, material1));

    const wireMaterial = new MeshBasicMaterial({
      color: this.uiColor2.color,
      wireframe: true,
      transparent: true
    });
    wireMaterial.color = this.uiColor2.color;
    this.addToScene(new Mesh(icoGeometry, wireMaterial));

    const material3 = new MeshBasicMaterial({
      transparent: true,
      blending: THREE.CustomBlending,
      blendEquation: THREE.SubtractEquation,
      blendSrc: THREE.DstAlphaFactor,
      blendDst: THREE.SrcAlphaFactor
    });
    material3.color = this.uiColor3.color;


    const textMesh = new Text().getMesh(material3);
    textMesh.position.z = 200;
    this.addToScene(textMesh);
  }

}

export default Main;
