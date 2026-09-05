// electron-builder afterSign hook. Notarizes macOS builds when Apple
// credentials are present in the environment; skips quietly otherwise
// so unsigned local/dev builds keep working (brief section "Public
// Distribution Requirement": leave the hook wired, don't require it).
//
// Expects, when notarizing for real:
//   APPLE_ID                    - developer Apple ID email
//   APPLE_APP_SPECIFIC_PASSWORD - app-specific password (not the account password)
//   APPLE_TEAM_ID                - Apple Developer Team ID
const { notarize } = require('@electron/notarize')

module.exports = async function notarizeMac(context) {
  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== 'darwin') return

  const { APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, APPLE_TEAM_ID } = process.env
  if (!APPLE_ID || !APPLE_APP_SPECIFIC_PASSWORD || !APPLE_TEAM_ID) {
    console.log('[notarize] Apple credentials not set — skipping notarization.')
    return
  }

  const appName = context.packager.appInfo.productFilename

  await notarize({
    appBundleId: 'com.spavision.littlehorses',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: APPLE_ID,
    appleIdPassword: APPLE_APP_SPECIFIC_PASSWORD,
    teamId: APPLE_TEAM_ID
  })

  console.log('[notarize] Notarization complete.')
}
