import AbstractApplication from 'scripts/views/AbstractApplication';
import 'utils/GeometryUtils';
import UIColor from 'scripts/ui/ui_color';

import AudioAnalyser from 'scripts/plugins/audioAnalyser';
import Text from 'scripts/objects/text';
import ColorPalette from 'scripts/objects/ColorPalette';
import Terrain from 'scripts/objects/Terrain';

import 'shaders/DigitalGlitch';
import 'shaders/FXAAShader';
import 'shaders/FilmShader';
import 'shaders/RGBShiftShader';
import 'shaders/ConvolutionShader.js';
import 'postprocessing/BloomPass.js';
import 'postprocessing/FilmPass';

const { MeshBasicMaterial } = THREE;

const FILM_NOISE_MAX = 0.7;
const FILM_SCANLINE_MAX = 0.5;
const RGB_SHIFT_MAX = 0.004;

class PolyChain extends AbstractApplication {

  constructor(width, height, dev = false){
    super(width, height, dev);
    this.camera.position.set( 0, 200, 5550);
    this.camera.lookAt( new THREE.Vector3(0,0,0) );
    this.initGui();
    this.initScene();
    this.postProcessing();
    this.animate(); // always call this.animate at the end of constructor
  }

  initGui() {
    this.colorPalette = new ColorPalette(this, new THREE.Color(0,1,1), 10000);
  }

  initScene() {
    const materials = new Array(this.colorPalette.size).fill(0).map(
      (val, index) => {
        const meshMaterial = new MeshBasicMaterial({ side: THREE.DoubleSide });
        meshMaterial.color = this.colorPalette.color(index);
        return meshMaterial;
      }
    );

    const terrain = new Terrain(this, this.renderer,
      this.colorPalette.color(4),
      this.colorPalette.color(3),
      this.colorPalette.color(1)
    );
    this.addToScene(terrain);

    this.addToScene( new THREE.AmbientLight(0xffffff) );
    this.scene.fog = new THREE.Fog(0xffffff, 7700, 8700);
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
    const bloomPass = new THREE.BloomPass(1.5);
    this.addToRenderChain(bloomPass);

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

export default PolyChain;
