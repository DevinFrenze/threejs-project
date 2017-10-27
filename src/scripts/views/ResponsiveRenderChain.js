import RenderChain from 'scripts/views/RenderChain';

export default class ResponsiveRenderChain extends RenderChain {
  constructor() {
    super();
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.composer.setSize( window.innerWidth, window.innerHeight );
  }
}
