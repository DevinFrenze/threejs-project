class UIColor {
  constructor(name = 'color', r = 255, g = 255, b = 255) {
    // change to rgb object
    this._name = name;
    this.color = [r, g, b];
    localStorage.setItem(this._name, this.color);
    window.addEventListener( 'storage', this.onStorageChange.bind(this), false);
  }

  onStorageChange() {
    console.log('on storage change');
    console.log(localStorage);
  }

  addToGui(gui) {
    const control = gui.addColor(this, this._name); 
    control.onChange((value) => {
      console.log('HI');
      console.log(value);
      // localStorage.setItem(this._name, value);
    });
  }

  toFloat(level) {
    return localStorage.getItem(this._name).split(',').map((v) => level * parseInt(v) / 255);
  }
}

export default UIColor;
