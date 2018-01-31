import AbstractApplication from 'scripts/views/AbstractApplication';

import FullScreenPlane from 'scripts/objects/FullScreenPlane';

import MaskScene from 'scripts/scenes/MaskScene';
import CurveScene from 'scripts/scenes/CurveScene';
import CubeScene from 'scripts/scenes/CubeScene';
import ConeScene from 'scripts/scenes/ConeScene';

import 'postprocessing/ClearPass';
import 'postprocessing/TexturePass';
import 'postprocessing/ShaderPass';
import 'postprocessing/MaskPass';

export default class MultipleSceneComposition extends AbstractApplication {
  constructor(dev = true, width, height){
    super(dev, width, height, true);

    this.renderer.setClearColor( 0xdddddd );
    this.initScene();
    this.animate();
  }

  update() {
    this.scenes.forEach( (scene) => {
      this.renderer.render(
        scene.scene,
        scene.camera,
        scene.renderTarget,
        true
      );
    });

    super.update();
  }

  initScene() {
    this.scenes = [
      new CurveScene(this),
      new CubeScene(this),
      new ConeScene(this),
      new CurveScene(this),
      new CubeScene(this),
      new ConeScene(this)
    ];

    const clearPass = new THREE.ClearPass();
    this.composer.addPass( clearPass );

    this.masks = this.scenes.map((scene, i) => new MaskScene(this, scene, i));

    const outputPass = new THREE.ShaderPass( THREE.CopyShader );
    outputPass.renderToScreen = true;
    this.composer.addPass( outputPass );
  }


  initRenderChain() {
    this.renderTarget = new THREE.WebGLRenderTarget( this.width, this.height );
    this._composer = new THREE.EffectComposer( this.renderer, this.renderTarget );
  }

  onWindowResize() {
    super.onWindowResize();
    this.renderTarget.setSize( this.width, this.height );
  }
}
