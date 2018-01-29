/*
 * initializes the scene
 */

export default class Scene {
  constructor() { this._scene = new THREE.Scene(); }
  addToScene(obj) { this.scene.add(obj); }
  get scene() { return this._scene; }
}
