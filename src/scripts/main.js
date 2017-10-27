import AbstractApplication from 'scripts/views/AbstractApplication';
import 'utils/GeometryUtils';
import UIColor from 'scripts/ui/ui_color';
import Controls from 'scripts/controls/mouse_from_center';

class Main extends AbstractApplication {
  constructor(){
    super();

    this.initGui();
    this.initNavigation();
    this.initScene();
    this.animate();
  }

  initGui() {
    const gui = new dat.GUI();
    this._uiColor = new UIColor(gui);
  }
  
  initNavigation() {
    const controls = new Controls(this);
  }

  initScene() {
    this._material = new THREE.MeshBasicMaterial({ wireframe: false });
    const icoGeometry = new THREE.IcosahedronGeometry(100, 0);
    this.addToScene(new THREE.Mesh(icoGeometry, this._material));

    const wireMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: "#000000"
    });
    this.addToScene(new THREE.Mesh(icoGeometry, wireMaterial));
  }

  update() {
    super.update();
    this._material.color = this._uiColor._color;
  }
}

export default Main;
