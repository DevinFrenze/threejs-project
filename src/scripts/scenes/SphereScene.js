import Scene from 'scripts/scenes/Scene';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import 'ParametricGeometries';

export default class SphereScene extends Scene {
  constructor(updateContext) {
    super(updateContext);

    const totalSlices = 60;
    const sliceSize = 2 * Math.PI / totalSlices;
    const rows = 16;
    const radius = 450;

    const geometry = new THREE.CircleGeometry( radius, totalSlices);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const circle = new THREE.Mesh(geometry, material);
    this.addToScene(circle);
    this.parentObject = new THREE.Object3D();

    this.pieceMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(0x000000) });
    for (let i = 0; i < totalSlices; i++) {
      for (let j = rows; j > 4; j--) {
        this.createCirclePiece(
          radius * (j - 1) / rows,
          radius * j / rows,
          i * sliceSize,
          sliceSize,
          sliceSize / (4 + (j * 10 / rows))
        );
      }
    }

    for (let i = 0; i < totalSlices / 2; i++) {
      for (let j = 4; j >= 0; j--) {
        this.createCirclePiece(
          radius * (j - 1) / rows,
          radius * j / rows,
          i * (sliceSize * 2),
          sliceSize * 2,
          sliceSize / (2 + (j * 10 / rows))
        );
      }
    }

    this.addToScene(this.parentObject);
  }

  createCirclePiece(innerRadius, outerRadius, thetaStart, thetaLength, gap) {
    const gapSize = gap * outerRadius;
    const geometry = new THREE.RingGeometry(
      innerRadius, outerRadius - gapSize,
      1, 3,
      thetaStart, thetaLength - gap
    );
    const circlePiece = new THREE.Mesh(geometry, this.pieceMaterial);
    this.parentObject.add(circlePiece);
  }

  update(delta) {
    this.parentObject.rotateZ( delta * -0.25 );
  }
}
