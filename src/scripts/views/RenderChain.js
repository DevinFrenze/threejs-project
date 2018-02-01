/*
 * initializes the renderer and composer
 */

import Scene from 'scripts/views/Scene';
import 'shaders/CopyShader';
import 'postprocessing/EffectComposer';
import 'postprocessing/RenderPass';
import 'postprocessing/MaskPass';
import 'postprocessing/ShaderPass';

export default class RenderChain extends Scene {
  constructor(width, height, renderToScreen = true) {
    super(width, height);
    this.renderToScreen = renderToScreen;
    this.initRenderer();
    this.initRenderChain();
  }

  initRenderer() {
    this._renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this._renderer.setClearColor( 0x000000, 0);
    this._renderer.setPixelRatio( window.devicePixelRatio );
    this._renderer.setSize( this.width, this.height );
    this._renderer.autoClear = false;
    document.body.appendChild( this._renderer.domElement );
  }

  initRenderChain() {
    this._composer = new THREE.EffectComposer( this.renderer );
    const renderPass = new THREE.RenderPass( this.scene, this.camera ); 
    renderPass.renderToScreen = this.renderToScreen;
    this._composer.addPass(renderPass);
  }

  addToRenderChain(pass) {
    this.composer.passes.forEach(function(pass) { pass.renderToScreen = false; });
    pass.renderToScreen = this.renderToScreen;
    this.composer.addPass( pass );
  }

  get composer()  { return this._composer; }
  get renderer()  { return this._renderer; }
}
