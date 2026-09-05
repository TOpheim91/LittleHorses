import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { WindowManager } from './windowManager'

// Electron main process entry point (brief section 18, "Application
// Lifecycle"). Keep this file thin — window creation lives in
// WindowManager, settings live in SettingsManager.

const windowManager = new WindowManager()

function loadRenderer(window: BrowserWindow): void {
  const devServerUrl = process.env['ELECTRON_RENDERER_URL']

  if (devServerUrl) {
    window.loadURL(devServerUrl)
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createCompanion(): void {
  const window = windowManager.createWindow()
  loadRenderer(window)
}

app.whenReady().then(() => {
  createCompanion()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createCompanion()
    }
  })
})

// Quit fully on window close rather than leaving a background process,
// even on macOS where apps conventionally stay open (brief section 18).
app.on('window-all-closed', () => {
  app.quit()
})
