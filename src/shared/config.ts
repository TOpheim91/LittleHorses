// Central configuration for the Little Horses companion.
// Keep window, camera, and companion tuning values here rather than
// scattered through the codebase, per the project brief (section 7 & 16).

export interface CompanionWindowConfig {
  width: number
  height: number
  scalePresets: Record<'small' | 'medium' | 'large', number>
  defaultScale: 'small' | 'medium' | 'large'
}

export const windowConfig: CompanionWindowConfig = {
  width: 400,
  height: 400,
  scalePresets: {
    small: 0.7,
    medium: 1.0,
    large: 1.3
  },
  defaultScale: 'medium'
}

export interface CameraConfig {
  type: 'orthographic' | 'perspective'
  // Orthographic viewing frustum size (world units from center to edge).
  frustumSize: number
  position: [number, number, number]
  lookAt: [number, number, number]
}

export const cameraConfig: CameraConfig = {
  type: 'orthographic',
  frustumSize: 3,
  position: [0, 1.2, 5],
  lookAt: [0, 1, 0]
}

export interface PerformanceConfig {
  targetFps: 15 | 30 | 60
}

export const performanceConfig: PerformanceConfig = {
  targetFps: 30
}

export interface AppSettings {
  position: { x: number; y: number } | null
  scale: number
  alwaysOnTop: boolean
  animationsEnabled: boolean
  launchAtStartup: boolean
}

export const defaultSettings: AppSettings = {
  position: null,
  scale: windowConfig.scalePresets[windowConfig.defaultScale],
  alwaysOnTop: true,
  animationsEnabled: true,
  launchAtStartup: false
}
