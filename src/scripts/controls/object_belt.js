export default class ObjectBelt extends THREE.Object3D {
  constructor(abstractApplication) {
    super();
    this.length = -1000;

    this._updateChild = this.updateChild.bind(this);
    this.abstractApplication = abstractApplication;
    this.abstractApplication.addToScene(this);
    this.abstractApplication.subscribeToUpdate(this);
  }

  add(child) {
    super.add(child);
    child.position.set(0, 0, this.length);
  }

  update() {
    const { camera } = this.abstractApplication;
    this.frustum = new THREE.Frustum();
    this.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    ));

    this.children.map(this._updateChild);
  }

  updateChild(child) {
    const position = child.position.add( new THREE.Vector3(0, 0, 1) );
    child.position.set(position.x, position.y, position.z);

    const boundingBox = new THREE.Box3().setFromObject(child);
    if (!this.frustum.containsPoint(boundingBox.min) && 
        !this.frustum.containsPoint(boundingBox.max)) {
      this.remove(child);
    }
  }
}
