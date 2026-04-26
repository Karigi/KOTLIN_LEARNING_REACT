# Kotlin Learning Studio

`KOTLIN_LEARNING_REACT` is the React + TypeScript redesign of the earlier `billing-di-learning-webapp-v2` course surface. The redesign keeps the deep lesson corpus from that project, imports it into a modern React shell, and expands the overview experience so the broader `Kotlin-Fundamentals-Gradle` source topics are easier to discover.

## What the redesign changes

- Replaces the Vite starter page with a full learning workspace.
- Preserves the original lesson corpus by importing the legacy lesson modules into `src/legacy/`.
- Adds a responsive app shell with:
  `lesson search`, `progress tracking`, `bookmarking`, `theme switching`, `mobile lesson dock`, `contextual study panel`, and `copyable/toggleable legacy lesson content`.
- Adds a source-project atlas so coroutines, reflection, sealed APIs, and applied case studies are surfaced alongside the DI/billing curriculum.
- Keeps the old content model intact while moving the interaction layer into React.

## Main user experience

The app is organized like a compact study workspace rather than a landing page:

- Left rail:
  curriculum navigation, lesson search, saved lessons, and progress summary.
- Center canvas:
  lesson overview, structured panels, code walkthroughs, and previous/next lesson paging.
- Right rail:
  explanation tab, examples tab, checklist tab, source-project references, and a small DI/billing architecture simulator.
- Mobile dock:
  overview, lesson drawer, search, study panel jump, and save actions.

## Project structure

```text
src/
  App.tsx                      Main React shell and lesson orchestration
  course-base.css              Imported legacy layout/content baseline
  components/
    ContextPanel.tsx           Right rail study panel and simulator
    CourseSidebar.tsx          Left rail navigation and search
    LegacyHtml.tsx             Event delegation for imported HTML content
    icons.tsx                  Inline SVG icon set and progress ring
  data/
    courseContent.ts           Typed access to imported legacy lessons
    kotlinAtlas.ts             Source-project topic atlas used by the redesign
  legacy/                      Imported lesson corpus from billing-di-learning-webapp-v2
  lib/
    course-utils.ts            Lesson grouping, summaries, search, storage helpers
  styles/
    immersive.css              Imported legacy content layout styles
    learning-components.css    Imported legacy content component styles
```

## Content sources

The redesign intentionally pulls from two sources:

1. Imported lesson surface:
   `src/legacy/content.js` and the related lesson modules copied from `billing-di-learning-webapp-v2`.
2. Underlying Kotlin teaching project:
   `/home/knight/Development/KOTLIN-FUNDAMENTALS-LESSONS/Kotlin-Fundamentals-Gradle/src/main/kotlin/...`

The second source now appears inside the app through the source-project atlas and the contextual study panel.

## Local development

Standard scripts:

```bash
npm run dev
npm run lint
npm run build
```

During this redesign pass, the code was validated with:

- TypeScript project build: `tsc -b`
- ESLint on the workspace
- Vite production build

The local dev server was also started successfully at:

```text
http://127.0.0.1:4173/
```

## Performance architecture

The lesson corpus is now code-split instead of being bundled eagerly into the first page load.

- `src/data/courseManifest.ts` contains lightweight searchable metadata for every lesson.
- `src/data/courseContent.ts` dynamically imports the lesson module for the active lesson group only when that content is needed.
- `src/legacy/coreCourseContent.js` isolates the core lessons that previously lived inside the big legacy aggregator.
- `scripts/generate-course-artifacts.mjs` regenerates the manifest and core-course module from the legacy source corpus.
- `src/App.tsx` now schedules a small predictive prefetch queue for likely next lessons so transitions stay fast without forcing the whole curriculum back into the initial bundle.

The practical result is that the main Vite entry chunk now carries the app shell and manifest, while the heavier lesson bodies load on demand.

## Extending the app

If you want to add new lessons or improve content:

1. Add or edit lesson modules under `src/legacy/` if you want to preserve the original content-builder format.
2. Update `src/data/kotlinAtlas.ts` when you want the dashboard and context panel to surface more source-project topics.
3. Extend `src/lib/course-utils.ts` when you need better summary extraction, grouping, or study heuristics.
4. Update `src/components/ContextPanel.tsx` when you want richer exercises, quizzes, or reference widgets.

## Deeper documentation

See [docs/redesign-architecture.md](/home/knight/Development/WEB-LESSONS/KOTLIN_LEARNING_REACT/docs/redesign-architecture.md) for the detailed walkthrough of architecture, state flow, content sourcing, responsive behavior, and improvement opportunities.
