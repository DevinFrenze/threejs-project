/*
 * initializes the scene
 */

export default class Scene {
  constructor(updateContext) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this._scene = new THREE.Scene();
    this.initCamera();
    this.initRenderTarget();
    updateContext.subscribeToUpdate(this);
  }

  initCamera() {
    this._camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      1,
      1000
    );
    this._camera.position.set( 0, 0, this.calculateCameraOffset());
    this._camera.lookAt( new THREE.Vector3(0, 0, 0) );
    this.scene.add(this.camera);
  }

  initRenderTarget() {
    this._renderTarget = new THREE.WebGLRenderTarget(
      this.width,
      this.height,
      { format:  THREE.RGBAFormat }
    );
  }

  update(delta) {}

  calculateCameraOffset() {
    const angle = 90 - (this.camera.fov / 2);
    const z = 0.5 * this.height * Math.tan(Math.PI * angle / 180);
    return z;
  }

  addToScene(obj) { this.scene.add(obj); }
  get scene() { return this._scene; }
  get camera() { return this._camera; }
  get renderTarget() { return this._renderTarget; }
}
