import { CompanionScene } from '@three/scene'

const root = document.getElementById('companion-root')
if (!root) {
  throw new Error('companion-root element missing from index.html')
}

const canvas = document.createElement('canvas')
root.appendChild(canvas)

const scene = new CompanionScene(canvas)
scene.start()
