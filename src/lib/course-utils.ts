import type { CourseSection, CourseView, CourseViewBase, CourseViewSummary } from '../data/courseContent'

export interface PreparedCourseSection extends CourseSection {
  anchorId: string
  sectionIndex: number
}

export interface SidebarGroup {
  items: CourseViewSummary[]
  label: string
}

export const storageKeys = {
  bookmarks: 'kotlin-learning-bookmarks',
  checklist: 'kotlin-learning-checklist',
  lessonInteractiveState: 'kotlin-learning-lesson-interactive-state',
  lastLesson: 'kotlin-learning-last-lesson',
  lessonScroll: 'kotlin-learning-lesson-scroll',
  reloadScrollSnapshot: 'kotlin-learning-reload-scroll-snapshot',
  sidebarScroll: 'kotlin-learning-sidebar-scroll',
  theme: 'kotlin-learning-theme',
  visitedLessons: 'kotlin-learning-visited-lessons',
} as const

function readJsonFromStorage<T>(storage: Storage | undefined, key: string, fallback: T): T {
  try {
    const rawValue = storage?.getItem(key)
    return rawValue ? (JSON.parse(rawValue) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJsonToStorage<T>(storage: Storage | undefined, key: string, value: T) {
  try {
    storage?.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage failures so the study surface stays usable.
  }
}

export function readStoredJson<T>(key: string, fallback: T): T {
  return readJsonFromStorage(window.localStorage, key, fallback)
}

export function writeStoredJson<T>(key: string, value: T) {
  writeJsonToStorage(window.localStorage, key, value)
}

export function readSessionJson<T>(key: string, fallback: T): T {
  return readJsonFromStorage(window.sessionStorage, key, fallback)
}

export function writeSessionJson<T>(key: string, value: T) {
  writeJsonToStorage(window.sessionStorage, key, value)
}

export function normalizeTheme(theme: string | null | undefined) {
  return theme === 'dark' ? 'dark' : 'light'
}

export function getSystemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function readInitialTheme() {
  return normalizeTheme(readStoredJson(storageKeys.theme, getSystemTheme()))
}

export function slugify(value = 'section') {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section'
}

export function inferGroup(view: CourseViewBase) {
  if (view.group) return view.group
  if (view.id === 'home') return 'Course overview'
  if (['spring-boot-mapping', 'android-studio-mapping'].includes(view.id)) return 'Platform mapping'
  if (['decision-guide', 'real-life-scenarios', 'anti-patterns', 'production-readiness'].includes(view.id)) {
    return 'Architecture playbook'
  }
  return 'Dependency Injection and Containers'
}

export function inferLevel(view: CourseViewBase) {
  if (view.level) return view.level
  if (view.id === 'home') return 'Orientation'
  if (inferGroup(view) === 'Foundations') return 'Beginner'
  if (inferGroup(view) === 'Platform mapping') return 'Applied'
  return 'Intermediate'
}

export function inferTime(view: CourseViewBase) {
  return view.time || '10 min'
}

export function inferSummary(view: CourseViewBase) {
  if (view.summary) return view.summary
  if (view.id === 'home') {
    return 'The redesigned Kotlin learning dashboard, with Dependency Injection and Containers as the current deep section and room for more Kotlin topics later.'
  }
  return 'A focused lesson that deepens the active topic with explanations, examples, and practice-oriented guidance.'
}

export function inferSourceSample(view: CourseViewBase) {
  return view.sampleSource || 'core app curriculum'
}

export function prepareSections(view: CourseView): PreparedCourseSection[] {
  return view.sections.map((section, index) => ({
    ...section,
    anchorId: `${view.id}-${slugify(section.title || `section-${index + 1}`)}-${index + 1}`,
    sectionIndex: index + 1,
  }))
}

export function getSidebarGroups(items: CourseViewSummary[]): SidebarGroup[] {
  const groupedViews = new Map<string, CourseViewSummary[]>()

  items.forEach((view) => {
    const label = inferGroup(view)
    if (!groupedViews.has(label)) {
      groupedViews.set(label, [])
    }
    groupedViews.get(label)?.push(view)
  })

  return Array.from(groupedViews.entries()).map(([label, groupItems]) => ({
    items: groupItems,
    label,
  }))
}

function parseHtml(html: string) {
  if (typeof document === 'undefined') {
    return null
  }

  const template = document.createElement('template')
  template.innerHTML = html
  return template.content
}

export function plainTextFromHtml(html: string) {
  const parsedHtml = parseHtml(html)
  if (parsedHtml) {
    return parsedHtml.textContent?.replace(/\s+/g, ' ').trim() || ''
  }

  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function extractListText(html: string, selector: string) {
  const parsedHtml = parseHtml(html)
  if (!parsedHtml) return []

  return Array.from(parsedHtml.querySelectorAll(selector))
    .map((node) => node.textContent?.replace(/\s+/g, ' ').trim() || '')
    .filter(Boolean)
}

export function extractCodeBlocks(view: CourseView) {
  return view.sections.flatMap((section) => extractListText(section.html, 'pre')).filter(Boolean)
}

export function extractLessonHighlights(view: CourseView) {
  const sectionTitles = view.sections
    .map((section) => section.title)
    .filter((title) => title && title !== view.title)
    .slice(0, 4)

  if (sectionTitles.length >= 3) {
    return sectionTitles
  }

  const paragraphHighlights = view.sections
    .flatMap((section) => extractListText(section.html, 'p'))
    .filter(Boolean)
    .slice(0, 4)

  return paragraphHighlights.length ? paragraphHighlights : [inferSummary(view)]
}

export function extractChecklistItems(view: CourseView) {
  const checklistItems = view.sections
    .flatMap((section) => [
      ...extractListText(section.html, '.lesson-checklist li'),
      ...extractListText(section.html, 'ol li'),
    ])
    .filter(Boolean)

  const uniqueItems = Array.from(new Set(checklistItems))
  if (uniqueItems.length) {
    return uniqueItems.slice(0, 6)
  }

  return view.sections.slice(0, 5).map((section) => `Review ${section.title}`)
}

export function createSearchBlob(view: CourseViewBase) {
  if (view.searchText) {
    return view.searchText
  }

  return [
    view.title,
    view.navLabel,
    inferGroup(view),
    inferLevel(view),
    inferSummary(view),
    inferSourceSample(view),
  ]
    .join(' ')
    .toLowerCase()
}

export function getHashLessonId(validIds: Set<string>) {
  const lessonMatch = window.location.hash.match(/^#\/([^?]+)$/)
  const lessonId = lessonMatch?.[1]
  return lessonId && validIds.has(lessonId) ? lessonId : null
}

export function getNextLesson(currentIndex: number, items: CourseViewSummary[]) {
  return currentIndex < items.length - 1 ? items[currentIndex + 1] : null
}

export function getPreviousLesson(currentIndex: number, items: CourseViewSummary[]) {
  return currentIndex > 0 ? items[currentIndex - 1] : null
}
