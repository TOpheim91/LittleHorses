import { BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { windowConfig } from '@shared/config'
import { settingsManager } from './settings'

// Responsible for creating the transparent companion window, restoring its
// last position, and keeping it on a valid display (brief sections 8-10).
export class WindowManager {
  private window: BrowserWindow | null = null

  createWindow(): BrowserWindow {
    const { x, y } = this.resolveStartPosition()

    this.window = new BrowserWindow({
      width: windowConfig.width,
      height: windowConfig.height,
      x,
      y,
      frame: false,
      transparent: true,
      alwaysOnTop: settingsManager.get('alwaysOnTop'),
      resizable: false,
      hasShadow: false,
      skipTaskbar: true,
      backgroundColor: '#00000000',
      webPreferences: {
        preload: join(__dirname, '../preload/preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    })

    this.window.setAlwaysOnTop(settingsManager.get('alwaysOnTop'), 'floating')
    this.window.setMenuBarVisibility(false)

    this.window.on('move', () => this.persistPosition())
    this.window.on('closed', () => {
      this.window = null
    })

    return this.window
  }

  getWindow(): BrowserWindow | null {
    return this.window
  }

  setAlwaysOnTop(value: boolean): void {
    settingsManager.set('alwaysOnTop', value)
    this.window?.setAlwaysOnTop(value, 'floating')
  }

  resetPosition(): void {
    const { workArea } = screen.getPrimaryDisplay()
    const x = workArea.x + workArea.width - windowConfig.width - 40
    const y = workArea.y + workArea.height - windowConfig.height - 40
    this.window?.setPosition(x, y)
    settingsManager.set('position', { x, y })
  }

  private persistPosition(): void {
    if (!this.window) return
    const [x, y] = this.window.getPosition()
    settingsManager.set('position', { x, y })
  }

  // Restore the last saved position if it still falls within some
  // currently-connected display; otherwise fall back to bottom-right of
  // the primary display (brief sections 9 & 10).
  private resolveStartPosition(): { x: number; y: number } {
    const saved = settingsManager.get('position')

    if (saved && this.isWithinAnyDisplay(saved.x, saved.y)) {
      return saved
    }

    const { workArea } = screen.getPrimaryDisplay()
    return {
      x: workArea.x + workArea.width - windowConfig.width - 40,
      y: workArea.y + workArea.height - windowConfig.height - 40
    }
  }

  private isWithinAnyDisplay(x: number, y: number): boolean {
    return screen.getAllDisplays().some(({ bounds }) => {
      return (
        x >= bounds.x &&
        y >= bounds.y &&
        x < bounds.x + bounds.width &&
        y < bounds.y + bounds.height
      )
    })
  }
}
