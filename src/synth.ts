export class Synth {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  volume: number;
  waveform: OscillatorType;
  private _osc: OscillatorNode | undefined;
  private _gainNode: GainNode | undefined;
  private _audioContext: AudioContext;
  private _freq: number | undefined;

  constructor(audioContext: AudioContext) {
    this.attack = 0 ;
    this.decay = 0;
    this.sustain = 0;
    this.release = 0;
    this.waveform = "sine";
    this.volume = 0;
    this._osc = undefined;
    this._gainNode = undefined;
    this._freq = 0;
    this._audioContext = audioContext;
  }

  public updateValues(
    attack: number,
    decay: number,
    sustain: number,
    release: number,
    volume: number,
    freq: number | undefined,
    waveform: OscillatorType,
  ): void {

    this.attack = attack;
    this.decay = decay;
    this.sustain = sustain;
    this.release = release;
    this._freq = freq
    this.waveform = waveform;
    this.volume = volume;

  }


  public noteOn() {
    this._osc = this._audioContext.createOscillator();
    this._gainNode = this._audioContext.createGain();
    this._osc.type = this.waveform;
    
    this._osc.connect(this._gainNode);
    this._gainNode.connect(this._audioContext.destination);

    let now = this._audioContext.currentTime;

    if (this._freq != undefined) {
      this._osc.frequency.setValueAtTime(this._freq, now);
    }

    this._gainNode.gain.cancelScheduledValues(now);
    this._gainNode.gain.setValueAtTime(0, now);

    this._gainNode.gain.linearRampToValueAtTime(this.volume, now + this.attack);
    // this._gainNode.gain.linearRampToValueAtTime(this.sustain, now + this.attack + this.decay);
    this._gainNode.gain.setTargetAtTime(this.sustain*this.volume, now + this.attack, this.decay);
    this._osc.start(now);

  }

  public noteOff() {
    let now = this._audioContext.currentTime;
    this._gainNode?.gain.cancelScheduledValues(now);
    this._gainNode?.gain.setValueAtTime(this._gainNode?.gain.value, now);
    this._gainNode?.gain.linearRampToValueAtTime(0, now + this.release);
    this._osc?.stop(now + this.release);

  }

}

