import AbstractApplication from 'scripts/views/AbstractApplication';
import CurveScene from 'scripts/scenes/CurveScene';
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

    this.scenes.forEach( (scene) => {
      this.renderer.render(
        scene.scene,
        scene.camera,
        scene.renderTarget,
        true
      );
    });

    super.update();
  }

  initBuffer() {
    this.scenes = [ new CurveScene(this), new CubeScene(this), new ConeScene(this) ];
    this.currentScene = this.scenes[0];
  }

  initScene() {
    this.material = new THREE.MeshBasicMaterial(
      { map: this.currentScene.renderTarget.texture }
    );
    this.plane = (new FullScreenPlane(this, this.material)).plane;
    this.addToScene(this.plane);
  }

  switchScenes() {
    const index = this.scenes.indexOf(this.currentScene);
    this.currentScene = this.scenes[(index + 1) % this.scenes.length];
    this.material.map = this.currentScene.renderTarget.texture;
    this.material.needsUpdate = true;
  }

  onKeyUp(e) {
    if (e.key === ' ') this.switchScenes();
  }
}
