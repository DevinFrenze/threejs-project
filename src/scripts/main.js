import AbstractApplication from 'scripts/views/AbstractApplication';
import 'utils/GeometryUtils';
import UIColor from 'scripts/ui/ui_color';

import 'shaders/DigitalGlitch';
import 'postprocessing/GlitchPass';

import AudioAnalyser from 'scripts/plugins/audioAnalyser';
import Controls from 'scripts/controls/mouse_from_center';
import Text from 'scripts/objects/text';
import ColorPalette from 'scripts/objects/ColorPalette';

import 'shaders/NormalMapShader';
import 'ShaderTerrain';
import 'BufferGeometryUtils';
import 'controls/OrbitControls';
import 'loaders/AssimpJSONLoader';

const {
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  ObjectLoader,
  AssimpJSONLoader,
} = THREE;

class Main extends AbstractApplication {
  constructor(dev = true){
    super(dev);

    this.initGui();
    this.initScene();
    this.animate(); // always call this.animate at the end of constructor
  }

  initGui() {
    const gui = new dat.GUI();
    this.uiColor1 = new UIColor(gui, "color1");
    this._colorPalette = new ColorPalette(this.uiColor1.color);
    this.uiButton1 = gui.add(this, 'generateColorPalette');
  }

  generateColorPalette() {
    this._colorPalette.generate(this.uiColor1.color);
  }

  initScene() {
    // const controls = new Controls(this, this.scene, 1);
    this.renderer.setClearColor("#ffffff");

    const materials = new Array(this._colorPalette.size).fill(0).map(
      (val, index) => {
        const meshMaterial = new MeshBasicMaterial({ side: THREE.DoubleSide });
        meshMaterial.color = this._colorPalette.color(index);
        return meshMaterial;
      }
    );

    const assimpJSONLoader = new AssimpJSONLoader();

    assimpJSONLoader.load(
      "/models/delfin_low.assimp.json",
      (obj) => {
        const scale = 70;
        obj.scale.set(scale, scale, scale);

        const dolphins = new Array(this._colorPalette.size).fill(0);
        dolphins.map((val, index) => {
          const dolphin = obj.clone();
          dolphin.scale.set(scale, scale, scale);

          dolphin.traverse((child) => {
            if (child instanceof Mesh) {
              child.material = materials[index];
            }
          });

          dolphin.position.x = (index - ((this._colorPalette.size - 1) / 2)) * 100;

          this.addToScene(dolphin);
        });
      }
    );


    let cameraOrtho, sceneRenderTarget;
    let uniformsNoise, uniformsNOrmal, uniformsTerrain, heightMap, normalMap, quadTarget;
    let terrain;
    let textureCounter = 0;

    let animDelta = 0, animDeltaDir = -1;
    let lightVal = 0, lightDir = 1;
    const clock = new THREE.Clock();
    this. updateNoise = true;
    this. animateTerrain = false;

    let mlib = {};

    sceneRenderTarget = new THREE.Scene();
    cameraOrtho = new THREE.OrthographicCamera(
      window.width / -2,
      window.width / 2,
      window.height / 2,
      window.height / -2,
      -10000,
      10000
    );
    cameraOrtho.position.z = 100;

    sceneRenderTarget.add( cameraOrtho );

    ///////////

    const controls = new THREE.OrbitControls( this.camera );
    controls.target.set( 0, 0, 0);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.keys = [65, 83, 68];

    this.scene.fog = new THREE.Fog( 0x050505, 2000, 4000 );

    this.scene.add( new THREE.AmbientLight( 0x111111 ) );

    /* SKIPPING OTHER LIGHTS FOR NOW */

    let normalShader = THREE.NormalMapShader;
    let rx = 256, ry = 256;
    let parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
    };

    heightMap = new THREE.WebGLRenderTarget( rx, ry, parameters );
    heightMap.texture.generateMipmaps = false;

    normalMap = new THREE.WebGLRenderTarget( rx, ry, parameters );
    normalMap.texture.generateMipmaps = false;

    uniformsNoise = {
      time: { value: 1.0 },
      scale: { value: new THREE.Vector2( 1.5, 1.5 ) },
      offset: { value: new THREE.Vector2( 0, 0 ) }
    };

    let uniformsNormal = THREE.UniformsUtils.clone( normalShader.uniforms );
    uniformsNormal.height.value = 0.05;
    uniformsNormal.resolution.value.set( rx, ry );
    uniformsNormal.heightMap.value = heightMap.texture;

    const vertexShader = "varying vec2 vUv; uniform vec2 scale; uniform vec2 offset; void main( void ) { vUv = uv * scale + offset; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }";

