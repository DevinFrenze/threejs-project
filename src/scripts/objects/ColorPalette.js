class ColorPalette {
  constructor(baseColor) {
    this._colors = [];
    this.generate(baseColor);
  }

  generate(baseColor) {
    const hsl1 = baseColor.getHSL();

    const hsl2 = {
      h: (hsl1.h + (1/12)) % 1,
      s: hsl1.s * 0.9,
      l: hsl1.l * 1.8
    };

    const hsl3 = {
      h: (hsl1.h + (6/12)) % 1,
      s: hsl1.s * 0.95,
      l: hsl1.l * 0.95
    };

    const hsl4 = {
      h: (hsl1.h + (7/12)) % 1,
      s: hsl1.s * 0.95,
      l: hsl1.l * 1.5
    };

    const hsl5 = {
      h: (hsl1.h + (10/12)) % 1,
      s: hsl1.s * 0.9,
      l: hsl1.l * 0.3
    };

    const palette = [ hsl1, hsl2, hsl3, hsl4, hsl5 ];

    palette.map((hsl, index) => {
      let color = this._colors[index];

      if (!color) {
        color = new THREE.Color();
        this._colors.push(color);
      }

      color.setHSL(hsl.h, hsl.s, hsl.l);
    });
  }

  get size() {
    return this._colors.length;
  }

  color(index) {
    if (index >= this._colors.length || index < 0) return new Three.Color();
    return this._colors[index];
  }
}

export default ColorPalette;
