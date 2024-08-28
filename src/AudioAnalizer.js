export default class AudioAnalyzer {
    constructor(audioFilePath) {
        this.audioContext = new AudioContext();
        this.analyser = null;
        this.audioFilePath = audioFilePath;
    }

    loadAudio(audioFilePath = this.audioFilePath) {
        fetch(audioFilePath)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                const source = this.audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(this.audioContext.destination);
                source.start();

                // Create an AnalyserNode
                this.analyser = this.audioContext.createAnalyser();
                source.connect(this.analyser);
            });
    }

    getFrequencyData() {
        if (this.analyser) {
            const data = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(data);
            return data;
        }
        return null;
    }
}