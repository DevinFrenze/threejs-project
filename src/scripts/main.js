import AbstractApplication from 'scripts/views/AbstractApplication';
import 'utils/GeometryUtils';
import UIColor from 'scripts/ui/ui_color';

import 'shaders/DigitalGlitch';
import 'postprocessing/GlitchPass';

import AudioAnalyser from 'scripts/plugins/audioAnalyser';
import Text from 'scripts/objects/text';
import ColorPalette from 'scripts/objects/ColorPalette';
import Terrain from 'scripts/objects/Terrain';
import GridTexture from 'scripts/objects/GridTexture';

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

    this.camera.position.set( 0, 0, 4700);
    this.camera.lookAt( new THREE.Vector3(0,0,0) );
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
        const scale = 600;
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

          dolphin.position.x = (index - ((this._colorPalette.size - 1) / 2)) * 900;

          this.addToScene(dolphin);
        });
      }
    );

    const terrain = new Terrain(this, this.renderer,
      this._colorPalette.color(4),
      this._colorPalette.color(3),
      this._colorPalette.color(1)
    );
    this.addToScene(terrain);

    this.addToScene( new THREE.AmbientLight(0xffffff) );
  }

  update() {
    this.renderer.setClearColor(this._colorPalette.color(0));
    if (this.scene.fog) {
      this.scene.fog.color = this._colorPalette.color(0);
    }
    super.update();
  }
}

export default Main;
