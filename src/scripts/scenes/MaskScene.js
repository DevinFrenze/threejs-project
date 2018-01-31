import Scene from 'scripts/scenes/Scene';

export default class CurveScene extends Scene {
  constructor(updateContext, scene, i) {
    super(updateContext);

    const thetaLength = 0.33 * Math.PI;
    const thetaStart = i * thetaLength;

    const geometry = new THREE.CircleGeometry( 300, 100, thetaStart, thetaLength );
    this.curve = new THREE.Mesh(geometry);
    this.scene.add(this.curve);

    const maskPass = new THREE.MaskPass( this.scene, this.camera );
    updateContext.composer.addPass( maskPass );

    const texture = scene.renderTarget.texture;
    const texturePass = new THREE.TexturePass( texture );
    updateContext.composer.addPass( texturePass );

    const clearMaskPass = new THREE.ClearMaskPass();
    updateContext.composer.addPass( clearMaskPass );
  }

  update(delta, elapsedTime) {
    this.curve.rotation.z += delta * 0.5;
    // const theta = this.thetaLength + (0.5 * Math.cos(elapsedTime));
    // const geometry = new THREE.CircleGeometry( this.radius, 100, 0, theta );
    // this.curve.geometry = geometry;
  }
}
