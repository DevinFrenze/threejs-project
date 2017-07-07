import 'controls/OrbitControls';

class Controls {
  constructor(camera, domElement, options = { enableDamping: true, dampingFactor: 0.25, enableZoom: false }) {
    this._controls = new THREE.OrbitControls(camera, domElement);

    const keys = Object.keys(options);
    for (let i = 0; i < keys.length; i++) {
      this._controls[keys[i]] = options[keys[i]];
    }
  }

  update() {
    this._controls.update();
  }
}

export default Controls;
