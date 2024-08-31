import AudioAnalyzer from './AudioAnalizer'

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const analyserNode = audioContext.createAnalyser()
const audioAnalyzer = new AudioAnalyzer(analyserNode)
let currentSource = null
let currentGainNode = null
let currentTitle = null

const loadAudioFile = async (url) => {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  return await audioContext.decodeAudioData(arrayBuffer)
}

const playAudio = (buffer, title, fadeInTime = 1) => {
  if (currentSource) {
    currentSource.stop()
  }

  const source = audioContext.createBufferSource()
  source.buffer = buffer

  const gainNode = audioContext.createGain()
  source.connect(gainNode)
  gainNode.connect(analyserNode)
  analyserNode.connect(audioContext.destination)

  gainNode.gain.setValueAtTime(0, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + fadeInTime) // Fade in

  source.start(0)

  currentSource = source
  currentGainNode = gainNode
  currentTitle = title
}

// Transition Between Musics
const transitionToTrack = async (newBuffer, title, transitionTime = 1) => {
  if (currentGainNode) {
    currentGainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + transitionTime) // Fade out
  }
  // Start playing the new track with a fade-in effect before the current track completely fades out
  setTimeout(() => {
    playAudio(newBuffer, title, transitionTime)
  }, transitionTime * 500)
}

let introAudioLoop
let sphereAudio

const initAudio = async () => {
  introAudioLoop = await loadAudioFile('DSESE-intro.mp3')
  sphereAudio = await loadAudioFile('Stellar-Odyssey.mp3')
}

initAudio()

export const playMainAudio = async () => {
  playAudio(introAudioLoop, 'DSESE-intro')
}

export const playSphereAudio = async () => {
  transitionToTrack(sphereAudio, 'Stellar-Odyssey')
}

export const getFrequencyData = () => {
  return {
    title: currentTitle,
    data: audioAnalyzer.getFrequencyData()
  }
}

export const getTimeDomainData = () => {
  return {
    title: currentTitle,
    data: audioAnalyzer.getTimeDomainData()
  }
}

export const getRMSLevel = () => {
  return {
    title: currentTitle,
    data: audioAnalyzer.getRMSLevel()
  }
}
