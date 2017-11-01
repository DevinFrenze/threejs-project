export default class ObjectBelt extends THREE.Object3D {
  constructor(abstractApplication, lenght, speed = 5, rotationSpeed = 0) {
    super();
    this.length = -7000;
    this.speed = speed;
    this.rotationSpeed = rotationSpeed;

    this._updateChild = this.updateChild.bind(this);
    this.abstractApplication = abstractApplication;
    this.abstractApplication.addToScene(this);
    this.abstractApplication.subscribeToUpdate(this);
  }

  add(child, positionX, positionY) {
    super.add(child);
    child.position.set(positionX, positionY, this.length);
    child.deletionStatus = 0; // assumes that the child is visible initially
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
    const position = child.position.add( new THREE.Vector3(0, 0, this.speed) );
    child.rotateZ(this.rotationSpeed);
    const boundingBox = new THREE.Box3().setFromObject(child);
    const frustumIntersectsChild = this.frustum.intersectsBox(boundingBox);

    if (child.deletionStatus == 0 && frustumIntersectsChild) {
      child.deletionStatus = 1;
    } else if (child.deletionStatus == 1 && !frustumIntersectsChild) {
      // position.z = position.z + this.length;
      child.remove();
      child.material.dispose();
      child.geometry.dispose();
      // child.texture.dispose();
    }

    child.position.set(position.x, position.y, position.z);
  }
}
