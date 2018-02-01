import Scene from 'scripts/scenes/Scene';

export default class RingScene extends Scene {
  constructor(updateContext) {
    super(updateContext);
    this.parentObject = new THREE.Object3D();
    this.material = new THREE.MeshBasicMaterial({ color: 0x000000 });

    this.changeRingRotations = this._changeRingRotations.bind(this);
    this.movingRings = [];

    this.addPartialCircles();
    this.addThinLines();
    this.addBigPieces();
    this.addThinCircles();
    this.addBlackHexagon();
    this.addWhiteHexagon();

    this.movingRingVelocities = new Array(this.movingRings.length).fill(0);
    setInterval(this.changeRingRotations, 2000);

    this.addToScene(this.parentObject);
  }

  addBlackHexagon() {
    const geo = new THREE.CircleBufferGeometry(24, 6);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const circle = new THREE.Mesh(geo, mat);
    this.parentObject.add(circle);
  }

  addWhiteHexagon() {
    const geo = new THREE.CircleBufferGeometry(20, 6);
    const mat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const circle = new THREE.Mesh(geo, mat);
    this.parentObject.add(circle);
  }

  addPartialCircles() {
    const rings = 4;
    const height = 20;
    const innermostRadius = 280;
    const gap = 10;

    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < rings; i ++) {
      const innerRadius = innermostRadius + ((height + gap) * i);
      const offset = Math.random() * 2 * Math.PI;
      const length = 0.66 * Math.PI;

      const geometry = new THREE.RingBufferGeometry(
        innerRadius, innerRadius + height,
        100, 1,
        offset, length
      );
      const ring = new THREE.Mesh(geometry, this.material);

      const g = new THREE.RingBufferGeometry(
        innerRadius, innerRadius + height,
        50, 1,
        Math.random() * 2 * Math.PI, length / 2
      );
      const ringHolder = new THREE.Mesh(g, this.material);
      this.parentObject.add(ringHolder);

      this.movingRings.push(ring);
      this.parentObject.add(ring);
    }
  }

  addThinLines() {
    const pieces = 60;
    const size = 2 * Math.PI / (32 * pieces);
    const ring = new THREE.Object3D();
    for (let i = 0; i < 60; i++) {
      const geometry = new THREE.RingBufferGeometry(
          710, 800,
          3, 1,
          2 * Math.PI * i / pieces, size
      );
      const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
      const line = new THREE.Mesh(geometry, material);
      ring.add(line);
    }
    this.movingRings.push(ring);
    this.parentObject.add(ring);
  }

  addBigPieces() {
    for (let j = 0; j < 3; j ++) {
      const geometry = new THREE.RingBufferGeometry(
          635, 655,
          30, 1,
          2 * j * Math.PI / 3, Math.PI / 6);
      const ring = new THREE.Mesh(geometry, this.material);
      this.parentObject.add(ring);
    }
  }

  addThinCircles() {
    const segments = 200;
    const dashedLine = new THREE.Object3D();
    for(let i = 0; i < segments; i++) {
      const theta = Math.PI * 2 * i / segments;
      const size = Math.PI / segments;
      const radius1 = 470;
      const width1 = 3;
      const geometry1 = new THREE.RingBufferGeometry(radius1, radius1 + width1, 100, 1, theta, size);
      const segment = new THREE.Mesh(geometry1, this.material);
      dashedLine.add(segment);
    }
    this.movingRings.push(dashedLine);
    this.parentObject.add(dashedLine);

    const radius2 = 500;
    const width2 = 3;
    const geometry2 = new THREE.RingBufferGeometry(radius2, radius2 + width2, 100, 1);
    const ring2 = new THREE.Mesh(geometry2, this.material);
    this.parentObject.add(ring2);
  }

  _changeRingRotations() {
    const rings = this.movingRingVelocities.length;
    const index = Math.floor(Math.random() * rings);
    this.movingRingVelocities[index] = Math.random() - 0.5;
  }

  update(delta) {
    // TODO set individual rotations on rings
    this.parentObject.rotateZ(delta * -0.075);
    this.movingRings.forEach((ring, i) => {
      ring.rotateZ(delta * this.movingRingVelocities[i]);
    });
  }
}
