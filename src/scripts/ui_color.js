class UIColor {
  constructor(gui, name = 'rgbColor', r = 255, g = 255, b = 255, remote = false) {
    this._name = name;
    this[name] = [ r, g, b ];
    this._colorControl = gui.addColor(this, this._name); 
    if (remote) removeControl();
  }

  get color() {
    return this[this._name];
  }

  toFloat() {
    return this.color.map((v) => v / 255);
  }

  remoteControl() {
    localStorage.setItem(this._name, this.color);

    this._colorControl.onChange((value) => {
      localStorage.setItem(this._name, value);
    });

    onStorageChange = () => {
      let color = localStorage.getItem(this._name);
      color = color.split(',').map((v) => parseInt(v));
      this._colorControl.setValue(color);
    };

    window.addEventListener( 'storage', onStorageChange, false);
  }
}

export default UIColor;
