import 'controls/OrbitControls';

import 'shaders/CopyShader';
import 'postprocessing/EffectComposer';
import 'postprocessing/RenderPass';
import 'postprocessing/MaskPass';
import 'postprocessing/ShaderPass';

class AbstractApplication{

  constructor(){
    // init camera and scene
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    this._camera.position.z = 400;

    // setup and append renderer
    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setPixelRatio( window.devicePixelRatio );
    this._renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this._renderer.domElement );

    //  setup and append statistics
    this._stats = new Stats();
    document.body.appendChild( this._stats.dom );

    // setup post processing chain
    this._composer = new THREE.EffectComposer( this._renderer );
    this._renderPass = new THREE.RenderPass( this._scene, this._camera ); 
    this._renderPass.renderToScreen = true;
    this._composer.addPass(this._renderPass);

    // enable controls so user can navigate scene
    this._controls = new THREE.OrbitControls( this._camera, this._renderer.domElement );
    this._controls.enableDamping = true;
    this._controls.dampingFactor = 0.25;
    this._controls.enableZoom = false;

    // initialize audio
    this.initAudio();

    // bind listeners
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    window.addEventListener( 'storage', this.onStorageChange.bind(this), false);
  }

  get renderer(){
    return this._renderer;
  }

  get camera(){
    return this._camera;
  }

  get scene(){
    return this._scene;
  }

  initAudio() {
    const gotStream = (stream) => {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this._audioContext = new window.AudioContext();
      this._audioSource= this._audioContext.createMediaStreamSource( stream );
      this._audioAnalyser = this._audioContext.createAnalyser();

      const filter = this._audioContext.createBiquadFilter();
      this._audioSource.connect(filter);
      filter.connect(this._audioAnalyser);
      filter.type = 'highpass';
      filter.frequency.value = 8000;

      this._timeDataArray = new Float32Array(this._audioAnalyser.frequencyBinCount);
      this._freqDataArray = new Uint8Array(this._audioAnalyser.frequencyBinCount);
      // uncomment the line below for audio through
      // this._audioSource.connect( this._audioContext.destination );
    };

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    navigator.getUserMedia( { audio: true }, gotStream, function() { console.log('error'); } );
  }

  updateAudio() {
    this._audioAnalyser.getFloatTimeDomainData(this._timeDataArray);
    this._audioAnalyser.getByteFrequencyData(this._freqDataArray);
    const sum = this._freqDataArray.reduce((sum, val) => sum + val, 0);
    const averageLevel = sum / this._freqDataArray.length;
    const normalizedLevel = averageLevel / 256;
    this._audioLevel = normalizedLevel;
  }

  onWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize( window.innerWidth, window.innerHeight );
    this._composer.setSize( window.innerWidth, window.innerHeight );
  }

  onStorageChange(e) {
    // console.log(e);
    // console.log(localStorage);
  }

  animate(timestamp) {
    requestAnimationFrame( this.animate.bind(this) );

    if (this._audioAnalyser) {
      this.updateAudio();
    }

    this._controls.update();

    this.update();

    this._composer.render( this._scene, this._camera );
    this._stats.update();
  }

  update() { }

}
export default AbstractApplication;
