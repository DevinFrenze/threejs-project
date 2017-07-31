import AbstractApplication from 'scripts/views/AbstractApplication';
import 'utils/GeometryUtils';
import UIColor from 'scripts/ui/ui_color';

import AudioAnalyser from 'scripts/plugins/audioAnalyser';
import Text from 'scripts/objects/text';
import ColorPalette from 'scripts/objects/ColorPalette';
import Terrain from 'scripts/objects/Terrain';
import GridTexture from 'scripts/objects/GridTexture';

import 'shaders/DigitalGlitch';
import 'shaders/DotScreenShader';
import 'shaders/ColorifyShader';
import 'shaders/FXAAShader';
import 'shaders/FilmShader';
import 'shaders/RGBShiftShader';

import 'postprocessing/FilmPass';
import 'postprocessing/GlitchPass';
import 'postprocessing/OutlinePass';

import 'loaders/AssimpJSONLoader';

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
    this.postProcessing();
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

  postProcessing() {
    // also include glitch
    // TODO figure out how to make dynamic

    /*
    // adds horizontal lines to screen, looks rly good with rgbShift
    const film = new THREE.FilmPass(0.35, 0.025, 648, false );
    this.addToRenderChain( film );

    // RGB Shift will look rly good for vapor wave
    const rgbShift = new THREE.ShaderPass( THREE.RGBShiftShader );
    rgbShift.uniforms[ 'amount' ].value = 0.0015;
    this.addToRenderChain( rgbShift );
    */

    /////////////////////////
    //
    // dots casts everything to black and white, not exactly what we want rn
    /*
    const dots = new THREE.ShaderPass( THREE.DotScreenShader );
    dots.uniforms[ 'scale' ].value = 4;
    this.addToRenderChain( dots );
    */

    // colorify casts everything to one color, not useful rn
    /*
    const colorify = new THREE.ShaderPass( THREE.ColorifyShader );
    colorify.uniforms[ 'color' ] = new THREE.Uniform( new THREE.Color( 1, 0.8, 0.8) );
    this.addToRenderChain( colorify );
    */

    const outlinePass = new THREE.OutlinePass( new THREE.Vector2(window.innerWidth, window.innHeight), this.scene, this.camera);
    this.addToRenderChain( outlinePass );

    var loader = new THREE.TextureLoader();

    // load a resource
    loader.load(
      'textures/tri_pattern.jpg', // resource URL
      ( texture ) => {            // Function when resource is loaded
	outlinePass.patternTexture = texture;
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
      }
    );

    const fxaa = new THREE.ShaderPass(THREE.FXAAShader);
    fxaa.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innherHeight );
    this.addToRenderChain( fxaa );
    // also should add on window listeners
  }
}

export default Main;
