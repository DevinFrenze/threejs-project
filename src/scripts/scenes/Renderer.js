/*
 * initializes the renderer
 */

export default class Renderer {
  constructor(width, height) {
    this._width = width;
    this._height = height;
    this.initRenderer();
  }

  initRenderer() {
    this._renderer = new THREE.WebGLRenderer({ antialias: false });
    // this._renderer.setPixelRatio( window.devicePixelRatio );
    this._renderer.setSize( this.width, this.height );
    // this._renderer.autoClear = false;
  }

  render(scene, camera, renderTarget, forceClear) {
    this.renderer.render(scene, camera, renderTarget, forceClear);
  }

  get renderer()  { return this._renderer; }
  get width() { return this._width || window.innerWidth; }
  get height() { return this._height || window.innerHeight; }
}
