export default class FullScreenPlane {
  constructor(updateContext, material) {
    this.updateContext = updateContext;
    updateContext.subscribeToUpdate(this);
    const geometry = new THREE.PlaneGeometry(1, 1);
    console.log(geometry.faceVertexUvs);
    this._plane = new THREE.Mesh( geometry, material );
  }

  get plane() { 
    return this._plane;
  }

  update() {
    this._plane.scale.x = this.updateContext.width; 
    this._plane.scale.y = this.updateContext.height; 
  }
}
