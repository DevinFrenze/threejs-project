/*
 * initializes the scene and camera
 */

export default class Scene {
  constructor(width, height) {
    this._width = width;
    this._height = height;
    this._scene = new THREE.Scene();
    this.initCamera();
  }

  get width() {
    return this._width || window.innerWidth;
  }

  get height() {
    return this._height || window.innerHeight;
  }

  initCamera() {
    this._camera = new THREE.PerspectiveCamera(
        70,                       // vertial field of view
        this.width / this.height, // aspect ratio
        1,                        // near plane
        10000                     // far plane
    );
    this._camera.position.set( 0, 0, this.calculateCameraOffset());
    this._camera.lookAt( new THREE.Vector3(0,0,0) );
    this.addToScene(this._camera);
  }

  calculateCameraOffset() {
    const angle = 90 - (this.camera.fov / 2);
    const z = 0.5 * this.height * Math.tan(Math.PI * angle / 180);
    return z;
  }

  addToScene(obj) {
    this.scene.add(obj);
  }

  get camera()    { return this._camera; }
  get scene()     { return this._scene; }
}
