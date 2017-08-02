class GridTexture {
  constructor(renderer,
    bgColor = new THREE.Color(255, 155, 0),
    lineColor = new THREE.Color(55, 0, 255)
  ) {
    this.lineColor = lineColor;
    this.bgColor = bgColor;

    this.renderer = renderer;
    // this.renderer = new THREE.WebGLRenderer();
    // this.renderer.setSize( 324, 324);
    // document.body.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();

    this.target = new THREE.WebGLRenderTarget(256, 256, {
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      magFilter: THREE.LinearFilter,
      minFilter: THREE.LinearFilter,
      format: THREE.RGBFormat
    }); 

    this.cameraOrtho = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
    this.cameraOrtho.position.set( 0, 0, 1);
    this.scene.add( this.cameraOrtho );

    const plane = new THREE.PlaneBufferGeometry( 2, 2 );
    const edgeVertical = new THREE.PlaneBufferGeometry( 0.1, 2 );
    const edgeHorizontal = new THREE.PlaneBufferGeometry( 2, 0.1 );

    this.bgMaterial = new THREE.MeshBasicMaterial();
    this.bgMaterial.color = bgColor;
    this.lineMaterial = new THREE.LineBasicMaterial();
    this.lineMaterial.color = lineColor;

    this.planeMesh = new THREE.Mesh( plane, this.bgMaterial);
    this.edgeHorizontalMesh = new THREE.Mesh( edgeHorizontal, this.lineMaterial);
    this.edgeVerticalMesh = new THREE.Mesh( edgeVertical, this.lineMaterial);

    this.scene.add(this.planeMesh);
    this.scene.add(this.edgeHorizontalMesh);
    this.scene.add(this.edgeVerticalMesh);

    this.renderer.render( this.scene, this.cameraOrtho, this.target, true );
    // this.renderer.render( this.scene, this.cameraOrtho);
  }

  get texture() {
    return this.target.texture;
  }

  update() {
    this.renderer.render( this.scene, this.cameraOrtho, this.target, false );
  }
}

export default GridTexture;
