import {
  useCallback,
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { ContextPanel } from './components/ContextPanel'
import { CourseSidebar } from './components/CourseSidebar'
import { LegacyHtml } from './components/LegacyHtml'
import {
  BookIcon,
  BookmarkIcon,
  CodeIcon,
  CompassIcon,
  LayersIcon,
  MenuIcon,
  MoonIcon,
  ProgressRing,
  SearchIcon,
  SunIcon,
} from './components/icons'
import { loadCourseView, prefetchCourseView, views, type CourseView, type CourseViewSummary } from './data/courseContent'
import { sourceTracks, type SourceTrack } from './data/kotlinAtlas'
import {
  createSearchBlob,
  extractChecklistItems,
  extractCodeBlocks,
  extractLessonHighlights,
  getHashLessonId,
  getNextLesson,
  getPreviousLesson,
  getSidebarGroups,
  inferGroup,
  inferLevel,
  inferSourceSample,
  inferSummary,
  inferTime,
  prepareSections,
  readInitialTheme,
  readSessionJson,
  readStoredJson,
  storageKeys,
  writeSessionJson,
  writeStoredJson,
} from './lib/course-utils'

const lessonIds = new Set(views.map((view) => view.id))
const LESSON_SCROLL_ANCHOR_OFFSET = 120
const LESSON_SCROLL_MARKER_SELECTOR = '[data-scroll-marker-id]'

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

interface LessonScrollState {
  anchorId?: string
  anchorOffset?: number
  markerId?: string
  markerOffset?: number
  markerSignature?: string
  progress: number
  top: number
  updatedAt: number
}

interface ReloadScrollSnapshot {
  activeLessonId: string
  hash: string
  lessonScrollState: LessonScrollState
  sidebarScrollTop: number
  updatedAt: number
}

interface AnchorSnapshot {
  anchorElement?: HTMLElement
  anchorId?: string
  anchorOffset?: number
}

function clampScrollTop(top: number, scrollableHeight: number) {
  return Math.min(Math.max(0, Math.round(top)), scrollableHeight)
}

function clampElementScrollTop(top: number, scrollableHeight: number) {
  return Math.min(Math.max(0, Math.round(top)), scrollableHeight)
}

function getWindowScrollTop() {
  return Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop, 0)
}

function normalizeMarkerSignature(value: string | null | undefined) {
  return value?.replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 180) || ''
}

function getElementDocumentTop(element: HTMLElement) {
  return getWindowScrollTop() + element.getBoundingClientRect().top
}

function getDocumentScrollMetrics() {
  const documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
  const scrollableHeight = Math.max(0, documentHeight - window.innerHeight)
  const scrollTop = clampScrollTop(getWindowScrollTop(), scrollableHeight)

  return {
    documentHeight,
    scrollTop,
    scrollableHeight,
  }
}

function getElementScrollMetrics(element: HTMLElement) {
  const scrollableHeight = Math.max(0, element.scrollHeight - element.clientHeight)

  return {
    scrollTop: clampElementScrollTop(element.scrollTop, scrollableHeight),
    scrollableHeight,
  }
}

function normalizeStoredLessonScrollMap(rawValue: Record<string, number | Partial<LessonScrollState>>) {
  const normalizedEntries: Array<[string, LessonScrollState]> = []

  Object.entries(rawValue).forEach(([lessonId, scrollState]) => {
    if (typeof scrollState === 'number') {
      normalizedEntries.push([
        lessonId,
        {
          progress: 0,
          top: Math.max(0, Math.round(scrollState)),
          updatedAt: 0,
        },
      ])
      return
    }

    if (!scrollState || typeof scrollState !== 'object') {
      return
    }

    normalizedEntries.push([
      lessonId,
      {
        anchorId: typeof scrollState.anchorId === 'string' && scrollState.anchorId ? scrollState.anchorId : undefined,
        anchorOffset:
          typeof scrollState.anchorOffset === 'number' ? Math.max(0, Math.round(scrollState.anchorOffset)) : undefined,
        markerId: typeof scrollState.markerId === 'string' && scrollState.markerId ? scrollState.markerId : undefined,
        markerOffset:
          typeof scrollState.markerOffset === 'number' ? Math.max(0, Math.round(scrollState.markerOffset)) : undefined,
        markerSignature:
          typeof scrollState.markerSignature === 'string' && scrollState.markerSignature
            ? scrollState.markerSignature
            : undefined,
        progress:
          typeof scrollState.progress === 'number'
            ? Math.min(Math.max(scrollState.progress, 0), 1)
            : 0,
        top: Math.max(0, Math.round(scrollState.top || 0)),
        updatedAt: typeof scrollState.updatedAt === 'number' ? scrollState.updatedAt : 0,
      },
    ])
  })

  return Object.fromEntries(normalizedEntries) as Record<string, LessonScrollState>
}

function readInitialLessonScrollMap() {
  if (typeof window === 'undefined') return {}

  return normalizeStoredLessonScrollMap(
    readStoredJson<Record<string, number | Partial<LessonScrollState>>>(storageKeys.lessonScroll, {}),
  )
}

function normalizeReloadScrollSnapshot(rawValue: unknown, validIds: Set<string>): ReloadScrollSnapshot | null {
  if (!rawValue || typeof rawValue !== 'object') return null

  const candidate = rawValue as Partial<ReloadScrollSnapshot> & {
    lessonScrollState?: number | Partial<LessonScrollState>
  }
  if (typeof candidate.activeLessonId !== 'string' || !validIds.has(candidate.activeLessonId)) {
    return null
  }

  const normalizedScrollMap = normalizeStoredLessonScrollMap({
    [candidate.activeLessonId]: candidate.lessonScrollState || candidate.lessonScrollState === 0 ? candidate.lessonScrollState : {},
  })
  const lessonScrollState = normalizedScrollMap[candidate.activeLessonId]
  if (!lessonScrollState) return null

  return {
    activeLessonId: candidate.activeLessonId,
    hash: typeof candidate.hash === 'string' ? candidate.hash : `#/${candidate.activeLessonId}`,
    lessonScrollState,
    sidebarScrollTop:
      typeof candidate.sidebarScrollTop === 'number' ? Math.max(0, Math.round(candidate.sidebarScrollTop)) : 0,
    updatedAt: typeof candidate.updatedAt === 'number' ? candidate.updatedAt : 0,
  }
}

