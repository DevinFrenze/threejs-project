import Scene from 'scripts/scenes/Scene';
import 'postprocessing/MaskPass';
import 'postprocessing/TexturePass';

export default class MaskScene extends Scene {
  constructor(updateContext, maskedScene) {
    super(updateContext);

    const maskPass = new THREE.MaskPass( this.scene, this.camera );
    updateContext.composer.addPass( maskPass );

    const texture = maskedScene.renderTarget.texture;
    const texturePass = new THREE.TexturePass( texture, 0.999 );
    updateContext.composer.addPass( texturePass );

    const clearMaskPass = new THREE.ClearMaskPass();
    updateContext.composer.addPass( clearMaskPass );
  }
}
