import 'BufferGeometryUtils';
import 'shaders/NormalMapShader';
import 'ShaderTerrain';
import GridTexture from 'scripts/objects/GridTexture';

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

class Terrain {
  constructor(updateContext, renderer) {
    this.clock = new THREE.Clock();
    this.animDelta = 0;
    this.animDeltaDir = -1;
    this.renderer = renderer;

    this.initScene();
    this.initHeightAndNormalMaps();
    this.initTerrainShader();
    this.initUniformsNoise();
    this.initMaterialLibrary();
    this.initTerrainMesh();

    updateContext.subscribeToUpdate(this);

    return this.terrain;
  }

  initScene() {
    // create scene target, camera, and plane
    this.sceneRenderTarget = new THREE.Scene();

    this.cameraOrtho = new THREE.OrthographicCamera( SCREEN_WIDTH / - 2, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_HEIGHT / - 2, -10000, 10000 );
    this.cameraOrtho.position.z = 100;
    this.sceneRenderTarget.add( this.cameraOrtho );

    const plane = new THREE.PlaneBufferGeometry( SCREEN_WIDTH, SCREEN_HEIGHT );
    this.quadTarget = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0x000000 } ) );
    this.quadTarget.position.z = -500;
    this.sceneRenderTarget.add( this.quadTarget );
  }

  initHeightAndNormalMaps() {
    //  creates heightMap, normalMap, and normalShader
    const rx = 16, ry = 256;
    const pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };

    this.heightMap  = new THREE.WebGLRenderTarget( rx, ry, pars );
    this.heightMap.texture.generateMipmaps = false;

    this.normalMap = new THREE.WebGLRenderTarget( rx, ry, pars );
    this.normalMap.texture.generateMipmaps = false;

    this.normalShader = THREE.NormalMapShader;
    this.uniformsNormal = THREE.UniformsUtils.clone( this.normalShader.uniforms );
    this.uniformsNormal.height.value = 0.05;
    this.uniformsNormal.resolution.value.set( rx, ry );
    this.uniformsNormal.heightMap.value = this.heightMap.texture;
  }

  initTerrainShader() {
    // creates terrainShader and uniformsTerrain
    const pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
    const loadingManager = new THREE.LoadingManager();

    const specularMap = new THREE.WebGLRenderTarget( 2048, 2048, pars );
    specularMap.texture.generateMipmaps = false;

    const gridTex1 = new GridTexture(this.renderer);
    const gridTex2 = new GridTexture(this.renderer, new THREE.Color(0, 155, 255));
    const diffuseTexture1 = gridTex2.texture;
    const diffuseTexture2 = gridTex1.texture;
    diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping;
    diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping;
    specularMap.texture.wrapS = specularMap.texture.wrapT = THREE.RepeatWrapping;

    this.terrainShader = THREE.ShaderTerrain[ "terrain" ];
    const uniformsTerrain = this.uniformsTerrain = THREE.UniformsUtils.clone( this.terrainShader.uniforms );
    uniformsTerrain[ 'tNormal' ].value = this.normalMap.texture;
    uniformsTerrain[ 'uNormalScale' ].value = 3.5;
    uniformsTerrain[ 'tDisplacement' ].value = this.heightMap.texture;
    uniformsTerrain[ 'tSpecular' ].value = specularMap.texture;
    uniformsTerrain[ 'tDiffuse1' ].value = diffuseTexture1;
    uniformsTerrain[ 'tDiffuse2' ].value = diffuseTexture2;
    uniformsTerrain[ 'enableDiffuse1' ].value = true;
    uniformsTerrain[ 'enableDiffuse2' ].value = true;
    uniformsTerrain[ 'enableSpecular' ].value = true;
    uniformsTerrain[ 'diffuse' ].value.setHex( 0xffffff );
    uniformsTerrain[ 'specular' ].value.setHex( 0xffffff );
    uniformsTerrain[ 'shininess' ].value = 30;
    uniformsTerrain[ 'uDisplacementScale' ].value = 2000;
    uniformsTerrain[ 'uRepeatOverlay' ].value.set( 16, 16 );
  }

  initUniformsNoise() {
    // creates uniformsNoise
    this.uniformsNoise = {
      time:   { value: 1.0 },
      scale:  { value: new THREE.Vector2( 1.5, 1.5 ) },
      offset: { value: new THREE.Vector2( 0, 0 ) }
    };
  }

  initMaterialLibrary() {
    // creates materialLibrary
    const vertexShader = document.getElementById( 'vertexShader' ).textContent;
    const params = [
      [ 'heightmap',   document.getElementById( 'fragmentShaderNoise' ).textContent,   vertexShader, this.uniformsNoise, false ],
      [ 'normal',   this.normalShader.fragmentShader,  this.normalShader.vertexShader, this.uniformsNormal, false ],
      [ 'terrain',   this.terrainShader.fragmentShader, this.terrainShader.vertexShader, this.uniformsTerrain, true ]
    ];

    this.materialLibrary = {};
    for( let i = 0; i < params.length; i++ ) {
      const material = new THREE.ShaderMaterial( {
        uniforms:     params[ i ][ 3 ],
        vertexShader:   params[ i ][ 2 ],
        fragmentShader: params[ i ][ 1 ],
        lights:     params[ i ][ 4 ],
        fog:       true
      } );
      this.materialLibrary[ params[ i ][ 0 ] ] = material;
    }
  }

  initTerrainMesh() {
    // creates terrain mesh
    const geometryTerrain = new THREE.PlaneBufferGeometry( 8000, 8000, 256, 256 );
    THREE.BufferGeometryUtils.computeTangents( geometryTerrain );
    this.terrain = new THREE.Mesh( geometryTerrain, this.materialLibrary[ 'terrain' ] );
    this.terrain.position.set( 0, -500, 0 );
    this.terrain.rotation.x = -Math.PI / 2;
  }

  update() {
    const delta = this.clock.getDelta();
    const time = Date.now() * 0.001;
    this.uniformsTerrain[ 'uNormalScale' ].value = THREE.Math.mapLinear( 1, 0, 1, 0.6, 3.5 );

    this.animDelta = THREE.Math.clamp( this.animDelta + 0.00075 * this.animDeltaDir, 0, 0.05 );
    this.uniformsNoise[ 'time' ].value += delta * this.animDelta;
    this.uniformsNoise[ 'offset' ].value.y += delta * 0.05;
    this.uniformsTerrain[ 'uOffset' ].value.y = 4 * this.uniformsNoise[ 'offset' ].value.y;
    this.quadTarget.material = this.materialLibrary[ 'heightmap' ];
    this.renderer.render( this.sceneRenderTarget, this.cameraOrtho, this.heightMap, true );
    this.quadTarget.material = this.materialLibrary[ 'normal' ];
    this.renderer.render( this.sceneRenderTarget, this.cameraOrtho, this.normalMap, true );
  }
}

export default Terrain;
