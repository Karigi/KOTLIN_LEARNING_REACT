import { manifestViews, type CourseManifestEntry, type CourseModuleKey } from './courseManifest'

export type CourseSectionKind = 'hero' | 'panel'

export interface CourseSection {
  html: string
  kind: CourseSectionKind
  pills?: string[]
  title: string
}

export interface CourseAppMeta {
  description: string
  title: string
}

export interface CourseViewBase {
  group?: string
  id: string
  level?: string
  navLabel: string
  sampleSource?: string
  searchText?: string
  summary?: string
  time?: string
  title: string
}

export interface CourseViewSummary extends CourseViewBase {
  moduleKey: CourseModuleKey
}

export interface CourseView extends CourseViewBase {
  sections: CourseSection[]
}

type CourseModuleLoader = () => Promise<CourseView[]>

const moduleLoaders: Record<CourseModuleKey, CourseModuleLoader> = {
  advanced: async () => {
    const module = await import('../legacy/advancedContent.js')
    return module.advancedViews as CourseView[]
  },
  comparisons: async () => {
    const module = await import('../legacy/comparisonsContent.js')
    return module.comparisonViews as CourseView[]
  },
  core: async () => {
    const module = await import('../legacy/coreCourseContent.js')
    return module.coreCourseViews as CourseView[]
  },
  foundations: async () => {
    const module = await import('../legacy/foundationsContent.js')
    return module.foundationViews as CourseView[]
  },
  importantConcepts: async () => {
    const module = await import('../legacy/importantConceptsContent.js')
    return module.importantConceptViews as CourseView[]
  },
  mastery: async () => {
    const module = await import('../legacy/masteryContent.js')
    return module.masteryViews as CourseView[]
  },
  patterns: async () => {
    const module = await import('../legacy/patternsContent.js')
    return module.patternViews as CourseView[]
  },
  platformStarters: async () => {
    const module = await import('../legacy/platformStartersContent.js')
    return module.platformStarterViews as CourseView[]
  },
}

const moduleCache = new Map<CourseModuleKey, Promise<CourseView[]>>()

const homeOverrides = {
  navLabel: 'Overview',
  summary:
    'A Kotlin learning overview that keeps Dependency Injection and Containers as the current deep section while the rest of the curriculum is staged for later additions.',
  time: '5 min',
  title: 'Kotlin Learning Studio',
} as const

function applyHomeOverrides<T extends CourseViewBase>(view: T): T {
  if (view.id !== 'home') return view
  return {
    ...view,
    ...homeOverrides,
  }
}

function toSummaryView(view: CourseManifestEntry): CourseViewSummary {
  return applyHomeOverrides({
    group: view.group,
    id: view.id,
    level: view.level,
    moduleKey: view.moduleKey,
    navLabel: view.navLabel,
    sampleSource: view.sampleSource,
    searchText: view.searchText,
    summary: view.summary,
    time: view.time,
    title: view.title,
  })
}

async function loadCourseModule(moduleKey: CourseModuleKey) {
  const cachedPromise = moduleCache.get(moduleKey)
  if (cachedPromise) return cachedPromise

  const nextPromise = moduleLoaders[moduleKey]()
  moduleCache.set(moduleKey, nextPromise)
  return nextPromise
}

const viewSummaries = manifestViews.map(toSummaryView)
const viewSummaryById = new Map(viewSummaries.map((view) => [view.id, view]))

export const appMeta: CourseAppMeta = {
  title: 'Kotlin Learning Studio',
  description:
    'Responsive Kotlin learning workspace with Dependency Injection and Containers as the current live section, plus room for broader Kotlin topics from the source project as they are added.',
}

export const views = viewSummaries

export async function loadCourseView(lessonId: string) {
  const lessonSummary = viewSummaryById.get(lessonId)
  if (!lessonSummary) {
    throw new Error(`Unknown lesson id: ${lessonId}`)
  }

  const moduleViews = await loadCourseModule(lessonSummary.moduleKey)
  const loadedView = moduleViews.find((view) => view.id === lessonId)
  if (!loadedView) {
    throw new Error(`Module ${lessonSummary.moduleKey} did not contain lesson ${lessonId}`)
  }

  return applyHomeOverrides({
    ...loadedView,
    searchText: lessonSummary.searchText,
    summary: lessonSummary.summary || loadedView.summary,
  })
}

export function prefetchCourseView(lessonId: string) {
  if (!viewSummaryById.has(lessonId)) return
  void loadCourseView(lessonId)
}
