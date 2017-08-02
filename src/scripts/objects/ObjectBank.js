const TRANSITION_TIME = 50;
const MIN_DISPLAY_TIME = 1000;
const MAX_DISPLAY_TIME = 6000;

class ObjectBank {

  constructor(updateContext, scene) {
    this.root = new THREE.Object3D();
    this.root.position.set(0, 100, 1800);
    this.modelNum = 0;
    this.setCounters();
    this.rotateX = 0;
    this.rotateY = 1;
    this.rotateSpeed = 0.003;

    scene.add(this.root);
    updateContext.subscribeToUpdate(this);

    const objectLoader = new THREE.ObjectLoader();

    const models = [
      { path: "/models/eagle.json",     scale: 3000,  translate: 400 },
      // { path: "/models/dolphin.json",   scale: 1500,  translate: 0 },
      { path: "/models/statue.json",    scale: 15,    translate: -400 },
      { path: "/models/tree.json",      scale: 70,    translate: -200 },
      { path: "/models/dinosaur.json",  scale: 1500,  translate: -200 }
    ];

    this.objects = [];

    models.forEach((model) => {
      objectLoader.load(model.path,
        (object) => {
          const scale = model.scale;
          object.scale.set(scale, scale, scale);
          object.translateY(model.translate);
          this.objects.push(object);
          if (this.objects.length == models.length) {
            console.log("Finished Loading 3D Models");
            this.finishedLoading = true;
            this.root.add(this.objects[this.modelNum]);
          }
        }
      );
    });
  }

  setCounters() {
    this.displayCounter = (Math.random() * (MAX_DISPLAY_TIME - MIN_DISPLAY_TIME)) + MIN_DISPLAY_TIME;
    this.scaleCounter = TRANSITION_TIME;
  }

  setModel() {
    this.rotateX = Math.random();
    this.rotateY = Math.random();
    this.modelNum = (this.modelNum + 1) % this.objects.length;
    this.root.remove(this.root.children[0]);
    this.root.add(this.objects[this.modelNum]);
  }

  rotate() {
    let rotationAxis = new THREE.Vector3(this.rotateX, this.rotateY, 0);
    rotationAxis = rotationAxis.normalize();

    let quaternionDelta = new THREE.Quaternion();
    quaternionDelta.setFromAxisAngle(rotationAxis, this.rotateSpeed);

    const quaternionProduct = new THREE.Quaternion();
    quaternionProduct.multiplyQuaternions( quaternionDelta, this.root.quaternion );
    quaternionProduct.normalize();

    this.root.setRotationFromQuaternion( quaternionProduct );
  }

  update() {
    if (this.finishedLoading) {
      this.rotate();
      if (this.displayCounter > 0) {
        this.displayCounter--;
      } else if (this.scaleCounter == 0) {
        this.setModel();
        this.scaleCounter--;
      } else if (this.scaleCounter > -TRANSITION_TIME) {
        this.scaleCounter--;
        const scale = Math.max(0.001, Math.abs(this.scaleCounter / TRANSITION_TIME));
        this.root.scale.set(scale, scale, scale);
      } else {
        this.setCounters();
      }
    }
  }
}

export default ObjectBank;
