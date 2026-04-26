# Redesign Architecture Guide

## 1. Goal

This redesign turns the project from a starter Vite app into a real study surface for Kotlin dependency injection, feature bundles, billing architecture, platform mapping, and the surrounding Kotlin fundamentals that feed those topics.

The main constraint was important:

- We needed to improve the experience and structure without flattening or rewriting away the original lesson depth.

That led to a deliberate architecture choice:

- Keep the legacy lesson corpus as imported source content.
- Rebuild the interaction, navigation, responsive shell, and study tooling in React + TypeScript.

## 2. Source Material

Two separate codebases now feed the learning product.

### 2.1 Imported lesson surface

The original browser-learning surface came from:

- `/home/knight/Development/KOTLIN-FUNDAMENTALS-LESSONS/billing-di-learning-webapp-v2/src/content.js`
- `/home/knight/Development/KOTLIN-FUNDAMENTALS-LESSONS/billing-di-learning-webapp-v2/src/foundationsContent.js`
- `/home/knight/Development/KOTLIN-FUNDAMENTALS-LESSONS/billing-di-learning-webapp-v2/src/patternsContent.js`
- `/home/knight/Development/KOTLIN-FUNDAMENTALS-LESSONS/billing-di-learning-webapp-v2/src/comparisonsContent.js`
- `/home/knight/Development/KOTLIN-FUNDAMENTALS-LESSONS/billing-di-learning-webapp-v2/src/platformStartersContent.js`
- `/home/knight/Development/KOTLIN-FUNDAMENTALS-LESSONS/billing-di-learning-webapp-v2/src/importantConceptsContent.js`
- `/home/knight/Development/KOTLIN-FUNDAMENTALS-LESSONS/billing-di-learning-webapp-v2/src/masteryContent.js`
- `/home/knight/Development/KOTLIN-FUNDAMENTALS-LESSONS/billing-di-learning-webapp-v2/src/advancedContent.js`

These files were copied into `src/legacy/` so the React app could preserve the authored lesson HTML, code cards, diagram panels, and teaching structure.

### 2.2 Underlying Kotlin curriculum

The broader source project lives in:

- `/home/knight/Development/KOTLIN-FUNDAMENTALS-LESSONS/Kotlin-Fundamentals-Gradle`

This project contributed the wider topic map that the old webapp did not surface clearly enough. Examples include:

- `src/main/kotlin/Main.kt`
- `src/main/kotlin/SynchronousCode.kt`
- `src/main/kotlin/AsynchronousCode.kt`
- `src/main/kotlin/AsyncFunction.kt`
- `src/main/kotlin/ParallelDecomposition.kt`
- `src/main/kotlin/Dispatchers.kt`
- `src/main/kotlin/Exceptions.kt`
- `src/main/kotlin/Flows.kt`
- `src/main/kotlin/KClass.kt`
- `src/main/kotlin/SubclassOptInRequired.kt`
- `src/main/kotlin/interfaceAllowList/InterfaceAllowList.kt`
- `src/main/kotlin/di_factory_examples/DependencyInjectionPractice.kt`
- `src/main/kotlin/di_factory_examples/DependencyInjection2.kt`
- `src/main/kotlin/di_factory_examples/PasswordReset.kt`
- `src/main/kotlin/di_factory_examples/FactoryTrojanDefenseRealApp.kt`
- `src/main/kotlin/di_factory_examples/MonthlyReports.kt`

The redesign uses this project to populate the source atlas in `src/data/kotlinAtlas.ts`.

## 3. App Architecture

### 3.1 High-level flow

The new app uses this pipeline:

1. `src/legacy/` provides the authored lesson data.
2. `src/data/courseContent.ts` adds TypeScript-friendly interfaces over that imported content.
3. `src/lib/course-utils.ts` derives lesson metadata:
   grouping, summaries, search blobs, checklists, code extraction, and local-storage helpers.
4. `src/App.tsx` orchestrates:
   active lesson, navigation state, search, progress, bookmarks, theme, and layout composition.
5. `src/components/LegacyHtml.tsx` renders trusted lesson HTML and reattaches interactive behavior for:
   tabs, diagram state switches, copy buttons, and in-page scroll triggers.
6. `src/components/CourseSidebar.tsx` and `src/components/ContextPanel.tsx` provide the new study shell.

### 3.2 Why the legacy HTML was preserved

The original course already contained a large amount of authored instructional material. Rewriting all of that content into component-native JSX in one pass would have carried several risks:

- accidental content loss
- wording drift
- broken teaching structure
- much slower delivery of the redesign itself

