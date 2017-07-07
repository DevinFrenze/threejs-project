import font from 'droid/droid_sans_regular.typeface.json';
import _ from 'lodash';

class Text {
  constructor(text = "Test Text", parameters) {
    var loader = new THREE.FontLoader();
    this._font = loader.parse(font);
    const size = 64;

    this._textGeo = new THREE.TextGeometry(text, _.merge({
      font: this._font,
      height: 5,
      size,
      curveSegments: 16,
    }, parameters));
  }

  getMesh(material) {
    const textGeo = this._textGeo;
    textGeo.computeBoundingBox();
    const boundingBox = textGeo.boundingBox;

    const textMesh = new THREE.Mesh( textGeo, material );
    const width = boundingBox.max.x - boundingBox.min.x;
    const height = boundingBox.max.y - boundingBox.min.y;

    textMesh.position.x = -0.5 * width;
    textMesh.position.y = -0.5 * height;
    textMesh.rotation.y = Math.PI * 2;

    return textMesh;
  }
}

export default Text;
