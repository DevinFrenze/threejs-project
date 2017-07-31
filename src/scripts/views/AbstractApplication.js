import 'shaders/CopyShader';
import 'postprocessing/EffectComposer';
import 'postprocessing/RenderPass';
import 'postprocessing/MaskPass';
import 'postprocessing/ShaderPass';

class AbstractApplication{
  /* manages and initializes scene, camera, renderer, and render chain (composer) */

  constructor(dev = true){
    this._scene = new THREE.Scene();
    this._scene.fog = new THREE.Fog(0xffffff, 7700, 8700);

    window.scene = this._scene;
    window.THREE = THREE;

    this._camera = new THREE.PerspectiveCamera(
        70,                                     // vertial field of view
        window.innerWidth / window.innerHeight, // aspect ratio
        1,                                      // near plane
        10000                                   // far plane
    );
    this._camera.position.set( 0, 0, 400);

    this._updateComponents = [];

    this.initStats();
    this.initRenderer();
    this.initRenderChain();
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
  }

  initStats() {
    const stats = new Stats();
    document.body.appendChild( stats.dom );
    this.subscribeToUpdate(stats);
  }
  
  initRenderer() {
    // TODO figure out if we need antialias true here, or if we'll just do a shader pass
    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setPixelRatio( window.devicePixelRatio );
    this._renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this._renderer.domElement );
  }

  initRenderChain() {
    this._composer = new THREE.EffectComposer( this.renderer );
    const renderPass = new THREE.RenderPass( this.scene, this.camera ); 
    renderPass.renderToScreen = true;
    this._composer.addPass(renderPass);
  }

  addToRenderChain(pass) {
    this.composer.passes.forEach(function(pass) { pass.renderToScreen = false; });
    pass.renderToScreen = true;
    this.composer.addPass( pass );
  }

  addToScene(obj) {
    this.scene.add(obj);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.composer.setSize( window.innerWidth, window.innerHeight );
  }

  animate(timestamp) {
    requestAnimationFrame( this.animate.bind(this) );
    this.update();
    this.composer.render( this.scene, this.camera );
  }

  subscribeToUpdate(component) {
    this._updateComponents.push(component);
  }

  update() {
    this._updateComponents.forEach((component) => component.update());
  }

  get camera()    { return this._camera; }
  get composer()  { return this._composer; }
  get renderer()  { return this._renderer; }
  get scene()     { return this._scene; }

}
export default AbstractApplication;
