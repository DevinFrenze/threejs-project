const {
  Quaternion,
  Vector3
} = THREE;

class Controls {
  constructor(abstractApplication, speed = 1) {
    this.scene = abstractApplication.scene;
    this.mouse = {};
    this.mouse.x = this.mouse.y = 0;
    this.onWindowResize();
    this.speed = speed / 100000;

    document.onmousemove = this.handleMouseMove.bind(this);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    abstractApplication.subscribeToUpdate(this);
  }

  handleMouseMove(event) {
    this.mouse.x = event.clientX - this.windowCenterX;
    this.mouse.y = event.clientY - this.windowCenterY;
  };

  onWindowResize() {
    this.windowCenterX = window.innerWidth / 2;
    this.windowCenterY = window.innerHeight / 2;
  };

  update() {
    const { x, y } = this.mouse;

    let rotationAxis = new Vector3(-y, -x, 0);
    const length = rotationAxis.length();
    rotationAxis = rotationAxis.normalize();

    let quaternionDelta = new Quaternion();
    quaternionDelta.setFromAxisAngle(rotationAxis, length * this.speed);

    const quaternionProduct = new Quaternion();
    quaternionProduct.multiplyQuaternions( quaternionDelta, this.scene.quaternion );
    quaternionProduct.normalize();

    this.scene.setRotationFromQuaternion( quaternionProduct );
  }
}

export default Controls;
