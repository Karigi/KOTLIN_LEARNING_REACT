# Scroll State Audit

## Purpose

This document records how scroll persistence works in the Kotlin Learning Studio app after the latest reload hardening pass, which scenarios are covered, and what was verified during the fix.

The app has **two distinct scroll surfaces**:

1. **Lesson content scroll**
   - This is the main document scroll surface.
   - The content area is rendered in the page flow, so the app restores `window` scroll state for lesson reading.

2. **Sidebar/menu scroll**
   - This is the lesson navigation column.
   - The sidebar is its own scroll container because `.sidebar` uses `overflow: auto` and a fixed/sticky viewport-height layout in [src/course-base.css](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/src/course-base.css).

That separation matters because the browser does not treat those two surfaces the same way, and a reliable restore system has to manage both explicitly.

## Files Involved

- [src/App.tsx](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/src/App.tsx)
- [src/components/CourseSidebar.tsx](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/src/components/CourseSidebar.tsx)
- [src/components/LegacyHtml.tsx](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/src/components/LegacyHtml.tsx)
- [src/lib/course-utils.ts](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/src/lib/course-utils.ts)
- [src/course-base.css](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/src/course-base.css)

## Storage Model

The app now uses three complementary persistence layers for scroll-related state:

1. **Long-lived lesson scroll map**
   - Storage key: `kotlin-learning-lesson-scroll`
   - Medium: `localStorage`
   - Purpose:
     - preserve reading position per lesson across navigation
     - preserve reading position after a browser restart
     - act as the durable baseline for all lesson restore flows

2. **Long-lived sidebar scroll position**
   - Storage key: `kotlin-learning-sidebar-scroll`
   - Medium: `localStorage`
   - Purpose:
     - preserve the menu position across lesson switches
     - preserve the navigation column position across refreshes and reopening

3. **Reload-focused session snapshot**
   - Storage key: `kotlin-learning-reload-scroll-snapshot`
   - Medium: `sessionStorage`
   - Purpose:
     - capture the latest in-tab content scroll state
     - capture the latest sidebar scroll state
     - prefer the freshest same-tab reload data before falling back to longer-lived storage

The session snapshot exists because reload timing is harsher than normal lesson navigation. A page can refresh before the broader persistent state has the exact latest position, so the app now writes a dedicated same-tab snapshot that survives reload and restore within that browser tab.

## What Changed In The Reload Fix

### 1. Manual browser restoration remains enforced

The app keeps `history.scrollRestoration = "manual"` so the browser does not fight the app’s own restore logic. This aligns with MDN’s description of `History.scrollRestoration`, where `manual` means the page location is not restored automatically and the application takes responsibility for it.[^mdn-scroll-restoration]

### 2. Content scroll now has a dedicated reload snapshot

Before this pass, content scroll restoration depended mainly on the lesson scroll map plus lifecycle flushes.

Now the app also writes a **session-scoped reload snapshot** containing:

- `activeLessonId`
- `hash`
- `lessonScrollState`
- `sidebarScrollTop`
- `updatedAt`

That snapshot is refreshed whenever we persist lesson scroll or sidebar scroll, so a reload can recover from the freshest same-tab position instead of depending only on the durable map.

### 3. Sidebar scroll is now part of the same reload snapshot

The menu state is not treated as an afterthought anymore. The same reload snapshot also includes `sidebarScrollTop`, which means:

- the lesson content can reopen where the reader was
- the menu can reopen where the reader was browsing
- the active lesson can still be nudged into view if it would otherwise be hidden

### 4. Restore logic now reacts to real DOM changes

Timers alone are not enough for modern UIs with:

- lazy lesson loading
- dynamic sidebar filtering
- interactive tab/diagram restoration
- late layout settling
- font readiness changes

So the app now restores scroll not only on delayed timers, but also when layout-affecting changes are observed through:

- `MutationObserver`
- `ResizeObserver`

This makes the restore loop respond to actual DOM shifts instead of assuming the layout is stable after a fixed number of milliseconds.

### 5. Active lesson visibility in the menu is now protected

The sidebar restore path now keeps the saved scroll position **and** ensures the current lesson’s nav item is visible within the scroll container. It only nudges the menu when the active lesson would otherwise be off-screen.

That gives us better behavior than either extreme:

- not moving the menu at all, which can hide the active lesson
- aggressively jumping the menu to the active lesson every time, which destroys the user’s browsing context

## Content Scroll State Model

Each lesson stores a structured scroll state instead of a raw top offset alone:

- `top`
- `progress`
- `anchorId`
- `anchorOffset`
- `markerId`
- `markerOffset`
- `markerSignature`
- `updatedAt`

This gives the app several fallback levels:

1. exact content marker
2. text-signature match inside the saved section
3. saved section anchor plus offset
4. normalized page progress
5. raw top offset

That design helps the restore path remain stable even when lesson layout shifts slightly above the reader’s previous position.

## Sidebar Scroll State Model

The sidebar scroll system is intentionally simpler because it is a single scrollable container:

- current `scrollTop` is captured
- `scrollTop` is persisted in `localStorage`
- the latest same-tab `scrollTop` is mirrored into the reload snapshot
- the restore path clamps the value to the current sidebar height
- the active lesson is made visible if the saved position would hide it

## Save Triggers

### Content scroll save triggers

Lesson content scroll is persisted on:

- `scroll`
- `pagehide`
- `beforeunload`
- `visibilitychange` when the document becomes hidden

This combines a frequent incremental save path with explicit flushes when the page lifecycle changes. MDN notes that `visibilitychange` is the best end-of-session signal, with `pagehide` as the next-best alternative for unload-style detection.[^mdn-pagehide]

### Sidebar scroll save triggers

