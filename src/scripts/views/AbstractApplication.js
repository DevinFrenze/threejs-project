import DevTools from 'scripts/views/DevTools';
import ResponsiveRenderChain from 'scripts/views/ResponsiveRenderChain';

class AbstractApplication extends ResponsiveRenderChain {
  constructor(dev = true, width, height, renderToScreen = true) {
    super(width, height, renderToScreen);
    this.clock = new THREE.Clock();
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
    this.composer.render();
  }

  subscribeToUpdate(component) {
    this._componentsToUpdate.push(component);
  }

  update() {
    this.delta = this.clock.getDelta();
    this.elapsedTime = this.clock.getElapsedTime();
    this._componentsToUpdate.forEach(
      (component) => component.update(this.delta, this.elapsedTime)
    );
  }
}
export default AbstractApplication;