Instead, the redesign treats the imported lesson HTML as trusted content and improves the product around it.

This is a content-preservation strategy, not a long-term limit. If you later want to migrate lesson sections into fully typed React content, the current shell still supports that evolution.

## 4. New React Components

### 4.1 `src/App.tsx`

This file now owns the top-level product behavior:

- active lesson selection via hash routing
- progress persistence
- bookmarked lessons
- theme persistence
- deferred search
- responsive workspace assembly
- home dashboard enrichment

It intentionally keeps state close to the shell because the app is still a single-study-surface product rather than a multi-route application.

### 4.2 `src/components/CourseSidebar.tsx`

Responsibilities:

- lesson search input
- grouped curriculum navigation
- saved-lesson shortcuts
- progress summary
- mobile drawer closing

This component is intentionally dumb about curriculum rules. It receives grouped views and callbacks from `App.tsx`.

### 4.3 `src/components/ContextPanel.tsx`

Responsibilities:

- lesson explanation bullets
- example/code preview tab
- interactive checklist tab
- source-project references
- architecture simulator

This right rail is where the redesign adds the most “study support” instead of only “content display.”

### 4.4 `src/components/LegacyHtml.tsx`

This is a key bridge component.

It renders the imported lesson HTML and uses delegated click handling to restore the legacy interaction model:

- `data-tab` groups
- `data-diagram-target` groups
- `data-copy-target` buttons
- `data-scroll-target` buttons

This means the old content continues to behave like authored courseware instead of becoming inert pasted HTML.

## 5. State Model

The redesign keeps state intentionally light and local.

### 5.1 Persisted state

Stored in `localStorage` through `src/lib/course-utils.ts`:

- `kotlin-learning-theme`
- `kotlin-learning-bookmarks`
- `kotlin-learning-visited-lessons`
- `kotlin-learning-last-lesson`
- `kotlin-learning-lesson-interactive-state`
- `kotlin-learning-lesson-scroll`
- `kotlin-learning-sidebar-scroll`
- `kotlin-learning-checklist`

The scroll state is stored per lesson and now keeps more than a raw pixel offset. It preserves:

- absolute scroll position
- normalized scroll progress
- the nearest anchored lesson section
- the offset within that anchored section
- the nearest content marker inside that section
- the offset within that content marker
- a short text signature for marker fallback matching

That combination makes reload restoration much more reliable when the lesson body arrives lazily or the layout settles in several passes.

The lesson view state is stored separately so tab groups and diagram groups can be restored before the scroll pass runs. That matters because a saved reading line may live inside a previously toggled panel that would otherwise stay hidden on reload.

The app also keeps a reload-focused `sessionStorage` snapshot under:

- `kotlin-learning-reload-scroll-snapshot`

That session snapshot captures the freshest same-tab lesson scroll state together with the sidebar scroll position, which gives page reloads a more accurate recovery path than the durable lesson map alone.

### 5.2 Derived state

Computed at runtime:

- grouped sidebar tracks
- completion percentage
- recommended next lesson
- lesson highlights
- lesson checklist items
- extracted code previews
- source-track mapping for the context panel

This keeps the stored data small and avoids unnecessary duplication.

## 6. Responsive Design Strategy

The redesign intentionally behaves like a study workspace across screen sizes.

### 6.1 Desktop

- sticky top command bar
- left navigation rail
- main lesson canvas
- right contextual study rail

### 6.2 Tablet

- same basic workspace shape
- context rail collapses below the lesson when width tightens

### 6.3 Mobile

- sidebar becomes a drawer
- main content remains readable and stacked
- right study rail becomes a lower section reached via the mobile dock
- bottom mobile dock adds fast actions for overview, lessons, search, study jump, and saving

This keeps the information architecture recognizable while still respecting smaller screens.

## 7. Styling Strategy

The redesign imports the old lesson styling baseline from:

- `src/course-base.css`
- `src/styles/immersive.css`
- `src/styles/learning-components.css`

Then `src/index.css` overrides the visual system to establish a new design direction:

- warm paper-like light theme as the default
- restrained dark theme
- green-blue-rust accent system instead of purple-first styling
- serif-forward headings for stronger identity
- cleaner command bar and dashboard styling
- updated cards, stepper, dock, tabs, and contextual panel treatments

This hybrid approach let us redesign the app without spending the whole task reauthoring every legacy content utility class.

## 8. Content Improvements Added

The redesign improves content discoverability, not only appearance.

### 8.1 Source atlas

