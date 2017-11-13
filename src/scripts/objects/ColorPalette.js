class ColorPalette {
  constructor(updateContext, baseColor, rateOfChange = 20000) {
    this._colors = [];
    this.generate(baseColor);
    this.rateOfChange = rateOfChange;
    updateContext.subscribeToUpdate(this);

    this._resetDestinationColor = this.resetDestinationColor.bind(this);
    this.resetDestinationColor();

    this.interpColors(new THREE.Color(0,0,0), new THREE.Color(0, 1, 1));
  }

  resetDestinationColor() {
    this.destinationColor = new THREE.Color().setHSL(Math.random(), 1, 0.5);
    const { rateOfChange } = this;
    const timeTillChange = (rateOfChange / 2) + (Math.random() * rateOfChange);
    setTimeout(this._resetDestinationColor, timeTillChange);
  }

  generate(baseColor) {
    this.baseColor = baseColor;
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

  interpColors(color1, color2, amount = 0.002) {
    const hsl1 = color1.getHSL();
    const hsl2 = color2.getHSL();

    const newHSL = {
      h: (hsl2.h * amount) + (hsl1.h * (1 - amount)),
      s: (hsl2.s * amount) + (hsl1.s * (1 - amount)),
      l: (hsl2.l * amount) + (hsl1.l * (1 - amount))
    };

    const color = (new THREE.Color()).setHSL(newHSL.h, newHSL.s, newHSL.l);
    return color;
  }

  update() {
    if (this.baseColor.getHexString() !== this.destinationColor.getHexString()) {
      this.generate(this.interpColors(this.baseColor, this.destinationColor));
    }
  }
}

export default ColorPalette;
