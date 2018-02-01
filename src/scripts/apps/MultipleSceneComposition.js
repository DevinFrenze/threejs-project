import AbstractApplication from 'scripts/views/AbstractApplication';

// import MaskScene from 'scripts/scenes/MaskScene';
import MaskCurveScene from 'scripts/scenes/MaskCurveScene';
import MaskDoubleCurveScene from 'scripts/scenes/MaskDoubleCurveScene';
import MaskCircleScene from 'scripts/scenes/MaskCircleScene';
import SmokeScene from 'scripts/scenes/SmokeScene';
import SphereScene from 'scripts/scenes/SphereScene';
import RingScene from 'scripts/scenes/RingScene';
import RadialArrayScene from 'scripts/scenes/RadialArrayScene';

import 'postprocessing/ClearPass';
import 'postprocessing/ShaderPass';

export default class MultipleSceneComposition extends AbstractApplication {
  constructor(dev = true, width, height){
    super(dev, width, height, true);

    this.renderer.setClearColor( 0x000000, 0);
    this.initScene();
    this.animate();
  }

  update() {
    this.scenes.forEach( (scene) => {
      this.renderer.clearTarget(scene.renderTarget);
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
      new SphereScene(this),
      new SmokeScene(this),
      new RingScene(this),
      new RadialArrayScene(this),
    ];

    const clearPass = new THREE.ClearPass();
    this.composer.addPass( clearPass );

    this.masks = [
      new MaskCurveScene(this, this.scenes[0], 220),
      new MaskCurveScene(this, this.scenes[1], 500),
      new MaskCurveScene(this, this.scenes[1], 500),
      new MaskCurveScene(this, this.scenes[0], 220),
      new MaskCircleScene(this, this.scenes[2], 800),
      new MaskDoubleCurveScene(this, this.scenes[3], 800),
    ];

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
