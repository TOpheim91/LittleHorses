import Store from 'electron-store'
import { AppSettings, defaultSettings } from '@shared/config'

// Thin wrapper around electron-store so the rest of the main process
// doesn't need to know about the persistence mechanism (brief section 20).
class SettingsManager {
  private store = new Store<AppSettings>({
    name: 'little-horses-settings',
    defaults: defaultSettings
  })

  getAll(): AppSettings {
    return this.store.store
  }

  get<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.store.get(key)
  }

  set<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    this.store.set(key, value)
  }
}

export const settingsManager = new SettingsManager()
