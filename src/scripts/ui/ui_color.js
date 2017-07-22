class UIColor {
  constructor(gui, name = 'rgbColor', color = new THREE.Color(), remote = true) {
    this._name = name;
    this[name] = color.toArray();
    this._color = color.clone();
    this._colorControl = gui.addColor(this, this._name); 
    this._remote = remote;
    this._colorControl.onChange(this.onControllerChange.bind(this));

    if (remote) {
      this.onLocalStorageChange();
      window.addEventListener( 'storage', this.onLocalStorageChange.bind(this), false);
    }
  }

  onControllerChange(value) {
    if (this._remote) localStorage.setItem(this._name, value);
    this._color.fromArray(this.colorArray.map((v) => v / 255));
  }

  onLocalStorageChange() {
    let color = localStorage.getItem(this._name);
    if (color) {
      color = color.split(',').map((v) => parseInt(v));
      this._colorControl.setValue(color);
    } else {
      localStorage.setItem(this._name, this.colorArray);
    }
  }

  set color(color) {
    this._colorControl.setValue(color.toArray().map((c) => c * 255));
  }

  get color() {
    return this._color;
  }

  get colorArray() {
    return this[this._name];
  }
}

export default UIColor;