Sidebar/menu scroll is persisted on:

- sidebar `scroll`
- `pagehide`
- `beforeunload`
- `visibilitychange` when the document becomes hidden

The sidebar path mirrors the content path so both scroll surfaces are refreshed consistently.

## Restore Triggers

### Content restore triggers

When lesson content is ready, the app schedules restore attempts:

- immediately
- after short timed retries
- after `window.load`
- after font readiness resolves
- after DOM mutations inside `.content-main`
- after size changes in `.content-main`

### Sidebar restore triggers

Sidebar restore runs:

- immediately on lesson/search/menu state changes
- after short timed retries
- after sidebar DOM mutations
- after sidebar size changes

## Scenario Audit Matrix

### Scenario 1: Navigate from lesson A to lesson B for the first time

Expected behavior:

- lesson A position is saved before leaving
- lesson B opens at the top if no prior state exists
- sidebar keeps the user’s navigation browsing position

Coverage status:

- implemented
- code-audited

Primary code paths:

- [src/App.tsx](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/src/App.tsx)

### Scenario 2: Navigate back from lesson B to lesson A

Expected behavior:

- lesson A restores to the saved reading position
- section-local markers are preferred over raw offsets
- sidebar remains in the reader’s browsing area

Coverage status:

- implemented
- code-audited

### Scenario 3: Reload the current lesson while deep in the page

Expected behavior:

- the current lesson reloads
- the same-tab session snapshot seeds the freshest lesson scroll state
- the restore path retries until lazy content and layout settle

Coverage status:

- implemented
- code-audited
- strengthened in this pass

### Scenario 4: Reload after switching to a non-default lesson tab/diagram subsection

Expected behavior:

- the saved tab/diagram state restores first
- the scroll restoration then targets the correct revealed content

Coverage status:

- implemented
- code-audited

### Scenario 5: Switch lessons, then use browser Back/Forward

Expected behavior:

- hash-driven lesson selection changes correctly
- the app uses manual restoration instead of relying on browser default history scroll
- stored lesson scroll is restored by the app

Coverage status:

- implemented
- code-audited

### Scenario 6: Close and reopen the mobile menu

Expected behavior:

- sidebar scroll position stays intact
- active lesson remains visible if it would otherwise be clipped

Coverage status:

- implemented
- code-audited

### Scenario 7: Scroll the sidebar deep into the lesson list, then reload

Expected behavior:

- sidebar scroll restores from the reload snapshot or long-lived sidebar storage
- active lesson remains visible within the restored position

Coverage status:

- implemented
- code-audited
- strengthened in this pass

### Scenario 8: Search/filter the sidebar while it is scrolled

Expected behavior:

- sidebar restore retries when the filtered DOM changes
- restored menu position is clamped to the new scroll height
- active lesson can still be revealed if the filtered structure changes its visibility

Coverage status:

- implemented
- code-audited
- strengthened in this pass with DOM-observer restore retries

### Scenario 9: Lesson layout changes after restore due to lazy content or late layout settling

Expected behavior:

- restore is retried on timed passes
- restore is retried after DOM mutation/resize activity
- the final position converges closer to the intended reading location

Coverage status:

- implemented
- code-audited
- strengthened in this pass

### Scenario 10: Reload home/overview instead of a lesson

Expected behavior:

- the overview route restores by normalized progress/top fallback because it has no lesson section markers
- sidebar/menu state still restores independently

Coverage status:

- implemented
- code-audited

## Verification Performed

The following checks were completed after the fix:

1. TypeScript build:
   - `/home/knight/.vscode-server/bin/10c8e557c8b9f9ed0a87f61f1c9a44bde731c409/node node_modules/typescript/bin/tsc -b`
   - result: passed

2. ESLint:
   - `/home/knight/.vscode-server/bin/10c8e557c8b9f9ed0a87f61f1c9a44bde731c409/node node_modules/eslint/bin/eslint.js .`
   - result: passed

3. Production build:
   - `/home/knight/.vscode-server/bin/10c8e557c8b9f9ed0a87f61f1c9a44bde731c409/node node_modules/vite/bin/vite.js build`
   - result: passed

4. Local HTTP availability:
   - `curl -I http://127.0.0.1:4173/`
   - result: `HTTP/1.1 200 OK`

## Verification Limits

One important limit remains:

- the Codex in-app browser automation runtime was not exposed as a callable tool in this session
- the older Chrome remote-debug fallback also was not usable enough here for a scripted scroll-deep -> reload -> assert-position loop

So the verification in this pass is:

- **strong at the code-path level**
- **strong at the build/integration level**
- **honest but not fully automated at the browser-interaction level**

That means the implementation is materially improved and internally coherent, but the final confidence bump still comes from live manual interaction in a browser.

## Manual Spot-Check Checklist

Use this checklist when you want to confirm behavior interactively:

1. Open a lesson.
2. Scroll near the middle or bottom.
3. Reload the page.
4. Confirm the content returns close to the same reading line.
5. Switch to a different lesson.
6. Return to the original lesson.
7. Confirm the original lesson restores to the earlier reading point.
8. Scroll the sidebar deep into the list.
9. Reload again.
10. Confirm the sidebar reopens at the same area and the active lesson remains visible.
11. Open a lesson with tabbed/diagram content.
12. Change the active tab/diagram.
13. Scroll inside that subsection.
14. Reload.
15. Confirm both the interactive subsection and the reading position restore.

## References

[^mdn-scroll-restoration]: MDN, "History: scrollRestoration property." https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration
[^mdn-pagehide]: MDN, "Window: pagehide event." https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
[^mdn-session-storage]: MDN, "Window: sessionStorage property." https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
[^mdn-resize-observer]: MDN, "ResizeObserver." https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
