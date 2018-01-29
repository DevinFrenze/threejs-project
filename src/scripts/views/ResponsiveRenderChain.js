/*
 * resizes the renderer, composer, and camera when window size changes
 */

import RenderChain from 'scripts/views/RenderChain';

export default class ResponsiveRenderChain extends RenderChain {
  constructor(width, height, renderToScreen = true) {
    super(width, height, renderToScreen);
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
  }

  onWindowResize() {
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.camera.position.set( 0, 0, this.calculateCameraOffset());

    this.renderer.setSize( this.width, this.height );
    this.composer.setSize( this.width, this.height );
  }
}
