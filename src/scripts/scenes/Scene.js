/*
 * initializes the scene
 */

export default class Scene {
  constructor(updateContext) {
    this._scene = new THREE.Scene();
    updateContext.subscribeToUpdate(this);
  }
  update(delta) {}
  addToScene(obj) { this.scene.add(obj); }
  get scene() { return this._scene; }
}
