import AbstractApplication from 'scripts/views/AbstractApplication';
import 'utils/GeometryUtils';
import DataMesh from 'scripts/objects/DataMesh';
import ObjectBelt from 'scripts/controls/ObjectBelt';
import ColorPalette from 'scripts/objects/ColorPalette';

import 'loaders/BinaryLoader';
import 'shaders/ConvolutionShader.js';
import 'shaders/FilmShader.js';
import 'shaders/FocusShader.js';
import 'postprocessing/BloomPass.js';
import 'postprocessing/FilmPass.js';

const { Vector3 } = THREE;

class Main extends AbstractApplication {
  constructor(){ super();
    this.initScene();
    this.postProcessing();
    this.animate();
  }

  initScene() {
    this.colorPalette = new ColorPalette(this, new THREE.Color(0,1,1));

    this.meshes = [];
    this.scene.background = new THREE.Color( 0x000104 );
    // this.scene.fog = new THREE.FogExp2( 0x000104, 0.0000675 );

    this.camera.position.set( 0, 700, 7000);
    this.camera.lookAt( this.scene.position );

    this.objectBelt = new ObjectBelt(this);
    this._generateObject = this.generateObject.bind(this);
    this.generateObject();
  }

  generateObject() {
    const object = Math.floor(Math.random() * 4);
    const loader = new THREE.BinaryLoader();

    switch (object) {
      case 0:
        loader.load( "models/VeyronNoUv_bin.js", ( geometry ) => {
          this.createDataMesh( geometry, 6.8, new Vector3(2200, -200, -100));
        });
        break;
      case 1:
        loader.load( "models/Female02_bin.js", ( geometry ) => {
          this.createDataMesh( geometry, 4.05, new Vector3(250, -350, 2500));
        });
        break;
      case 2:
        loader.load( "models/Male02_bin.js", ( geometry ) => {
          this.createDataMesh( geometry, 4.05, new Vector3(-250, -350, -1500));
        });
        break;
      case 3:
        this.createPlane();
        break;
      default: console.log('this should never happen');
    }

    setTimeout(this._generateObject, 1000 + (Math.random() * 2000));
  }

  postProcessing() {
    /*
    const bloomPass = new THREE.BloomPass();
    this.addToRenderChain(bloomPass);

    const filmPass = new THREE.FilmPass( 0.5, 0.5, 1448, false );
    this.addToRenderChain(filmPass);

    const focus = new THREE.ShaderPass( THREE.FocusShader );
    focus.uniforms[ "screenWidth" ].value = window.innerWidth;
    focus.uniforms[ "screenHeight" ].value = window.innerHeight;
    this.addToRenderChain(focus);
    */
  }

  randomColor() {
    return this.colorPalette.color(Math.floor(Math.random() * 5));
  }

  randomXOffset() {
    return (Math.random() - 0.5) * 5000;
  }

  randomYOffset() {
    return (Math.random() - 0.5) * 2000;
  }

  createDataMesh( originalGeometry, scale) {
    const dataMesh = new DataMesh(this, originalGeometry, scale, this.randomColor());
    this.objectBelt.add(
      dataMesh.mesh,
      this.randomXOffset(),
      this.randomYOffset()
    );
    this.meshes.push(dataMesh);
  }

  createPlane() {
    const color = this.randomColor();
    const scale = Math.random() * 2000;
    const divisions = Math.floor(Math.random() * 5);
    const gridHelper = new THREE.GridHelper( scale, divisions, color, color );
    gridHelper.rotateY(Math.random() * Math.PI);
    gridHelper.rotateZ(Math.random() * Math.PI);
    this.objectBelt.add(gridHelper, this.randomXOffset(), this.randomYOffset());
  }
}

export default Main;
