import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
  Scene,
  WebGLRenderer
} from 'three'
import { cameraConfig, performanceConfig } from '@shared/config'

// Minimal transparent Three.js scene (brief sections 15-16). The rotating
// box below is a deliberate placeholder for the rigged horse model that
// arrives in Phase 3 — see PROJECT_STATUS.md for why a stand-in was used
// and confirm nothing here assumes box-specific geometry so the swap is
// a pure asset-loading change, not a rewrite.
export class CompanionScene {
  private renderer: WebGLRenderer
  private scene = new Scene()
  private camera: OrthographicCamera
  private placeholder: Mesh
  private frameInterval = 1000 / performanceConfig.targetFps
  private lastFrameTime = 0
  private animationHandle: number | null = null

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    })
    this.renderer.setClearColor(0x000000, 0)

    const aspect = window.innerWidth / window.innerHeight
    const size = cameraConfig.frustumSize
    this.camera = new OrthographicCamera(
      (-size * aspect) / 2,
      (size * aspect) / 2,
      size / 2,
      -size / 2,
      0.1,
      100
    )
    this.camera.position.set(...cameraConfig.position)
    this.camera.lookAt(...cameraConfig.lookAt)

    this.scene.add(new AmbientLight(0xffffff, 0.7))
    const directional = new DirectionalLight(0xffffff, 0.8)
    directional.position.set(2, 4, 3)
    this.scene.add(directional)

    this.placeholder = new Mesh(
      new BoxGeometry(0.6, 1, 0.3),
      new MeshStandardMaterial({ color: 0x8a6d4b })
    )
    this.placeholder.position.set(0, 0.5, 0)
    this.scene.add(this.placeholder)

    this.resize()
    window.addEventListener('resize', () => this.resize())
  }

  start(): void {
    this.animationHandle = requestAnimationFrame(this.tick)
  }

  stop(): void {
    if (this.animationHandle !== null) {
      cancelAnimationFrame(this.animationHandle)
      this.animationHandle = null
    }
  }

  private tick = (time: number): void => {
    this.animationHandle = requestAnimationFrame(this.tick)

    // Simple frame-rate cap toward the 30 FPS idle target (brief section 17)
    // until the real behavior controller (Phase 5) drives timing instead.
    if (time - this.lastFrameTime < this.frameInterval) return
    this.lastFrameTime = time

    this.placeholder.rotation.y += 0.01
    this.renderer.render(this.scene, this.camera)
  }

  private resize(): void {
    const { innerWidth, innerHeight } = window
    const aspect = innerWidth / innerHeight
    const size = cameraConfig.frustumSize

    this.camera.left = (-size * aspect) / 2
    this.camera.right = (size * aspect) / 2
    this.camera.top = size / 2
    this.camera.bottom = -size / 2
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(innerWidth, innerHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
}
