class UIColor {
  constructor(gui, name = 'rgbColor', r = 255, g = 255, b = 255, remote = true) {
    this._name = name;
    this[name] = [ r, g, b ];
    this._colorControl = gui.addColor(this, this._name); 
    this._color = new THREE.Color();

    if (remote) {
      this.remoteControl();
    }

    this._colorControl.onChange((value) => {
      if (remote) localStorage.setItem(this._name, value);
      this.updateColorObject();
    });
    this.updateColorObject();
  }

  updateColorObject() {
    this._color.fromArray(this.toFloat());
  }

  get colorArray() {
    return this[this._name];
  }

  get color() {
    return this._color;
  }

  toFloat() {
    return this.colorArray.map((v) => v / 255);
  }

  remoteControl() {
    const onStorageChange = () => {
      let color = localStorage.getItem(this._name);
      if (color) {
        color = color.split(',').map((v) => parseInt(v));
        this._colorControl.setValue(color);
        this.updateColorObject();
      } else {
        localStorage.setItem(this._name, this.colorArray);
      }
    };

    onStorageChange();

    window.addEventListener( 'storage', onStorageChange, false);
  }
}

export default UIColor;
