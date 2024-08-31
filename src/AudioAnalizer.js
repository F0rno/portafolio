/* eslint-disable no-undef */
class AudioAnalyzer {
  constructor (analyser) {
    this.analyser = analyser
  }

  getFrequencyData () {
    if (this.analyser) {
      const data = new Uint8Array(this.analyser.frequencyBinCount)
      this.analyser.getByteFrequencyData(data)
      return data
    }
    return null
  }

  getTimeDomainData () {
    if (this.analyser) {
      const data = new Uint8Array(this.analyser.fftSize)
      this.analyser.getByteTimeDomainData(data)
      return data
    }
    return null
  }

  getRMSLevel () {
    const timeDomainData = this.getTimeDomainData()
    if (timeDomainData) {
      let sumSquares = 0
      for (let i = 0; i < timeDomainData.length; i++) {
        const value = (timeDomainData[i] - 128) / 128
        sumSquares += value * value
      }
      return Math.sqrt(sumSquares / timeDomainData.length)
    }
    return null
  }
}

export default AudioAnalyzer