`src/data/kotlinAtlas.ts` introduces a structured map of source topics:

- Kotlin core foundations
- coroutines and Flow
- reflection and controlled APIs
- factories/DI/containers/composition roots
- applied case studies

### 8.2 Study companion rail

The right rail now helps learners answer:

- What should I focus on in this lesson?
- Where is the code-heavy part?
- What checklist should I complete?
- Which Kotlin source files should I inspect next?

### 8.3 Architecture simulator

The small simulator in the context panel turns one of the most important DI lessons into something interactive:

- assembly mode choice
- shared vs isolated store behavior
- resulting architecture consequences

That is a practical improvement over the old surface, which mainly explained these ideas in prose.

## 9. Verification Summary

The redesign was checked with:

- TypeScript build:
  `tsc -b`
- ESLint:
  `eslint .`
- Vite production build:
  `vite build`

The local dev server was started successfully at:

- `http://127.0.0.1:4173/`

There was one environmental wrinkle during verification:

- The default shell did not expose Linux `node` or `npm`.
- A working Linux Node binary was found under:
  `/home/knight/.vscode-server/bin/10c8e557c8b9f9ed0a87f61f1c9a44bde731c409/node`
- The earlier bundled Windows Node runtime could lint/type-check under escalation, but Vite build required the Linux runtime because native bindings in `node_modules` were Linux-targeted.

For a deeper scroll-state analysis, see:

- [docs/scroll-state-audit.md](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/docs/scroll-state-audit.md)

## 10. Performance Architecture

The first redesign pass still bundled the lesson corpus too eagerly, which left the main Vite entry chunk much larger than it needed to be.

The app now uses a two-layer course-data model:

1. `src/data/courseManifest.ts`
   stores compact lesson metadata such as titles, summaries, grouping, and searchable text.
2. `src/data/courseContent.ts`
   loads the heavy lesson bodies lazily through dynamic `import()` calls, grouped by curriculum module.

To support that split cleanly:

- `src/legacy/coreCourseContent.js` now holds the core lessons that used to live inside the old all-in-one legacy file.
- `scripts/generate-course-artifacts.mjs` extracts those core lessons and generates the manifest automatically from the legacy lesson source.
- `src/App.tsx`, `src/components/CourseSidebar.tsx`, and `src/components/ContextPanel.tsx` now work primarily from summary metadata, loading full lesson content only when the active lesson actually needs to render.
- Hover and focus events on lesson navigation now prefetch the next lesson module so the app feels faster without forcing eager downloads.
- The app also runs a small predictive prefetch queue after the active lesson settles. It prioritizes the most likely next destinations:
  - the next and previous lessons
  - nearby lessons in the current track
  - the next track boundary when the learner is near the end of a section
  - the current recommendation from the overview flow

### 10.1 Why this queue is intentionally small

The goal is not to silently preload the whole curriculum again. That would erase the bundle-splitting benefit we just gained.

Instead, the queue is deliberately conservative:

- it waits until the active lesson is ready
- it staggers prefetch calls over short timeouts
- it skips work while the document is hidden
- it relies on the module cache in `src/data/courseContent.ts` so repeated predictions do not trigger duplicate loads

### 10.2 Build result

After the split:

- the main app entry chunk dropped to about `263.50 kB`
- the lesson corpus moved into separate chunks such as:
  - `foundationsContent`
  - `platformStartersContent`
  - `patternsContent`
  - `masteryContent`
  - `advancedContent`

This means the learning shell loads first, while the heavier lesson bodies arrive on demand.

## 11. Follow-on Improvements

If you want to deepen the product later, the best next steps are:

1. Migrate selected high-value lessons from HTML strings into fully typed React lesson objects.
2. Add a proper quiz/exercise engine rather than checklist-only lesson reinforcement.
3. Add lesson-level filtering by topic tags, difficulty, and source-project category.
4. Add scroll-depth or intent-aware prefetching so the queue can react to how close the learner is to the end of a long lesson body.
5. Add richer source-file references, including side-by-side code excerpts from the Kotlin project itself.

## 12. Files Most Worth Reading First

If you want to understand the redesign quickly, start here:

- [src/App.tsx](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/src/App.tsx)
- [src/components/ContextPanel.tsx](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/src/components/ContextPanel.tsx)
- [src/components/LegacyHtml.tsx](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/src/components/LegacyHtml.tsx)
- [src/lib/course-utils.ts](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/src/lib/course-utils.ts)
- [src/data/kotlinAtlas.ts](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/src/data/kotlinAtlas.ts)
- [src/index.css](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/src/index.css)
