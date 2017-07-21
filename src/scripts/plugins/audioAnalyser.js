class AudioAnalyser {
  constructor(updateContext) {
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
    };

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    navigator.getUserMedia( { audio: true }, gotStream, function() { console.log('audio error'); } );

    updateContext.subscribeToUpdate(this);
  }

  update() {
    if (this._audioAnalyser) {
      this._audioAnalyser.getFloatTimeDomainData(this._timeDataArray);
      this._audioAnalyser.getByteFrequencyData(this._freqDataArray);
      const sum = this._freqDataArray.reduce((sum, val) => sum + val, 0);
      const averageLevel = sum / this._freqDataArray.length;
      const normalizedLevel = averageLevel / 256;
      this._audioLevel = normalizedLevel;
    }
  }

  get level() { return this._audioLevel || 0; }
}

export default AudioAnalyser;