    const fragmentShaderNoise = "uniform float time; varying vec2 vUv; vec4 permute( vec4 x ) { return mod( ( ( x * 34.0 ) + 1.0 ) * x, 289.0 ); } vec4 taylorInvSqrt( vec4 r ) { return 1.79284291400159 - 0.85373472095314 * r; } float snoise( vec3 v ) { const vec2 C = vec2( 1.0 / 6.0, 1.0 / 3.0 ); const vec4 D = vec4( 0.0, 0.5, 1.0, 2.0 ); vec3 i  = floor( v + dot( v, C.yyy ) ); vec3 x0 = v - i + dot( i, C.xxx ); vec3 g = step( x0.yzx, x0.xyz ); vec3 l = 1.0 - g; vec3 i1 = min( g.xyz, l.zxy ); vec3 i2 = max( g.xyz, l.zxy ); vec3 x1 = x0 - i1 + 1.0 * C.xxx; vec3 x2 = x0 - i2 + 2.0 * C.xxx; vec3 x3 = x0 - 1. + 3.0 * C.xxx; i = mod( i, 289.0 ); vec4 p = permute( permute( permute( i.z + vec4( 0.0, i1.z, i2.z, 1.0 ) ) + i.y + vec4( 0.0, i1.y, i2.y, 1.0 ) ) + i.x + vec4( 0.0, i1.x, i2.x, 1.0 ) ); float n_ = 1.0 / 7.0; vec3 ns = n_ * D.wyz - D.xzx; vec4 j = p - 49.0 * floor( p * ns.z *ns.z ); vec4 x_ = floor( j * ns.z ); vec4 y_ = floor( j - 7.0 * x_ ); vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy; vec4 h = 1.0 - abs( x ) - abs( y ); vec4 b0 = vec4( x.xy, y.xy ); vec4 b1 = vec4( x.zw, y.zw ); vec4 s0 = floor( b0 ) * 2.0 + 1.0; vec4 s1 = floor( b1 ) * 2.0 + 1.0; vec4 sh = -step( h, vec4( 0.0 ) ); vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww; vec3 p0 = vec3( a0.xy, h.x ); vec3 p1 = vec3( a0.zw, h.y ); vec3 p2 = vec3( a1.xy, h.z ); vec3 p3 = vec3( a1.zw, h.w ); vec4 norm = taylorInvSqrt( vec4( dot( p0, p0 ), dot( p1, p1 ), dot( p2, p2 ), dot( p3, p3 ) ) ); p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w; vec4 m = max( 0.6 - vec4( dot( x0, x0 ), dot( x1, x1 ), dot( x2, x2 ), dot( x3, x3 ) ), 0.0 ); m = m * m; return 42.0 * dot( m*m, vec4( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 ), dot( p3, x3 ) ) ); } float surface3( vec3 coord ) { float n = 0.0; n += 1.0 * abs( snoise( coord ) ); n += 0.5 * abs( snoise( coord * 2.0 ) ); n += 0.25 * abs( snoise( coord * 4.0 ) ); n += 0.125 * abs( snoise( coord * 8.0 ) ); return n; } void main( void ) { vec3 coord = vec3( vUv, -time ); float n = surface3( coord ); gl_FragColor = vec4( vec3( n, n, n ), 1.0 ); }";

    /* SKIPPING TEXTURES FOR NOW */
    let terrainShader = THREE.ShaderTerrain[ "terrain" ];
    uniformsTerrain = THREE.UniformsUtils.clone( terrainShader.uniforms);
    uniformsTerrain[ 'tNormal' ].value = normalMap.texture;
    uniformsTerrain[ 'uNormalScale' ].value = 3.5;
    uniformsTerrain[ 'tDisplacement' ].value = heightMap.texture;

    // uniformsTerrain[ 'tDiffuse1' ].value = diffuseTexture1;
    // uniformsTerrain[ 'tDiffuse2' ].value = diffuseTexture2;
    // uniformsTerrain[ 'tSpecular' ].value = specularMap.texture;
    // uniformsTerrain[ 'tDetail' ].value = detailTexture;
    uniformsTerrain[ 'enableDiffuse1' ].value = true;
    uniformsTerrain[ 'enableDiffuse2' ].value = true;
    uniformsTerrain[ 'enableSpecular' ].value = true;
    uniformsTerrain[ 'diffuse' ].value.setHex( 0xffffff );
    uniformsTerrain[ 'specular' ].value.setHex( 0xffffff );
    uniformsTerrain[ 'shininess' ].value = 30;
    uniformsTerrain[ 'uDisplacementScale' ].value = 375;
    uniformsTerrain[ 'uRepeatOverlay' ].value.set( 6, 6 );

    const params = [
      [ 'heightmap', fragmentShaderNoise, vertexShader, uniformsNoise, false ],
      [ 'normal', normalShader.fragmentShader,  normalShader.vertexShader, uniformsNormal, false ],
      [ 'terrain', terrainShader.fragmentShader, terrainShader.vertexShader, uniformsTerrain, true ]
    ];

    for (let i = 0; i < params.length; i++) {
      let material = new THREE.ShaderMaterial({
        uniforms:       params[i][3],
        vertexShader:   params[i][2],
        fragmentShader: params[i][1],
        lights:         params[i][4],
        fog:            true
      });

      mlib[params[i][0]] = material;
    }

    const plane = new THREE.PlaneBufferGeometry( window.width, window.height);
    quadTarget = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0x000000 } ) );
    quadTarget.position.z = -500;
    sceneRenderTarget.add( quadTarget );

    // TERRAIN MESH

    const geometryTerrain = new THREE.PlaneBufferGeometry( 6000, 6000, 256, 256 );
    THREE.BufferGeometryUtils.computeTangents( geometryTerrain );

    terrain = new THREE.Mesh( geometryTerrain, mlib['terrain'] );
    terrain.position.set( 0, -125, 0 );
    terrain.rotation.x = Math.PI / -2;
    terrain.visible = false;
    this.addToScene(terrain);

    this.renderer.setClearColor( this.scene.fog.color );
  }
}

export default Main;