function readInitialScrollRuntimeState() {
  if (typeof window === 'undefined') {
    return {
      lessonScrollMap: {} as Record<string, LessonScrollState>,
      reloadSnapshot: null as ReloadScrollSnapshot | null,
      sidebarScrollTop: 0,
    }
  }

  const lessonScrollMap = readInitialLessonScrollMap()
  const reloadSnapshot = normalizeReloadScrollSnapshot(
    readSessionJson<unknown>(storageKeys.reloadScrollSnapshot, null),
    lessonIds,
  )

  if (reloadSnapshot) {
    lessonScrollMap[reloadSnapshot.activeLessonId] = reloadSnapshot.lessonScrollState
  }

  return {
    lessonScrollMap,
    reloadSnapshot,
    sidebarScrollTop: reloadSnapshot?.sidebarScrollTop ?? readStoredJson<number>(storageKeys.sidebarScroll, 0),
  }
}

function getActiveAnchorSnapshot(scrollTop: number): AnchorSnapshot {
  const sectionElements = Array.from(document.querySelectorAll<HTMLElement>('.anchored-section[id]'))
  let activeAnchorElement: HTMLElement | undefined
  let activeAnchorId: string | undefined
  let activeAnchorOffset: number | undefined

  sectionElements.forEach((sectionElement) => {
    const sectionTop = getElementDocumentTop(sectionElement)
    if (sectionTop <= scrollTop + LESSON_SCROLL_ANCHOR_OFFSET) {
      activeAnchorElement = sectionElement
      activeAnchorId = sectionElement.id
      activeAnchorOffset = Math.max(0, Math.round(scrollTop - sectionTop))
    }
  })

  return {
    anchorElement: activeAnchorElement,
    anchorId: activeAnchorId,
    anchorOffset: activeAnchorOffset,
  }
}

function getActiveMarkerSnapshot(scrollTop: number, anchorElement?: HTMLElement) {
  if (!anchorElement) {
    return {
      markerId: undefined,
      markerOffset: undefined,
      markerSignature: undefined,
    }
  }

  const markerElements = Array.from(anchorElement.querySelectorAll<HTMLElement>(LESSON_SCROLL_MARKER_SELECTOR))
  let activeMarkerElement: HTMLElement | undefined
  let activeMarkerOffset: number | undefined

  markerElements.forEach((markerElement) => {
    const markerTop = getElementDocumentTop(markerElement)
    if (markerTop <= scrollTop + LESSON_SCROLL_ANCHOR_OFFSET) {
      activeMarkerElement = markerElement
      activeMarkerOffset = Math.max(0, Math.round(scrollTop - markerTop))
    }
  })

  return {
    markerId: activeMarkerElement?.dataset.scrollMarkerId,
    markerOffset: activeMarkerOffset,
    markerSignature: normalizeMarkerSignature(activeMarkerElement?.textContent),
  }
}

function buildLessonScrollState(scrollTop: number): LessonScrollState {
  const { scrollableHeight } = getDocumentScrollMetrics()
  const nextScrollTop = clampScrollTop(scrollTop, scrollableHeight)
  const activeAnchorSnapshot = getActiveAnchorSnapshot(nextScrollTop)

  return {
    anchorId: activeAnchorSnapshot.anchorId,
    anchorOffset: activeAnchorSnapshot.anchorOffset,
    ...getActiveMarkerSnapshot(nextScrollTop, activeAnchorSnapshot.anchorElement),
    progress: scrollableHeight > 0 ? Number((nextScrollTop / scrollableHeight).toFixed(4)) : 0,
    top: nextScrollTop,
    updatedAt: Date.now(),
  }
}

function ensureElementVisibleWithinScrollContainer(container: HTMLElement, element: HTMLElement | null | undefined) {
  if (!element) return

  const containerRect = container.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()
  const isFullyVisible =
    elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom

  if (!isFullyVisible) {
    element.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }
}

function readInitialLessonId() {
  const hashedLessonId = getHashLessonId(lessonIds)
  if (hashedLessonId) return hashedLessonId
  if (typeof window === 'undefined') return 'home'
  const storedLessonId = readStoredJson(storageKeys.lastLesson, 'home')
  return lessonIds.has(storedLessonId) ? storedLessonId : 'home'
}

function matchSourceTrack(view: CourseViewSummary): SourceTrack {
  const group = inferGroup(view)
  const id = view.id

  if (id === 'home') return sourceTracks[0]
  if (group === 'Foundations') return sourceTracks[3]
  if (group === 'Platform mapping') return sourceTracks[4]
  if (['decision-guide', 'real-life-scenarios', 'anti-patterns', 'production-readiness'].includes(id)) {
    return sourceTracks[4]
  }
  return sourceTracks[3]
}

