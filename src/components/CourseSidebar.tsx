import type { RefObject } from 'react'

import type { CourseViewSummary } from '../data/courseContent'
import type { SidebarGroup } from '../lib/course-utils'
import { inferLevel } from '../lib/course-utils'
import { BookmarkIcon, CheckCircleIcon, CompassIcon, SearchIcon } from './icons'

interface CourseSidebarProps {
  activeId: string
  bookmarks: CourseViewSummary[]
  completion: number
  groups: SidebarGroup[]
  onCloseMenu: () => void
  onPrefetchLesson: (lessonId: string) => void
  onSearchChange: (value: string) => void
  onSelectLesson: (lessonId: string) => void
  searchValue: string
  sidebarRef: RefObject<HTMLElement | null>
  totalLessons: number
  viewedLessons: Set<string>
  visitedCount: number
}

export function CourseSidebar({
  activeId,
  bookmarks,
  completion,
  groups,
  onCloseMenu,
  onPrefetchLesson,
  onSearchChange,
  onSelectLesson,
  searchValue,
  sidebarRef,
  totalLessons,
  viewedLessons,
  visitedCount,
}: CourseSidebarProps) {
  return (
    <aside className="sidebar" id="sidebar" ref={sidebarRef} tabIndex={-1}>
      <div className="sidebar-head">
        <div className="sidebar-head-text">
          <div className="kicker">Course workspace</div>
          <div className="sidebar-summary">
            Browse the current Kotlin learning workspace, jump across the live DI section, and keep your place while broader topics are added later.
          </div>
        </div>
        <button
          aria-label="Close lesson menu"
          className="sidebar-close-btn"
          id="sidebarCloseBtn"
          onClick={onCloseMenu}
          type="button"
        >
          ×
        </button>
      </div>

      <section className="sidebar-summary-card">
        <div className="sidebar-summary-copy">
          <strong>Kotlin Learning Studio</strong>
          <span>Live now: Dependency Injection and Containers. More Kotlin sections can plug into this shell later.</span>
        </div>
        <div className="lesson-progress-bar">
          <span style={{ width: `${completion}%` }} />
        </div>
        <div className="sidebar-summary-meta">
          <span>{visitedCount} lessons visited</span>
          <span>{totalLessons} total lessons</span>
        </div>
      </section>

      <label className="search-shell" htmlFor="sidebarSearch">
        <SearchIcon size={16} />
        <input
          className="sidebar-search"
          id="sidebarSearch"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Filter lessons, topics, code"
          value={searchValue}
        />
      </label>

      {bookmarks.length > 0 ? (
        <div className="nav-group">
          <div className="nav-label-row">
            <div className="nav-label">
              <BookmarkIcon size={14} />
              Saved lessons
            </div>
            <div className="nav-count">{bookmarks.length}</div>
          </div>
          {bookmarks.slice(0, 5).map((view) => {
            const viewed = viewedLessons.has(view.id)
            return (
              <button
                aria-current={view.id === activeId ? 'page' : undefined}
                aria-label={`${view.navLabel}${viewed ? ', viewed lesson' : ''}`}
                className={`nav-link ${view.id === activeId ? 'active' : ''} ${viewed ? 'viewed' : ''}`}
                key={`bookmark-${view.id}`}
                onFocus={() => onPrefetchLesson(view.id)}
                onMouseEnter={() => onPrefetchLesson(view.id)}
                onClick={() => onSelectLesson(view.id)}
                type="button"
              >
                <span className="nav-link-main">{view.navLabel}</span>
                <span className="nav-link-badges">
                  {viewed ? (
                    <span aria-hidden="true" className="nav-status">
                      <CheckCircleIcon size={12} />
                      Viewed
                    </span>
                  ) : null}
                  <small>{inferLevel(view)}</small>
                </span>
              </button>
            )
          })}
        </div>
      ) : null}

      {groups.length ? (
        groups.map((group) => (
          <div className="nav-group" key={group.label}>
            <div className="nav-label-row">
              <div className="nav-label">
                <CompassIcon size={14} />
                {group.label}
              </div>
              <div className="nav-count">{group.items.length}</div>
            </div>
            {group.items.map((view) => {
              const viewed = viewedLessons.has(view.id)
              return (
                <button
                  aria-current={view.id === activeId ? 'page' : undefined}
                  aria-label={`${view.navLabel}${viewed ? ', viewed lesson' : ''}`}
                  className={`nav-link ${view.id === activeId ? 'active' : ''} ${viewed ? 'viewed' : ''}`}
                  key={view.id}
                  onFocus={() => onPrefetchLesson(view.id)}
                  onMouseEnter={() => onPrefetchLesson(view.id)}
                  onClick={() => onSelectLesson(view.id)}
                  type="button"
                >
                  <span className="nav-link-main">{view.navLabel}</span>
                  <span className="nav-link-badges">
                    {viewed ? (
                      <span aria-hidden="true" className="nav-status">
                        <CheckCircleIcon size={12} />
                        Viewed
                      </span>
                    ) : null}
                    <small>{inferLevel(view)}</small>
                  </span>
                </button>
              )
            })}
          </div>
        ))
      ) : (
        <div className="sidebar-empty">
          <p>No lessons match the current search.</p>
        </div>
      )}

      <section className="sidebar-spotlight">
        <div className="kicker">Study tip</div>
        <p>
          Move through the foundations first, then compare factory, container, and feature-bundle decisions before you
          branch into later Kotlin topics and larger case studies.
        </p>
      </section>
    </aside>
  )
}
