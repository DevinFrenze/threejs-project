import 'controls/OrbitControls';

class Controls {
  constructor(camera, options = { speed: 10, dampingFactor: 0.25 }) {
    const keys = Object.keys(options);
    /*
    for (let i = 0; i < keys.length; i++) {
      this._controls[keys[i]] = options[keys[i]];
    }
    */

    document.onmousemove = this.handleMouseMove;
    window.addEventListener('resize'), this.onWindowResize, false);

    this.x = this.y = 0;
    this.onWindowResize();
  };

  handleMouseMove = (e) => {
    this.x = e.clientX;
    this.y = e.clientY;
  }

  onWindowResize = () => {
    this.windowCenterX = window.innerWidth / 2;
    this.windowCenterY = window.innerHeight / 2;
  };

  getVectorFromCenter() {
    return {
      x: this.x - this.windowCenterX,
      y: this.y - this.windowCenterY
    };
  }

  update() {
  }
}

export default Controls;