function HomeDashboard({
  bookmarksCount,
  currentTrack,
  featuredLessons,
  nextLesson,
  onSelectLesson,
  onPrefetchLesson,
  plannedTracks,
  visitedCount,
}: {
  bookmarksCount: number
  currentTrack: SourceTrack
  featuredLessons: CourseViewSummary[]
  nextLesson: CourseViewSummary | null
  onSelectLesson: (lessonId: string) => void
  onPrefetchLesson: (lessonId: string) => void
  plannedTracks: SourceTrack[]
  visitedCount: number
}) {
  return (
    <section className="home-dashboard">
      <div className="insight-grid">
        <article className="insight-card">
          <div className="kicker">Current live section</div>
          <h3>{nextLesson?.title || 'Continue through the curriculum'}</h3>
          <p>
            {nextLesson
              ? `Continue with ${nextLesson.navLabel} inside the Dependency Injection and Containers section to build on the current path without losing momentum.`
              : 'You have reached the end of the current live section. Revisit the advanced pages and compare architecture decisions side by side.'}
          </p>
        </article>

        <article className="insight-card">
          <div className="kicker">Course framing</div>
          <h3>{bookmarksCount} bookmarked lessons</h3>
          <p>Use bookmarks to collect the DI and container lessons you want to revisit while the rest of the Kotlin curriculum is added in later passes.</p>
        </article>

        <article className="insight-card">
          <div className="kicker">Kotlin roadmap</div>
          <h3>{visitedCount} lessons visited</h3>
          <p>The current app goes deep on DI and containers first, while the broader Kotlin roadmap is already scaffolded so more topics can be folded in cleanly.</p>
        </article>
      </div>

      <section className="panel home-track-panel">
        <div className="section-kicker">Current live section</div>
        <div className="home-track-grid">
          <article className="home-track-card">
            <h2>{currentTrack.title}</h2>
            <p>{currentTrack.summary}</p>
            <ul className="atlas-list">
              {currentTrack.focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="home-track-meta">
              <span className="status-pill current">Live now</span>
              <span className="atlas-note">{currentTrack.files[0]?.path}</span>
            </div>
          </article>

          <article className="home-lesson-list">
            <div className="kicker">Suggested starting path</div>
            <div className="home-lesson-grid">
              {featuredLessons.map((lesson) => (
                <button
                  className="home-lesson-card"
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson.id)}
                  onFocus={() => onPrefetchLesson(lesson.id)}
                  onMouseEnter={() => onPrefetchLesson(lesson.id)}
                  type="button"
                >
                  <div className="home-lesson-top">
                    <strong>{lesson.navLabel}</strong>
                    <span className="meta-pill">{inferLevel(lesson)}</span>
                  </div>
                  <p>{inferSummary(lesson)}</p>
                </button>
              ))}
            </div>
            {nextLesson ? (
              <button
                className="home-primary-action"
                onClick={() => onSelectLesson(nextLesson.id)}
                onFocus={() => onPrefetchLesson(nextLesson.id)}
                onMouseEnter={() => onPrefetchLesson(nextLesson.id)}
                type="button"
              >
                Continue with {nextLesson.navLabel}
              </button>
            ) : null}
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="section-kicker">Source project atlas</div>
        <h2>Topics staged from Kotlin-Fundamentals-Gradle</h2>
        <p>
          The original webapp was heavily focused on DI and billing. The redesign adds a clearer atlas so the broader source project topics are visible instead of staying buried inside Kotlin files and long comments.
        </p>

        <div className="atlas-grid">
          {[currentTrack, ...plannedTracks].map((track) => (
            <article className="atlas-card" key={track.id}>
              <div className="atlas-card-top">
                <div className="kicker">{track.title}</div>
                <span className={`status-pill ${track.status}`}>{track.status === 'current' ? 'Live now' : 'Planned'}</span>
              </div>
              <p>{track.summary}</p>
              <ul className="atlas-list">
                {track.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="atlas-note">{track.files[0]?.path}</div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

function LessonPager({
  compact = false,
  nextLesson,
  onSelectLesson,
  onPrefetchLesson,
  previousLesson,
}: {
  compact?: boolean
  nextLesson: CourseViewSummary | null
  onSelectLesson: (lessonId: string) => void
  onPrefetchLesson: (lessonId: string) => void
  previousLesson: CourseViewSummary | null
}) {
  return (
    <section aria-label="Lesson pagination" className={`lesson-pager ${compact ? 'lesson-pager-shortcut' : ''}`}>
      {previousLesson ? (
        <button
          aria-label={`Go to previous lesson: ${previousLesson.navLabel}`}
          className="pager-card"
          onFocus={() => onPrefetchLesson(previousLesson.id)}
          onMouseEnter={() => onPrefetchLesson(previousLesson.id)}
          onClick={() => onSelectLesson(previousLesson.id)}
          type="button"
        >
          <small>Previous lesson</small>
          <strong>{previousLesson.navLabel}</strong>
          <span>
            {inferGroup(previousLesson)} · {inferLevel(previousLesson)}
          </span>
        </button>
      ) : (
        <div className="pager-card ghost">
          <small>Previous lesson</small>
          <strong>You are at the start</strong>
          <span>Use the sidebar or search to jump anywhere in the course.</span>
        </div>
      )}

      {nextLesson ? (
        <button
          aria-label={`Go to next lesson: ${nextLesson.navLabel}`}
          className="pager-card"
          onFocus={() => onPrefetchLesson(nextLesson.id)}
          onMouseEnter={() => onPrefetchLesson(nextLesson.id)}
          onClick={() => onSelectLesson(nextLesson.id)}
          type="button"
        >
          <small>Next lesson</small>
          <strong>{nextLesson.navLabel}</strong>
          <span>
            {inferGroup(nextLesson)} · {inferLevel(nextLesson)}
          </span>
        </button>
      ) : (
        <div className="pager-card ghost">
          <small>Next lesson</small>
          <strong>You reached the end</strong>
          <span>Revisit the applied case studies and compare your own architecture choices.</span>
        </div>
      )}
    </section>
  )
}

function appendPrefetchCandidate(candidateIds: string[], seenIds: Set<string>, lessonId?: string | null) {
  if (!lessonId || seenIds.has(lessonId)) return
  seenIds.add(lessonId)
  candidateIds.push(lessonId)
}

function buildPredictivePrefetchPlan({
  activeLessonId,
  activeTrackIndex,
  activeTrackStep,
  activeTrackViews,
  featuredLessons,
  groupedTracks,
  nextLesson,
  previousLesson,
  recommendedLesson,
}: {
  activeLessonId: string
  activeTrackIndex: number
  activeTrackStep: number
  activeTrackViews: CourseViewSummary[]
  featuredLessons: CourseViewSummary[]
  groupedTracks: ReturnType<typeof getSidebarGroups>
  nextLesson: CourseViewSummary | null
  previousLesson: CourseViewSummary | null
  recommendedLesson: CourseViewSummary | null
}) {
  const candidateIds: string[] = []
  const seenIds = new Set([activeLessonId])

  if (activeLessonId === 'home') {
    appendPrefetchCandidate(candidateIds, seenIds, recommendedLesson?.id)
    featuredLessons.slice(0, 3).forEach((lesson) => {
      appendPrefetchCandidate(candidateIds, seenIds, lesson.id)
    })
    return candidateIds
  }

  const previousTrack = activeTrackIndex > 0 ? groupedTracks[activeTrackIndex - 1] : null
  const nextTrack = activeTrackIndex < groupedTracks.length - 1 ? groupedTracks[activeTrackIndex + 1] : null
  const previousTrackTail = previousTrack ? previousTrack.items[previousTrack.items.length - 1] : null

  appendPrefetchCandidate(candidateIds, seenIds, nextLesson?.id)
  appendPrefetchCandidate(candidateIds, seenIds, previousLesson?.id)
  appendPrefetchCandidate(candidateIds, seenIds, activeTrackViews[activeTrackStep + 1]?.id)
  appendPrefetchCandidate(candidateIds, seenIds, activeTrackViews[activeTrackStep + 2]?.id)
  appendPrefetchCandidate(candidateIds, seenIds, activeTrackViews[activeTrackStep - 1]?.id)
  appendPrefetchCandidate(candidateIds, seenIds, recommendedLesson?.id)

  if (activeTrackStep <= 1) {
    appendPrefetchCandidate(candidateIds, seenIds, previousTrackTail?.id)
  }

  if (activeTrackStep >= activeTrackViews.length - 2) {
    appendPrefetchCandidate(candidateIds, seenIds, nextTrack?.items[0]?.id)
  }

  return candidateIds
}

function App() {
  const initialScrollRuntimeState = useMemo(() => readInitialScrollRuntimeState(), [])
  const [activeLessonId, setActiveLessonId] = useState(() => readInitialLessonId())
  const [theme, setTheme] = useState(readInitialTheme)
  const [searchValue, setSearchValue] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [loadedLessons, setLoadedLessons] = useState<Record<string, CourseView>>({})
  const [bookmarks, setBookmarks] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : readStoredJson<string[]>(storageKeys.bookmarks, []),
  )
  const [visitedLessons, setVisitedLessons] = useState<string[]>(() =>
    (() => {
      const firstLessonId = readInitialLessonId()
      if (typeof window === 'undefined') {
        return [firstLessonId]
      }

      const storedLessons = readStoredJson<string[]>(storageKeys.visitedLessons, ['home'])
      return storedLessons.includes(firstLessonId)
        ? storedLessons
        : [...storedLessons, firstLessonId]
    })(),
  )

  const deferredSearchValue = useDeferredValue(searchValue)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const contextPanelRef = useRef<HTMLDivElement>(null)
  const scrollStateRef = useRef<Record<string, LessonScrollState>>(initialScrollRuntimeState.lessonScrollMap)
  const sidebarScrollRef = useRef(initialScrollRuntimeState.sidebarScrollTop)
  const reloadSnapshotRef = useRef<ReloadScrollSnapshot | null>(initialScrollRuntimeState.reloadSnapshot)
  const pendingScrollModeRef = useRef<'restore' | 'top'>('restore')

  const searchIndex = useMemo(
    () =>
      views.map((view) => ({
        blob: createSearchBlob(view),
        view,
      })),
    [],
  )

  const filteredViews = useMemo(() => {
    const normalizedQuery = deferredSearchValue.trim().toLowerCase()
    if (!normalizedQuery) return views
    return searchIndex
      .filter((entry) => entry.blob.includes(normalizedQuery))
      .map((entry) => entry.view)
  }, [deferredSearchValue, searchIndex])

  const sidebarGroups = useMemo(() => getSidebarGroups(filteredViews), [filteredViews])
  const bookmarkViews = useMemo(() => views.filter((view) => bookmarks.includes(view.id)), [bookmarks])
  const viewedLessonSet = useMemo(() => new Set(visitedLessons), [visitedLessons])

  const activeLesson = views.find((view) => view.id === activeLessonId) || views[0]
  const activeLessonContent = loadedLessons[activeLesson.id] || null
  const hasActiveLessonLoaded = Boolean(loadedLessons[activeLesson.id])
  const activeLessonIndex = views.findIndex((view) => view.id === activeLesson.id)
  const activeGroup = inferGroup(activeLesson)
  const groupedTracks = useMemo(() => getSidebarGroups(views.filter((view) => view.id !== 'home')), [])
  const activeTrackIndex = groupedTracks.findIndex((group) => group.label === activeGroup)
  const activeTrackViews = views.filter((view) => inferGroup(view) === activeGroup)
  const activeTrackStep = activeTrackViews.findIndex((view) => view.id === activeLesson.id)
  const preparedSections = activeLessonContent ? prepareSections(activeLessonContent) : []

  const completion = Math.round((visitedLessons.length / views.length) * 100)
  const nextLesson = getNextLesson(activeLessonIndex, views)
  const previousLesson = getPreviousLesson(activeLessonIndex, views)
  const recommendedLesson =
    views.find((view) => view.id !== 'home' && !visitedLessons.includes(view.id)) || nextLesson || views[1] || null
  const sourceTrack = matchSourceTrack(activeLesson)
  const currentTrack = sourceTracks.find((track) => track.status === 'current') || sourceTracks[0]
  const plannedTracks = sourceTracks.filter((track) => track.status === 'planned')
  const featuredLessons = useMemo(() => views.filter((view) => view.id !== 'home').slice(0, 4), [])
  const highlights = activeLessonContent ? extractLessonHighlights(activeLessonContent) : [inferSummary(activeLesson)]
  const checklistItems = activeLessonContent ? extractChecklistItems(activeLessonContent) : []
  const codeBlocks = activeLessonContent ? extractCodeBlocks(activeLessonContent) : []
  const isBookmarked = bookmarks.includes(activeLesson.id)
  const isLessonContentReady = activeLesson.id === 'home' || Boolean(activeLessonContent)
  const isLessonLoading = activeLesson.id !== 'home' && !activeLessonContent
  const predictivePrefetchLessonIds = buildPredictivePrefetchPlan({
    activeLessonId: activeLesson.id,
    activeTrackIndex,
    activeTrackStep,
    activeTrackViews,
    featuredLessons,
    groupedTracks,
    nextLesson,
    previousLesson,
    recommendedLesson,
  })

  const rememberLesson = (lessonId: string) => {
    writeStoredJson(storageKeys.lastLesson, lessonId)
    setVisitedLessons((currentLessons) => {
      if (currentLessons.includes(lessonId)) return currentLessons
      return [...currentLessons, lessonId]
    })
  }

  const persistReloadScrollSnapshot = useCallback(
    (
      lessonId: string,
      {
        lessonScrollState,
        sidebarScrollTop,
      }: {
        lessonScrollState?: LessonScrollState
        sidebarScrollTop?: number
      } = {},
    ) => {
      if (typeof window === 'undefined') return
      const sidebarElement = sidebarRef.current
      const nextSidebarScrollTop =
        typeof sidebarScrollTop === 'number'
          ? sidebarScrollTop
          : sidebarElement
            ? getElementScrollMetrics(sidebarElement).scrollTop
            : sidebarScrollRef.current
      const nextSnapshot: ReloadScrollSnapshot = {
        activeLessonId: lessonId,
        hash: window.location.hash || `#/${lessonId}`,
        lessonScrollState: lessonScrollState ?? buildLessonScrollState(getWindowScrollTop()),
        sidebarScrollTop: nextSidebarScrollTop,
        updatedAt: Date.now(),
      }
      reloadSnapshotRef.current = nextSnapshot
      writeSessionJson(storageKeys.reloadScrollSnapshot, nextSnapshot)
    },
    [],
  )

  const persistLessonScroll = useCallback(
    (lessonId: string, scrollTop = (typeof window === 'undefined' ? 0 : getWindowScrollTop())) => {
      if (typeof window === 'undefined') return
      const nextScrollState = buildLessonScrollState(scrollTop)

      const currentScrollState = scrollStateRef.current[lessonId]
      if (
        currentScrollState &&
        currentScrollState.top === nextScrollState.top &&
        currentScrollState.progress === nextScrollState.progress &&
        currentScrollState.anchorId === nextScrollState.anchorId &&
        currentScrollState.anchorOffset === nextScrollState.anchorOffset &&
        currentScrollState.markerId === nextScrollState.markerId &&
        currentScrollState.markerOffset === nextScrollState.markerOffset &&
        currentScrollState.markerSignature === nextScrollState.markerSignature
      ) {
        return
      }

      scrollStateRef.current = {
        ...scrollStateRef.current,
        [lessonId]: nextScrollState,
      }
      writeStoredJson(storageKeys.lessonScroll, scrollStateRef.current)
      persistReloadScrollSnapshot(lessonId, { lessonScrollState: nextScrollState })
    },
    [persistReloadScrollSnapshot],
  )

  const persistSidebarScroll = useCallback((scrollTop?: number) => {
    const sidebarElement = sidebarRef.current
    if (!sidebarElement) return

    const { scrollableHeight } = getElementScrollMetrics(sidebarElement)
    const nextScrollTop = clampElementScrollTop(scrollTop ?? sidebarElement.scrollTop, scrollableHeight)
    if (sidebarScrollRef.current === nextScrollTop) return

    sidebarScrollRef.current = nextScrollTop
    writeStoredJson(storageKeys.sidebarScroll, nextScrollTop)
    persistReloadScrollSnapshot(activeLessonId, { sidebarScrollTop: nextScrollTop })
  }, [activeLessonId, persistReloadScrollSnapshot])

  const queueScrollMode = (lessonId: string) => {
    pendingScrollModeRef.current = scrollStateRef.current[lessonId] ? 'restore' : 'top'
  }

  const resolveStoredScrollTop = useEffectEvent((lessonId: string) => {
    const storedScrollState = scrollStateRef.current[lessonId]
    if (!storedScrollState) return 0

    const { scrollableHeight } = getDocumentScrollMetrics()
    let nextScrollTop = storedScrollState.top

    if (storedScrollState.markerId) {
      const markerElement = document.querySelector<HTMLElement>(
        `${LESSON_SCROLL_MARKER_SELECTOR}[data-scroll-marker-id="${storedScrollState.markerId}"]`,
      )

      if (markerElement) {
        nextScrollTop = getElementDocumentTop(markerElement) + (storedScrollState.markerOffset || 0)
        return clampScrollTop(nextScrollTop, scrollableHeight)
      }
    }

    if (storedScrollState.anchorId) {
      const anchorElement = document.getElementById(storedScrollState.anchorId)
      if (anchorElement) {
        if (storedScrollState.markerSignature) {
          const fallbackMarkerElement = Array.from(
            anchorElement.querySelectorAll<HTMLElement>(LESSON_SCROLL_MARKER_SELECTOR),
          ).find(
            (markerElement) => normalizeMarkerSignature(markerElement.textContent) === storedScrollState.markerSignature,
          )

          if (fallbackMarkerElement) {
            nextScrollTop =
              getElementDocumentTop(fallbackMarkerElement) + (storedScrollState.markerOffset || 0)
            return clampScrollTop(nextScrollTop, scrollableHeight)
          }
        }

        nextScrollTop = getElementDocumentTop(anchorElement) + (storedScrollState.anchorOffset || 0)
      } else if (storedScrollState.progress > 0 && scrollableHeight > 0) {
        nextScrollTop = storedScrollState.progress * scrollableHeight
      }
    } else if (storedScrollState.progress > 0 && scrollableHeight > 0) {
      nextScrollTop = storedScrollState.progress * scrollableHeight
    }

    return clampScrollTop(nextScrollTop, scrollableHeight)
  })

  const restoreSidebarScroll = useEffectEvent(() => {
    const sidebarElement = sidebarRef.current
    if (!sidebarElement) return

    const { scrollableHeight } = getElementScrollMetrics(sidebarElement)
    const nextScrollTop = clampElementScrollTop(sidebarScrollRef.current, scrollableHeight)
    sidebarElement.scrollTop = nextScrollTop
    ensureElementVisibleWithinScrollContainer(
      sidebarElement,
      sidebarElement.querySelector<HTMLElement>('[aria-current="page"]'),
    )
  })

  const navigateToLesson = (lessonId: string) => {
    if (!lessonIds.has(lessonId)) return
    if (lessonId === activeLessonId) {
      setMenuOpen(false)
      return
    }

    persistLessonScroll(activeLessonId)
    queueScrollMode(lessonId)
    prefetchCourseView(lessonId)
    setMenuOpen(false)
    startTransition(() => {
      setActiveLessonId(lessonId)
    })
    rememberLesson(lessonId)

    const nextHash = `#/${lessonId}`
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash)
    }
  }

  const syncLessonFromHash = useEffectEvent(() => {
    const nextLessonId = getHashLessonId(lessonIds)
    if (!nextLessonId || nextLessonId === activeLessonId) return

    persistLessonScroll(activeLessonId)
    queueScrollMode(nextLessonId)
    startTransition(() => {
      setActiveLessonId(nextLessonId)
    })
    rememberLesson(nextLessonId)
  })

  const handleGlobalKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      searchInputRef.current?.focus()
      searchInputRef.current?.select()
      return
    }

    if (event.key === '/' && document.activeElement !== searchInputRef.current) {
      event.preventDefault()
      searchInputRef.current?.focus()
      return
    }

    if (event.key === 'Escape') {
      setMenuOpen(false)
    }
  })

  useEffect(() => {
    const currentHash = getHashLessonId(lessonIds)
    if (!currentHash) {
      window.history.replaceState(null, '', `#/${activeLessonId}`)
    }
  }, [activeLessonId, persistLessonScroll])

  useEffect(() => {
    window.addEventListener('hashchange', syncLessonFromHash)
    window.addEventListener('popstate', syncLessonFromHash)
    window.addEventListener('keydown', handleGlobalKeyDown)

    return () => {
      window.removeEventListener('hashchange', syncLessonFromHash)
      window.removeEventListener('popstate', syncLessonFromHash)
      window.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    writeStoredJson(storageKeys.theme, theme)
  }, [theme])

  useEffect(() => {
    if (!('scrollRestoration' in window.history)) {
      return
    }

    window.history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [menuOpen])

  useEffect(() => {
    writeStoredJson(storageKeys.bookmarks, bookmarks)
  }, [bookmarks])

  useEffect(() => {
    writeStoredJson(storageKeys.visitedLessons, visitedLessons)
  }, [visitedLessons])

  useEffect(() => {
    if (activeLesson.id === 'home' || hasActiveLessonLoaded) {
      return
    }

    let cancelled = false

    void loadCourseView(activeLesson.id).then((lesson) => {
      if (cancelled) return

      setLoadedLessons((currentLessons) => {
        if (currentLessons[lesson.id]) return currentLessons
        return {
          ...currentLessons,
          [lesson.id]: lesson,
        }
      })
    })

    return () => {
      cancelled = true
    }
  }, [activeLesson.id, hasActiveLessonLoaded])

  useEffect(() => {
    if (!isLessonContentReady || !predictivePrefetchLessonIds.length) {
      return
    }

    let cancelled = false
    const timeoutIds = predictivePrefetchLessonIds.map((lessonId, index) =>
      window.setTimeout(() => {
        if (cancelled || document.visibilityState === 'hidden') return
        prefetchCourseView(lessonId)
      }, 140 + index * 180),
    )

    return () => {
      cancelled = true
      timeoutIds.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
    }
  }, [isLessonContentReady, predictivePrefetchLessonIds])

  useEffect(() => {
    const sidebarElement = sidebarRef.current
    if (!sidebarElement) return

    let frameId = 0

    const rememberSidebarScroll = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(() => {
        persistSidebarScroll()
      })
    }

    const flushSidebarScroll = () => {
      window.cancelAnimationFrame(frameId)
      persistSidebarScroll()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushSidebarScroll()
      }
    }

    sidebarElement.addEventListener('scroll', rememberSidebarScroll, { passive: true })
    window.addEventListener('pagehide', flushSidebarScroll)
    window.addEventListener('beforeunload', flushSidebarScroll)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      flushSidebarScroll()
      sidebarElement.removeEventListener('scroll', rememberSidebarScroll)
      window.removeEventListener('pagehide', flushSidebarScroll)
      window.removeEventListener('beforeunload', flushSidebarScroll)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [persistSidebarScroll])

  useEffect(() => {
    let frameId = 0

    const rememberCurrentScroll = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(() => {
        persistLessonScroll(activeLessonId)
      })
    }

    const flushCurrentScroll = () => {
      window.cancelAnimationFrame(frameId)
      persistLessonScroll(activeLessonId, getWindowScrollTop())
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushCurrentScroll()
      }
    }

    window.addEventListener('scroll', rememberCurrentScroll, { passive: true })
    window.addEventListener('pagehide', flushCurrentScroll)
    window.addEventListener('beforeunload', flushCurrentScroll)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      flushCurrentScroll()
      window.removeEventListener('scroll', rememberCurrentScroll)
      window.removeEventListener('pagehide', flushCurrentScroll)
      window.removeEventListener('beforeunload', flushCurrentScroll)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [activeLessonId, persistLessonScroll])

  useLayoutEffect(() => {
    const sidebarElement = sidebarRef.current
    let cancelled = false
    const frameIds: number[] = []
    const timeoutIds: number[] = []
    let mutationObserver: MutationObserver | null = null
    let resizeObserver: ResizeObserver | null = null

    const scheduleSidebarRestore = (delay: number) => {
      const timeoutId = window.setTimeout(() => {
        if (cancelled) return

        const frameId = window.requestAnimationFrame(() => {
          restoreSidebarScroll()
        })

        frameIds.push(frameId)
      }, delay)

      timeoutIds.push(timeoutId)
    }

    scheduleSidebarRestore(0)
    scheduleSidebarRestore(120)
    scheduleSidebarRestore(280)

    if (sidebarElement) {
      mutationObserver = new MutationObserver(() => {
        scheduleSidebarRestore(0)
      })
      mutationObserver.observe(sidebarElement, {
        attributes: true,
        childList: true,
        subtree: true,
      })

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          scheduleSidebarRestore(0)
        })
        resizeObserver.observe(sidebarElement)
      }
    }

    return () => {
      cancelled = true
      frameIds.forEach((frameId) => {
        window.cancelAnimationFrame(frameId)
      })
      timeoutIds.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
      mutationObserver?.disconnect()
      resizeObserver?.disconnect()
    }
  }, [activeLesson.id, deferredSearchValue, menuOpen])

  useLayoutEffect(() => {
    if (!isLessonContentReady) {
      return
    }

    const contentMainElement = document.querySelector<HTMLElement>('.content-main')
    let cancelled = false
    const frameIds: number[] = []
    const timeoutIds: number[] = []
    let mutationObserver: MutationObserver | null = null
    let resizeObserver: ResizeObserver | null = null

    const scheduleRestore = (delay: number) => {
      const timeoutId = window.setTimeout(() => {
        if (cancelled) return

        const frameId = window.requestAnimationFrame(() => {
          const nextScrollTop =
            pendingScrollModeRef.current === 'restore' ? resolveStoredScrollTop(activeLessonId) : 0
          window.scrollTo({ top: nextScrollTop, left: 0, behavior: 'auto' })
        })

        frameIds.push(frameId)
      }, delay)

      timeoutIds.push(timeoutId)
    }

    scheduleRestore(0)
    scheduleRestore(120)
    scheduleRestore(280)
    scheduleRestore(640)
    scheduleRestore(1200)

    const handleWindowLoad = () => {
      if (cancelled) return
      scheduleRestore(0)
    }

    window.addEventListener('load', handleWindowLoad)

    const fontSet = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts
    if (fontSet?.ready) {
      void fontSet.ready.then(() => {
        if (cancelled) return
        scheduleRestore(0)
      })
    }

    if (contentMainElement) {
      mutationObserver = new MutationObserver(() => {
        scheduleRestore(0)
      })
      mutationObserver.observe(contentMainElement, {
        attributes: true,
        childList: true,
        subtree: true,
      })

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          scheduleRestore(0)
        })
        resizeObserver.observe(contentMainElement)
      }
    }

    return () => {
      cancelled = true
      frameIds.forEach((frameId) => {
        window.cancelAnimationFrame(frameId)
      })
      timeoutIds.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
      window.removeEventListener('load', handleWindowLoad)
      mutationObserver?.disconnect()
      resizeObserver?.disconnect()
    }
  }, [activeLessonId, isLessonContentReady])

  const toggleBookmark = () => {
    setBookmarks((currentBookmarks) =>
      currentBookmarks.includes(activeLesson.id)
        ? currentBookmarks.filter((lessonId) => lessonId !== activeLesson.id)
        : [...currentBookmarks, activeLesson.id],
    )
  }

  const scrollToContextPanel = () => {
    contextPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleStudyAction = () => {
    if (activeLesson.id === 'home') {
      if (recommendedLesson) {
        navigateToLesson(recommendedLesson.id)
      }
      return
    }

    scrollToContextPanel()
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-branding">
          <button
            aria-controls="sidebar"
            aria-expanded={menuOpen}
            aria-label="Open lesson navigation"
            className="menu-btn"
            onClick={() => setMenuOpen((currentState) => !currentState)}
            type="button"
          >
            <MenuIcon />
          </button>

          <div className="brand-mark" aria-hidden="true">
            <BookIcon size={18} />
          </div>

          <div className="brand">
            <div className="brand-title">Kotlin Learning Studio</div>
            <div className="brand-subtitle">Current deep section: Dependency Injection and Containers.</div>
          </div>
        </div>

        <label className="command-search" htmlFor="commandSearch">
          <SearchIcon size={16} />
          <input
            id="commandSearch"
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search lessons, topics, code, and architecture"
            ref={searchInputRef}
            value={searchValue}
          />
          <span className="command-hint">Ctrl K</span>
        </label>

        <div className="topbar-side">
          <div className="progress-cluster">
            <div className="progress-copy">
              <span>Progress</span>
              <strong>{completion}%</strong>
            </div>
            <ProgressRing progress={completion} />
          </div>

          <div className="theme-segment" role="tablist" aria-label="Color theme">
            <button
              aria-selected={theme === 'light'}
              className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
              type="button"
            >
              <SunIcon size={15} />
              Light
            </button>
            <button
              aria-selected={theme === 'dark'}
              className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
              type="button"
            >
              <MoonIcon size={15} />
              Dark
            </button>
          </div>
        </div>
      </header>

      <div className="drawer-backdrop" onClick={() => setMenuOpen(false)} />

      <div className="layout">
        <CourseSidebar
          activeId={activeLesson.id}
          bookmarks={bookmarkViews}
          completion={completion}
          groups={sidebarGroups}
          onCloseMenu={() => setMenuOpen(false)}
          onPrefetchLesson={prefetchCourseView}
          onSearchChange={setSearchValue}
          onSelectLesson={navigateToLesson}
          searchValue={searchValue}
          sidebarRef={sidebarRef}
          totalLessons={views.length}
          viewedLessons={viewedLessonSet}
          visitedCount={visitedLessons.length}
        />

        <main className="content">
          {activeLesson.id !== 'home' ? (
            <section className="workspace-header">
              <div className="workspace-crumb">
                Current section <span>/</span> {activeGroup}
              </div>
              <div className="module-stepper">
                {activeTrackViews.map((view, index) => {
                  const visited = visitedLessons.includes(view.id)
                  return (
                    <button
                      className={`module-step ${view.id === activeLesson.id ? 'active' : ''} ${visited ? 'visited' : ''}`}
                      key={view.id}
                      onFocus={() => prefetchCourseView(view.id)}
                      onMouseEnter={() => prefetchCourseView(view.id)}
                      onClick={() => navigateToLesson(view.id)}
                      type="button"
                    >
                      <span>{`${Math.max(activeTrackIndex + 1, 1)}.${index + 1}`}</span>
                    </button>
                  )
                })}
              </div>
            </section>
          ) : null}

          <section className="lesson-intro panel">
            <div className="lesson-intro-main">
              <div className="kicker">
                {activeLesson.id === 'home' ? 'Course overview' : `Lesson ${Math.max(activeTrackStep + 1, 1)}`}
              </div>
              <h2>{activeLesson.title}</h2>
              <p>{inferSummary(activeLesson)}</p>
              <div className="meta-pills">
                <span className="meta-pill">{inferGroup(activeLesson)}</span>
                <span className="meta-pill">{inferLevel(activeLesson)}</span>
                <span className="meta-pill">{inferTime(activeLesson)}</span>
                <span className="meta-pill optional-mobile">Source: {inferSourceSample(activeLesson)}</span>
              </div>
            </div>

            <div className="lesson-progress-card">
              <div className="lesson-progress-label">Study momentum</div>
              <div className="lesson-progress-value">
                {visitedLessons.length} / {views.length}
              </div>
              <div className="lesson-progress-bar">
                <span style={{ width: `${completion}%` }} />
              </div>
              <div className="lesson-progress-note">
                Continue from <strong>{recommendedLesson?.navLabel || 'the active lesson'}</strong>, then map the same idea into your own Kotlin or Android project before moving on.
              </div>
            </div>
          </section>

          {activeLesson.id === 'home' ? (
            <HomeDashboard
              bookmarksCount={bookmarkViews.length}
              currentTrack={currentTrack}
              featuredLessons={featuredLessons}
              nextLesson={recommendedLesson}
              onPrefetchLesson={prefetchCourseView}
              onSelectLesson={navigateToLesson}
              plannedTracks={plannedTracks}
              visitedCount={visitedLessons.length}
            />
          ) : (
            <div className="content-grid-shell">
              <div className="content-main">
                <LessonPager
                  compact
                  nextLesson={nextLesson}
                  onPrefetchLesson={prefetchCourseView}
                  onSelectLesson={navigateToLesson}
                  previousLesson={previousLesson}
                />

                {isLessonLoading ? (
                  <section className="panel lesson-loading-card" aria-live="polite">
                    <div className="section-kicker">Loading lesson</div>
                    <h2>{activeLesson.title}</h2>
                    <p>Preparing the full lesson content and examples for this section.</p>
                  </section>
                ) : (
                  preparedSections.map((section) => (
                    <section
                      className={`${section.kind === 'hero' ? 'hero' : 'panel'} anchored-section`}
                      id={section.anchorId}
                      key={section.anchorId}
                    >
                      {section.kind === 'hero' ? (
                        <>
                          <div className="section-kicker">Lesson overview</div>
                          {section.pills?.length ? (
                            <div className="pills">
                              {section.pills.map((pill) => (
                                <span className="pill" key={pill}>
                                  {pill}
                                </span>
                              ))}
                            </div>
                          ) : null}
                          <h1 className="workspace-title">{section.title}</h1>
                        </>
                      ) : (
                        <>
                          <div className="section-kicker">Section {section.sectionIndex}</div>
                          <h2>{section.title}</h2>
                        </>
                      )}
                      <LegacyHtml
                        html={section.html}
                        lessonId={activeLesson.id}
                        sectionAnchorId={section.anchorId}
                      />
                    </section>
                  ))
                )}

                <LessonPager
                  nextLesson={nextLesson}
                  onPrefetchLesson={prefetchCourseView}
                  onSelectLesson={navigateToLesson}
                  previousLesson={previousLesson}
                />
              </div>

              <div ref={contextPanelRef}>
                <ContextPanel
                  checklistItems={checklistItems}
                  codeBlocks={codeBlocks}
                  highlights={highlights}
                  isBookmarked={isBookmarked}
                  key={activeLesson.id}
                  onToggleBookmark={toggleBookmark}
                  sourceTrack={sourceTrack}
                  view={activeLesson}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      <nav className="mobile-dock" aria-label="Mobile study actions">
        <button className={`dock-button ${activeLesson.id === 'home' ? 'active' : ''}`} onClick={() => navigateToLesson('home')} type="button">
          <CompassIcon size={16} />
          Overview
        </button>
        <button className="dock-button" onClick={() => setMenuOpen(true)} type="button">
          <LayersIcon size={16} />
          Lessons
        </button>
        <button className="dock-button" onClick={() => searchInputRef.current?.focus()} type="button">
          <SearchIcon size={16} />
          Search
        </button>
        {activeLesson.id === 'home' ? (
          <button className="dock-button" onClick={handleStudyAction} type="button">
            <CodeIcon size={16} />
            Continue
          </button>
        ) : (
          <>
            <button className="dock-button" onClick={handleStudyAction} type="button">
              <CodeIcon size={16} />
              Study
            </button>
            <button
              className={`dock-button ${isBookmarked ? 'active' : ''}`}
              onClick={toggleBookmark}
              type="button"
            >
              <BookmarkIcon size={16} />
              Save
            </button>
          </>
        )}
      </nav>
    </div>
  )
}

export default App
