export default class Scene {
  constructor() {
    this._scene = new THREE.Scene();
    this.initCamera();
  }

  initCamera() {
    this._camera = new THREE.PerspectiveCamera(
        70,                                     // vertial field of view
        window.innerWidth / window.innerHeight, // aspect ratio
        1,                                      // near plane
        10000                                   // far plane
    );
    this._camera.position.set( 0, 0, 400);
  }

  addToScene(obj) {
    this.scene.add(obj);
  }

  get camera()    { return this._camera; }
  get scene()     { return this._scene; }
}
