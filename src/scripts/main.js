import AbstractApplication from 'scripts/views/AbstractApplication';
import 'utils/GeometryUtils';
import UIColor from 'scripts/ui/ui_color';

import AudioAnalyser from 'scripts/plugins/audioAnalyser';
import Text from 'scripts/objects/text';
import ColorPalette from 'scripts/objects/ColorPalette';
import Terrain from 'scripts/objects/Terrain';
import ObjectBank from 'scripts/objects/ObjectBank';

import 'shaders/DigitalGlitch';
import 'shaders/FXAAShader';
import 'shaders/FilmShader';
import 'shaders/RGBShiftShader';

import 'postprocessing/FilmPass';
import 'scripts/postprocessing/CustomGlitchPass';

const {
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  ObjectLoader,
} = THREE;

class Main extends AbstractApplication {
  constructor(dev = true){
    super(dev);

    this.camera.position.set( 0, 0, 4700);
    this.camera.lookAt( new THREE.Vector3(0,0,0) );
    this.initGui();
    this.initScene();
    this.postProcessing();
    this.animate(); // always call this.animate at the end of constructor
  }

  initGui() {
    const gui = new dat.GUI();
    this.uiColor1 = new UIColor(gui, "color1");
    this.colorPalette = new ColorPalette(this.uiColor1.color);
    this.uiButton1 = gui.add(this, 'generateColorPalette');
  }

  generateColorPalette() {
    this.colorPalette.generate(this.uiColor1.color);
  }

  initScene() {
    const materials = new Array(this.colorPalette.size).fill(0).map(
      (val, index) => {
        const meshMaterial = new MeshBasicMaterial({ side: THREE.DoubleSide });
        meshMaterial.color = this.colorPalette.color(index);
        return meshMaterial;
      }
    );

    this.objectBanks = new ObjectBank(this, this.scene);

    const terrain = new Terrain(this, this.renderer,
      this.colorPalette.color(4),
      this.colorPalette.color(3),
      this.colorPalette.color(1)
    );
    this.addToScene(terrain);

    this.addToScene( new THREE.AmbientLight(0xffffff) );
    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(1000, 1000, 4500);
    this.addToScene( pointLight );
  }

  update() {
    this.renderer.setClearColor(this.colorPalette.color(0));
    this.scene.fog.color = this.colorPalette.color(0);
    super.update();
  }

  postProcessing() {
    // TODO figure out how to make dynamic
    const glitchPass = new THREE.GlitchPass();
    this.addToRenderChain( glitchPass );

    // adds horizontal lines to screen, looks rly good with rgbShift
    const film = new THREE.FilmPass(0.35, 0.025, 648, false );
    this.addToRenderChain( film );

    // RGB Shift will look rly good for vapor wave
    const rgbShift = new THREE.ShaderPass( THREE.RGBShiftShader );
    rgbShift.uniforms[ 'amount' ].value = 0.0015;
    this.addToRenderChain( rgbShift );
  }
}

export default Main;
