import { useEffect, useMemo, useState } from 'react'

import type { CourseViewSummary } from '../data/courseContent'
import type { SourceTrack } from '../data/kotlinAtlas'
import { inferSourceSample, readStoredJson, storageKeys, writeStoredJson } from '../lib/course-utils'
import { ArrowRightIcon, BookmarkIcon, CheckCircleIcon, CodeIcon, LayersIcon } from './icons'

type ContextTab = 'checklist' | 'examples' | 'explanation'

function WiringPlayground() {
  const [assemblyMode, setAssemblyMode] = useState<'container' | 'factory' | 'manual'>('factory')
  const [storeScope, setStoreScope] = useState<'isolated' | 'shared'>('shared')

  const outcome = useMemo(() => {
    const sharedHistory =
      storeScope === 'shared'
        ? 'Receipt queries can see earlier writes because both sides share one store.'
        : 'Receipt history diverges because the write-side and read-side services do not share state.'

    const compositionStory =
      assemblyMode === 'manual'
        ? 'Manual composition keeps wiring explicit, but the entry point must assemble everything carefully.'
        : assemblyMode === 'factory'
          ? 'Factory mode centralizes environment-aware creation and keeps hidden implementations out of the public API.'
          : 'Container mode stores wiring rules and lifetimes, which helps when the graph gets larger or more dynamic.'

    return { compositionStory, sharedHistory }
  }, [assemblyMode, storeScope])

  return (
    <section className="rail-card playground-card">
      <div className="kicker">Architecture simulator</div>
      <h3>What changes when the graph changes?</h3>
      <p className="rail-copy">
        Toggle the assembly mode and store lifetime to see one of the central ideas from the current DI and containers section.
      </p>

      <div className="toggle-block">
        <div className="toggle-label">Assembly mode</div>
        <div className="toggle-row">
          {(['manual', 'factory', 'container'] as const).map((mode) => (
            <button
              className={`toggle-pill ${mode === assemblyMode ? 'active' : ''}`}
              key={mode}
              onClick={() => setAssemblyMode(mode)}
              type="button"
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="toggle-block">
        <div className="toggle-label">Receipt store scope</div>
        <div className="toggle-row">
          {(['shared', 'isolated'] as const).map((scope) => (
            <button
              className={`toggle-pill ${scope === storeScope ? 'active' : ''}`}
              key={scope}
              onClick={() => setStoreScope(scope)}
              type="button"
            >
              {scope}
            </button>
          ))}
        </div>
      </div>

      <div className="simulator-result">
        <div className="simulator-result-row">
          <LayersIcon size={16} />
          <span>{outcome.compositionStory}</span>
        </div>
        <div className="simulator-result-row">
          <ArrowRightIcon size={16} />
          <span>{outcome.sharedHistory}</span>
        </div>
      </div>
    </section>
  )
}

interface ContextPanelProps {
  checklistItems: string[]
  codeBlocks: string[]
  highlights: string[]
  isBookmarked: boolean
  onToggleBookmark: () => void
  sourceTrack: SourceTrack
  view: CourseViewSummary
}

export function ContextPanel({
  checklistItems,
  codeBlocks,
  highlights,
  isBookmarked,
  onToggleBookmark,
  sourceTrack,
  view,
}: ContextPanelProps) {
  const [activeTab, setActiveTab] = useState<ContextTab>('explanation')
  const [completedByLesson, setCompletedByLesson] = useState<Record<string, string[]>>(() =>
    readStoredJson<Record<string, string[]>>(storageKeys.checklist, {}),
  )

  useEffect(() => {
    writeStoredJson(storageKeys.checklist, completedByLesson)
  }, [completedByLesson])

  const completedItems = completedByLesson[view.id] || []

  const toggleChecklistItem = (item: string) => {
    setCompletedByLesson((currentState) => {
      const currentItems = currentState[view.id] || []
      const nextItems = currentItems.includes(item)
        ? currentItems.filter((entry) => entry !== item)
        : [...currentItems, item]

      return {
        ...currentState,
        [view.id]: nextItems,
      }
    })
  }

  const codePreview = codeBlocks[0]
    ?.split('\n')
    .slice(0, 8)
    .join('\n')

  return (
    <aside className="context-shell content-rail" id="context-panel">
      <section className="rail-card context-header-card">
        <div className="context-header-top">
          <div>
            <div className="kicker">Study companion</div>
            <h3>{view.title}</h3>
          </div>
          <button className={`bookmark-chip ${isBookmarked ? 'active' : ''}`} onClick={onToggleBookmark} type="button">
            <BookmarkIcon size={15} />
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
        </div>

        <div className="context-tablist" role="tablist">
          {(['explanation', 'examples', 'checklist'] as const).map((tab) => (
            <button
              aria-selected={activeTab === tab}
              className={`context-tab ${activeTab === tab ? 'active' : ''}`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="context-panel-body">
          {activeTab === 'explanation' ? (
            <div className="context-stack" role="tabpanel">
              <div className="context-bullets">
                {highlights.slice(0, 5).map((highlight) => (
                  <div className="context-bullet" key={highlight}>
                    <CheckCircleIcon size={16} />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
              <div className="highlight-card">
                <div className="kicker">Key takeaway</div>
                <p>{highlights[0] || 'Use this lesson as a mental model before you copy any code into a real project.'}</p>
              </div>
            </div>
          ) : null}

          {activeTab === 'examples' ? (
            <div className="context-stack" role="tabpanel">
              <div className="context-metric">
                <CodeIcon size={16} />
                <span>{codeBlocks.length} code blocks in this lesson</span>
              </div>
              <div className="context-metric">
                <LayersIcon size={16} />
                <span>Primary source: {inferSourceSample(view)}</span>
              </div>
              {codePreview ? (
                <pre className="mini-code-preview">
                  <code>{codePreview}</code>
                </pre>
              ) : (
                <p className="muted">This lesson leans more on architecture notes than inline code snippets.</p>
              )}
            </div>
          ) : null}

          {activeTab === 'checklist' ? (
            <div className="context-stack" role="tabpanel">
              <div className="context-checklist-meta">
                <span>Completed</span>
                <strong>
                  {completedItems.length}/{checklistItems.length}
                </strong>
              </div>
              <div className="context-checklist">
                {checklistItems.map((item) => {
                  const checked = completedItems.includes(item)
                  return (
                    <label className={`check-item ${checked ? 'done' : ''}`} key={item}>
                      <input
                        checked={checked}
                        onChange={() => toggleChecklistItem(item)}
                        type="checkbox"
                      />
                      <span>{item}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rail-card resource-card">
        <div className="kicker">Source project map</div>
        <h3>{sourceTrack.title}</h3>
        <p className="rail-copy">{sourceTrack.summary}</p>
        <div className="resource-list">
          {sourceTrack.files.slice(0, 4).map((file) => (
            <div className="resource-item" key={file.path}>
              <strong>{file.path}</strong>
              <span>{file.note}</span>
            </div>
          ))}
        </div>
      </section>

      <WiringPlayground />
    </aside>
  )
}
