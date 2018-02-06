import AbstractApplication from 'scripts/views/AbstractApplication';

export default class LoadModel extends AbstractApplication {
  constructor(dev = true, width, height, renderToScreen = true) {
    super(dev, width, height, renderToScreen);

    this.bindFunctions();
    this.initScene();
    this.animate(); // always call this.animate at the end of constructor
  }

  bindFunctions() {
    this.onLoad = this._onLoad.bind(this);
    this.onProgress = this._onProgress.bind(this);
    this.onError = this._onError.bind(this);
  }

  initScene() {
    const light = new THREE.DirectionalLight(0xffffff,0.5);
    light.position.set(-100,0,100);
    this.scene.add(light);

    const loader = new THREE.JSONLoader();
    loader.load(
      '/models/monkey.json',
      this.onLoad,
      this.onProgress,
      this.onError
    );
  }

  _onLoad(geometry, materials) {
    const material = new THREE.MeshLambertMaterial();
    const object = new THREE.Mesh(geometry, material);
    this.scene.add(object);
  }

  _onProgress(xhr) {
    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
  }

  _onError(err) {
    console.error(err);
  }
}
