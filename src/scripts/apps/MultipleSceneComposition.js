import AbstractApplication from 'scripts/views/AbstractApplication';
import CubeScene from 'scripts/scenes/CubeScene';
import ConeScene from 'scripts/scenes/ConeScene';
import Renderer from 'scripts/scenes/Renderer';
import FullScreenPlane from 'scripts/objects/FullScreenPlane';

export default class MultipleSceneComposition extends AbstractApplication {
  constructor(dev = true, width, height){
    super(dev, width, height, true);

    this.initBuffer();
    this.initScene();
    this.animate();
    window.addEventListener( 'keyup', this.onKeyUp.bind(this), false);
  }

  update() {
    this.renderer.render(
      this.cubeScene.scene,
      this.subCamera,
      this.cubeSceneTarget
    );

    this.renderer.render(
      this.coneScene.scene,
      this.subCamera,
      this.coneSceneTarget
    );

    super.update();
  }

  initBuffer() {
    this.subCamera = new THREE.Camera( 70, this.width / this.height, 1, 1000);

    this.cubeScene = new CubeScene(this);
    this.cubeSceneTarget = new THREE.WebGLRenderTarget(
      this.width,
      this.height
    );

    this.coneScene = new ConeScene(this);
    this.coneSceneTarget = new THREE.WebGLRenderTarget(
      this.width,
      this.height
    );

    this.targets = [this.cubeSceneTarget, this.coneSceneTarget];
    this.currentTarget = this.targets[0];
  }

  initScene() {
    this.material = new THREE.MeshBasicMaterial(
      { map: this.coneSceneTarget.texture }
    );
    this.plane = (new FullScreenPlane(this, this.material)).plane;
    this.addToScene(this.plane);
  }

  switchScenes() {
    const index = this.targets.indexOf(this.currentTarget);
    this.currentTarget = this.targets[(index + 1) % this.targets.length];
    this.material.map = this.currentTarget.texture;
    this.material.needsUpdate = true;
  }

  onKeyUp(e) {
    if (e.key === ' ') {
      console.log('spacebar');
      this.switchScenes();
    }
  }
}
