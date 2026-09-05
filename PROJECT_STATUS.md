# Little Horses — Project Status

Maintained per the project brief (section 30) so a fresh session can pick
up this project without the prior conversation history.

## Completed

- Phase 1 (Desktop Shell): Electron + TypeScript + Vite scaffold via
  `electron-vite`. Frameless, transparent, always-on-top-configurable
  `BrowserWindow` (`src/main/windowManager.ts`), quits fully on
  window-all-closed rather than lingering on macOS.
- Phase 2 (Three.js Renderer, partial): transparent `WebGLRenderer`
  (`alpha: true`), `OrthographicCamera`, ambient + directional lighting,
  a placeholder rotating box standing in for the horse mesh
  (`src/three/scene.ts`). Renders inside the transparent window with no
  visible rectangular background.
- Settings persistence via `electron-store` (`src/main/settings.ts`) —
  window position (with multi-monitor bounds validation) and
  always-on-top preference.
- Packaging config for both platforms in `package.json` ("build"),
  including a hardened-runtime + entitlements setup for macOS and an
  `afterSign` notarization hook (`build/notarize.js`) that no-ops when
  Apple credentials aren't present in the environment.
- Basic CI (`.github/workflows/build.yml`): typecheck on every push/PR,
  then a build matrix across macOS and Windows runners.

## Currently Working On

- Nothing in-flight — Phase 1/2 scaffold is the current checkpoint.

## Known Issues

- **Horse asset is a placeholder.** No `horse.glb` exists yet (brief
  "THE HORSE" section calls for a Higgsfield/Blender pipeline that is a
  manual 3D-artist workflow, not something this session can produce).
  `src/three/scene.ts` uses a plain rotating box so the rest of the
  architecture (renderer, camera, animation loop) can be built and
  tested now. Swapping in the real model later should only touch the
  model-loading code, not the animation/behavior controller — see
  "Architecture Decisions" below.
- **Not yet visually verified on a real desktop.** This scaffold has
  been written and typechecked, but hasn't yet been run/observed via
  `npm run dev` on an actual machine in this session. Do that before
  trusting the frameless/transparent window claims above.
- **No code signing configured yet.** `afterSign` / notarization only
  activates if `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, and
  `APPLE_TEAM_ID` are present (as CI secrets or local env vars). Windows
  code signing has no certificate wired in at all yet — packaged
  Windows builds will be unsigned until one is added to
  `.github/workflows/build.yml` / electron-builder config.
- Drag-to-reposition (brief section 9) is not implemented yet — the
  window is currently positioned only via saved settings /
  `resetPosition()`, no user dragging. CSS has `-webkit-app-region: drag`
  on the whole body as a first pass, but this hasn't been tested against
  Electron's frameless-window drag quirks on both platforms.
- No context menu (Phase 7), no animation/behavior state machine
  (Phase 4/5) yet.

## Next Steps

1. Run `npm install`, then `npm run dev`, and actually look at the
   result on real macOS (this project's linked test machine) — confirm
   frameless/transparent/always-on-top before moving on, per the brief's
   Phase 1 acceptance test.
2. Phase 3: horse asset integration once `horse.glb` exists — swap the
   placeholder box in `CompanionScene` for a `GLTFLoader` load, wire the
   rig's animation clips to `AnimationMixer`.
3. Phase 4/5: `AnimationController` + `BehaviorController` (currently
   not implemented at all).
4. Phase 6: real drag-to-reposition, verified on both platforms.
5. Phase 7: context menu (Always On Top, Size, Pause Animations, Launch
   at Startup, Reset Position, Quit).

## Architecture Decisions

- `electron-vite` chosen over hand-rolled Vite + tsc glue — it's the
  standard tool for exactly this Electron+TS+Vite combination and keeps
  `package.json` scripts simple, per the brief's "avoid dependencies
  unless they provide clear value."
- Folder layout follows the brief's section 22 structure as closely as
  electron-vite's conventions allow (`src/main`, `src/renderer`,
  `src/three`, `src/shared`, `src/ui` reserved for the Phase 7 context
  menu).
- `CompanionScene` takes a `<canvas>` and knows nothing about Electron —
  keeping desktop logic and 3D rendering separated (brief section 22's
  explicit instruction).
- Config values (window size, scale presets, camera framing, target FPS)
  live in `src/shared/config.ts`, not hardcoded inline (brief section 7).
- `WindowManager` is the only thing that touches `BrowserWindow`
  directly, so window-lifecycle logic doesn't leak into `main.ts`.

## Build Instructions

```
npm install
npm run dev        # development, with hot reload
npm run typecheck   # TypeScript check, no emit
npm run build       # production build to out/
npm run dist:mac    # packaged .dmg/.zip (macOS)
npm run dist:win    # packaged installer (Windows)
```
