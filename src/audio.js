const audioContext = new (window.AudioContext || window.webkitAudioContext)()
let currentSource = null
let currentGainNode = null

const loadAudioFile = async (url) => {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  return await audioContext.decodeAudioData(arrayBuffer)
}

const playAudio = (buffer, fadeInTime = 1) => {
  if (currentSource) {
    currentSource.stop()
  }

  const source = audioContext.createBufferSource()
  source.buffer = buffer

  const gainNode = audioContext.createGain()
  source.connect(gainNode)
  gainNode.connect(audioContext.destination)

  gainNode.gain.setValueAtTime(0, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + fadeInTime) // Fade in

  source.start(0)

  currentSource = source
  currentGainNode = gainNode
}

// Transition Between Musics
const transitionToTrack = async (newBuffer, transitionTime = 1) => {
  if (currentGainNode) {
    currentGainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + transitionTime) // Fade out
  }
  // Start playing the new track with a fade-in effect before the current track completely fades out
  setTimeout(() => {
    playAudio(newBuffer, transitionTime)
  }, transitionTime * 500)
}

let introAudioLoop

const initAudio = async () => {
  introAudioLoop = await loadAudioFile('DSESE-intro.mp3')
}

initAudio()

export const introLoopAudio = async () => {
  playAudio(introAudioLoop)
}
