# Coat Editor Visual Alignment Design

## Purpose

Make the `/coat-of-arms-maker` workbench visually consistent with the homepage Token Maker editor while preserving the Coat Maker's existing information architecture and every editor capability.

## Confirmed boundaries

- Keep the shared public site navigation exactly as it is.
- Start the visual change below that navigation: action bar, tool and asset panels, canvas stage, controls, and mobile drawer.
- Keep the existing desktop tool tree, library panel, scene, zoom controls, project library, export menu, mobile drawer, and all domain behavior in place.
- Do not change project data, undo/redo behavior, export formats, SVG rendering, or the output artboard's real background.
- Do not add dependencies, stage files, create a commit, or alter unrelated dirty worktree changes.

## Visual system

- Use the app's semantic dark-editor variables (`--background`, `--card`, `--foreground`, `--muted-foreground`, `--border`, `--primary`, `--destructive`) rather than the Coat Maker's separate Arial and hard-coded grey palette.
- Use the existing gold site accent for selected, focused, and primary states. Preserve red only for destructive/error feedback.
- Give action controls, search/input fields, asset cards, and the zoom controller the rounded borders, restrained translucency, and shadow depth used by the homepage editor.
- Turn the space around the artboard into the dark editor stage. Keep the artboard and its SVG/canvas output surface unchanged so the exported artwork is not recoloured.
- Preserve the current responsive breakpoints and current mobile drawer behavior.

## Implementation boundary

The expected production change is isolated to `src/app/globals.css`. The target component already carries stable semantic classes for every affected region; no domain or component logic should change unless CSS alone proves insufficient.

## Acceptance criteria

1. The workbench inherits the site font and dark semantic palette instead of the isolated Arial/grey skin.
2. The action bar, panels, asset controls, zoom controller, and selected/focused controls visibly use the same dark-and-gold language as the homepage editor.
3. The canvas surround is dark, while `.coat-target-artboard` and the inner rendered canvas retain their white output surface.
4. English and Chinese navigation, editor actions, project dialog, export menu, zoom, and mobile drawer remain usable.
5. Targeted tests, lint, production build, and desktop/mobile browser checks provide fresh verification evidence.
