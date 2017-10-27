import DevTools from 'scripts/views/DevTools';
import ResponsiveRenderChain from 'scripts/views/ResponsiveRenderChain';

class AbstractApplication extends ResponsiveRenderChain {
  constructor(dev = true){
    super();
    this._animate = this.animate.bind(this);
    this._componentsToUpdate = [];
    if (dev) this.initDevTools();
  }

  initDevTools() {
    DevTools.initStats(this);
    DevTools.initInspector(this);
  }

  animate(timestamp) {
    requestAnimationFrame( this._animate );
    this.update();
    this.composer.render( this.scene, this.camera );
  }

  subscribeToUpdate(component) {
    this._componentsToUpdate.push(component);
  }

  update() {
    this._componentsToUpdate.forEach((component) => component.update());
  }
}
export default AbstractApplication;
