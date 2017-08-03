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

const FILM_NOISE_MAX = 0.7;
const FILM_SCANLINE_MAX = 0.5;
const RGB_SHIFT_MAX = 0.004;

class Main extends AbstractApplication {
  constructor(dev = false){
    super(dev);

    this.camera.position.set( 0, 200, 5550);
    this.camera.lookAt( new THREE.Vector3(0,0,0) );
    this.initGui();
    this.initScene();
    this.postProcessing();
    this.animate(); // always call this.animate at the end of constructor
  }

  initGui() {
    // const gui = new dat.GUI();
    // this.uiColor1 = new UIColor(gui, "color1");
    this.colorPalette = new ColorPalette(this, new THREE.Color(0,1,1));
    // this.uiButton1 = gui.add(this, 'generateColorPalette');
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

    const now = Date.now();

    this.filmPass.uniforms.nIntensity.value = Math.abs(Math.sin(now / 13000) * FILM_NOISE_MAX);
    this.filmPass.uniforms.sIntensity.value = Math.abs(Math.sin(now / 17000) * FILM_SCANLINE_MAX);
    this.rgbShift.uniforms['amount'].value = Math.sin(now / 19000) * RGB_SHIFT_MAX;

    super.update();
  }

  postProcessing() {
    // TODO figure out how to make dynamic
    const glitchPass = new THREE.GlitchPass();
    this.addToRenderChain( glitchPass );

    // adds horizontal lines to screen, looks rly good with rgbShift
    // scan lines max 0.5
    // noise max is 0.7, 
    this.filmPass = new THREE.FilmPass(0.35, 0.025, 648, false );
    this.addToRenderChain( this.filmPass );

    // MAXIMUM is 0.003
    // RGB Shift will look rly good for vapor wave
    this.rgbShift = new THREE.ShaderPass( THREE.RGBShiftShader );
    this.rgbShift.uniforms[ 'amount' ].value = 0.0015;
    this.addToRenderChain( this.rgbShift );
  }
}

export default Main;
