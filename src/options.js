export const sphere = {
  color: 0x000000,
  velocity: 0.002
}

const bentoUp = 0
const bentoLeft = 125
const bentoDepth = 0

export const boxes = [
  // Upper row
  [
    // 1 alone
    {
      videoSrc: 'github.mp4',
      size: { x: 100, y: 100, z: 100 + bentoDepth },
      position: { x: -450 + bentoLeft, y: 150 + bentoUp, z: 0 },
      url: 'https://github.com/F0rno'
    },
    // Big 4
    {
      videoSrc: 'stay-tuned.mp4',
      size: { x: 200, y: 200, z: 100 + bentoDepth },
      position: { x: -300 + bentoLeft, y: 200 + bentoUp, z: 0 },
      url: ''
    },
    // 4 alone
    //  top
    {
      videoSrc: 'stay-tuned.mp4',
      size: { x: 100, y: 100, z: 100 + bentoDepth },
      position: { x: -150 + bentoLeft, y: 250 + bentoUp, z: 0 },
      url: ''
    },
    {
      videoSrc: 'stay-tuned.mp4',
      size: { x: 100, y: 100, z: 100 + bentoDepth },
      position: { x: -50 + bentoLeft, y: 250 + bentoUp, z: 0 },
      url: ''
    },
    //  bottom
    {
      videoSrc: 'marina.mp4',
      size: { x: 100, y: 100, z: 100 + bentoDepth },
      position: { x: -150 + bentoLeft, y: 150 + bentoUp, z: 0 },
      url: 'https://github.com/F0rno/Marina-8bits-Computer'
    },
    {
      videoSrc: 'stay-tuned.mp4',
      size: { x: 100, y: 100, z: 100 + bentoDepth },
      position: { x: -50 + bentoLeft, y: 150 + bentoUp, z: 0 },
      url: ''
    },
    // 1 alone
    {
      videoSrc: 'linkedin.mp4',
      size: { x: 100, y: 100, z: 100 + bentoDepth },
      position: { x: 150 + bentoLeft, y: 150 + bentoUp, z: 0 },
      url: 'https://www.linkedin.com/in/pablo-fornell/'
    }
  ],
  // Lower row
  [
    // Big 2 horizontal
    {
      videoSrc: 'stay-tuned.mp4',
      size: { x: 200, y: 100, z: 100 + bentoDepth },
      position: { x: -500 + bentoLeft, y: 50 + bentoUp, z: 0 },
      url: ''
    },
    // 2 alone
    {
      videoSrc: 'stay-tuned.mp4',
      size: { x: 100, y: 100, z: 100 + bentoDepth },
      position: { x: -350 + bentoLeft, y: 50 + bentoUp, z: 0 },
      url: ''
    },
    {
      videoSrc: 'x.mp4',
      size: { x: 100, y: 100, z: 100 + bentoDepth },
      position: { x: -250 + bentoLeft, y: 50 + bentoUp, z: 0 },
      url: 'https://twitter.com/F_de_Fornell'
    },
    // Big 2 horizontal
    {
      videoSrc: 'stay-tuned.mp4',
      size: { x: 200, y: 100, z: 100 + bentoDepth },
      position: { x: -100 + bentoLeft, y: 50 + bentoUp, z: 0 },
      url: ''
    },
    // Big 3 vertical
    {
      videoSrc: 'stay-tuned.mp4',
      size: { x: 100, y: 300, z: 100 + bentoDepth },
      position: { x: 50 + bentoLeft, y: 150 + bentoUp, z: 0 },
      url: ''
    },
    // 2 alone
    {
      videoSrc: 'stay-tuned.mp4',
      size: { x: 100, y: 100, z: 100 + bentoDepth },
      position: { x: 150 + bentoLeft, y: 50 + bentoUp, z: 0 },
      url: ''
    },
    {
      videoSrc: 'stay-tuned.mp4',
      size: { x: 100, y: 100, z: 100 + bentoDepth },
      position: { x: 250 + bentoLeft, y: 50 + bentoUp, z: 0 },
      url: ''
    }
  ]
]
