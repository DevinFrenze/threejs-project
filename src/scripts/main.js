import AbstractApplication from 'scripts/views/AbstractApplication';
import 'utils/GeometryUtils';
import UIColor from 'scripts/ui/ui_color';

import 'shaders/DigitalGlitch';
import 'postprocessing/GlitchPass';

import AudioAnalyser from 'scripts/plugins/audioAnalyser';
import Controls from 'scripts/controls/mouse_from_center';
import Text from 'scripts/objects/text';
import ColorPalette from 'scripts/objects/ColorPalette';

require( 'loaders/AssimpJSONLoader' );

const {
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  ObjectLoader,
  AssimpJSONLoader,
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
    this._colorPalette = new ColorPalette(this.uiColor1.color);
    this.uiButton1 = gui.add(this, 'generateColorPalette');
  }

  generateColorPalette() {
    this._colorPalette.generate(this.uiColor1.color);
  }

  initScene() {
    const controls = new Controls(this, this.scene, 1);
    this.renderer.setClearColor("#ffffff");

    const materials = new Array(this._colorPalette.size).fill(0).map(
      (val, index) => {
        const meshMaterial = new MeshBasicMaterial({ side: THREE.DoubleSide });
        meshMaterial.color = this._colorPalette.color(index);
        return meshMaterial;
      }
    );

    const assimpJSONLoader = new AssimpJSONLoader();

    assimpJSONLoader.load(
      "/models/delfin_low.assimp.json",
      (obj) => {
        const scale = 70;
        obj.scale.set(scale, scale, scale);

        const dolphins = new Array(this._colorPalette.size).fill(0);
        dolphins.map((val, index) => {
          const dolphin = obj.clone();
          dolphin.scale.set(scale, scale, scale);

          dolphin.traverse((child) => {
            if (child instanceof Mesh) {
              child.material = materials[index];
            }
          });

          dolphin.position.x = (index - ((this._colorPalette.size - 1) / 2)) * 100;

          this.addToScene(dolphin);
        });
      }
    );
  }
}

export default Main;
