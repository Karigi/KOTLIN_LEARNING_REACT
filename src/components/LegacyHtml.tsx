import { useEffect, useEffectEvent, useLayoutEffect, useRef } from 'react'

import { readStoredJson, storageKeys, writeStoredJson } from '../lib/course-utils'

function activateToggleGroup(
  buttons: HTMLElement[],
  panels: HTMLElement[],
  buttonAttribute: string,
  panelAttribute: string,
  target: string,
) {
  buttons.forEach((button) => {
    const isActive = button.getAttribute(buttonAttribute) === target
    button.classList.toggle('active', isActive)
    button.setAttribute('aria-selected', String(isActive))
  })

  panels.forEach((panel) => {
    const isActive = panel.getAttribute(panelAttribute) === target
    panel.classList.toggle('active', isActive)
    panel.hidden = !isActive
  })
}

function getInitialToggleTarget(
  buttons: HTMLElement[],
  panels: HTMLElement[],
  buttonAttribute: string,
  panelAttribute: string,
  preferredTarget?: string,
) {
  const validTargets = new Set(
    panels.map((panel) => panel.getAttribute(panelAttribute)).filter((value): value is string => Boolean(value)),
  )
  if (preferredTarget && validTargets.has(preferredTarget)) {
    return preferredTarget
  }
  const activeButtonTarget = buttons.find((button) => button.classList.contains('active'))?.getAttribute(buttonAttribute)
  if (activeButtonTarget && validTargets.has(activeButtonTarget)) {
    return activeButtonTarget
  }

  return (
    buttons[0]?.getAttribute(buttonAttribute) ||
    panels[0]?.getAttribute(panelAttribute) ||
    null
  )
}

function buildInteractiveStateKey(
  lessonId: string,
  sectionAnchorId: string | undefined,
  groupKind: 'diagram' | 'tab',
  groupName: string | null,
  index: number,
) {
  return `${lessonId}::${sectionAnchorId || 'section'}::${groupKind}::${groupName || index + 1}`
}

function readInteractiveState(lessonId: string) {
  const interactiveStateByLesson = readStoredJson<Record<string, Record<string, string>>>(
    storageKeys.lessonInteractiveState,
    {},
  )
  return interactiveStateByLesson[lessonId] || {}
}

function writeInteractiveState(lessonId: string, nextLessonInteractiveState: Record<string, string>) {
  const interactiveStateByLesson = readStoredJson<Record<string, Record<string, string>>>(
    storageKeys.lessonInteractiveState,
    {},
  )
  const mergedLessonInteractiveState = {
    ...(interactiveStateByLesson[lessonId] || {}),
    ...nextLessonInteractiveState,
  }
  writeStoredJson(storageKeys.lessonInteractiveState, {
    ...interactiveStateByLesson,
    [lessonId]: mergedLessonInteractiveState,
  })
  return mergedLessonInteractiveState
}

function initializeTabs(
  container: HTMLElement,
  lessonId: string,
  sectionAnchorId: string | undefined,
  interactiveState: Record<string, string>,
) {
  container.querySelectorAll<HTMLElement>('[data-tab-group]').forEach((group, index) => {
    const buttons = Array.from(group.querySelectorAll<HTMLElement>('[data-tab]'))
    const parent = group.parentElement
    if (!buttons.length || !parent) return

    const targets = new Set(buttons.map((button) => button.getAttribute('data-tab')).filter(Boolean))
    const panels = Array.from(parent.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        child.hasAttribute('data-tab-panel') &&
        targets.has(child.getAttribute('data-tab-panel')),
    )
    if (!panels.length) return

    const stateKey = buildInteractiveStateKey(
      lessonId,
      sectionAnchorId,
      'tab',
      group.getAttribute('data-tab-group'),
      index,
    )
    const initialTarget = getInitialToggleTarget(
      buttons,
      panels,
      'data-tab',
      'data-tab-panel',
      interactiveState[stateKey],
    )
    if (initialTarget) {
      activateToggleGroup(buttons, panels, 'data-tab', 'data-tab-panel', initialTarget)
      interactiveState[stateKey] = initialTarget
    }
  })
}

function initializeDiagrams(
  container: HTMLElement,
  lessonId: string,
  sectionAnchorId: string | undefined,
  interactiveState: Record<string, string>,
) {
  container.querySelectorAll<HTMLElement>('[data-diagram-group]').forEach((group, index) => {
    const buttons = Array.from(group.querySelectorAll<HTMLElement>('[data-diagram-target]'))
    const panels = Array.from(group.querySelectorAll<HTMLElement>('[data-diagram-panel]'))
    if (!buttons.length || !panels.length) return

    const stateKey = buildInteractiveStateKey(
      lessonId,
      sectionAnchorId,
      'diagram',
      group.getAttribute('data-diagram-group'),
      index,
    )
    const initialTarget = getInitialToggleTarget(
      buttons,
      panels,
      'data-diagram-target',
      'data-diagram-panel',
      interactiveState[stateKey],
    )
    if (initialTarget) {
      activateToggleGroup(buttons, panels, 'data-diagram-target', 'data-diagram-panel', initialTarget)
      interactiveState[stateKey] = initialTarget
    }
  })
}

const scrollMarkerSelector = 'p, li, pre, h3, h4, h5, blockquote, td, th, .callout-title, .key'

function initializeScrollMarkers(container: HTMLElement, sectionAnchorId?: string) {
  if (!sectionAnchorId) return

  Array.from(container.querySelectorAll<HTMLElement>(scrollMarkerSelector))
    .filter((element) => {
      const textContent = element.textContent?.replace(/\s+/g, ' ').trim()
      return Boolean(textContent)
    })
    .forEach((element, index) => {
      element.dataset.scrollMarkerId = `${sectionAnchorId}-marker-${index + 1}`
    })
}

interface LegacyHtmlProps {
  className?: string
  html: string
  lessonId: string
  sectionAnchorId?: string
}

export function LegacyHtml({ className, html, lessonId, sectionAnchorId }: LegacyHtmlProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const interactiveStateRef = useRef<Record<string, string>>({})

  const handleContentClick = useEffectEvent(async (event: MouseEvent) => {
    const container = containerRef.current
    const eventTarget = event.target
    if (!container || !(eventTarget instanceof HTMLElement)) return

    const tabButton = eventTarget.closest<HTMLElement>('[data-tab]')
    if (tabButton) {
      const group = tabButton.closest<HTMLElement>('[data-tab-group]')
      const parent = group?.parentElement
      if (group && parent) {
        const buttons = Array.from(group.querySelectorAll<HTMLElement>('[data-tab]'))
        const targets = new Set(buttons.map((button) => button.getAttribute('data-tab')).filter(Boolean))
        const panels = Array.from(parent.children).filter(
          (child): child is HTMLElement =>
            child instanceof HTMLElement &&
            child.hasAttribute('data-tab-panel') &&
            targets.has(child.getAttribute('data-tab-panel')),
        )
        const target = tabButton.getAttribute('data-tab')
        if (target) {
          const stateKey = buildInteractiveStateKey(
            lessonId,
            sectionAnchorId,
            'tab',
            group.getAttribute('data-tab-group'),
            Array.from(container.querySelectorAll<HTMLElement>('[data-tab-group]')).indexOf(group),
          )
          activateToggleGroup(buttons, panels, 'data-tab', 'data-tab-panel', target)
          interactiveStateRef.current = writeInteractiveState(lessonId, {
            ...interactiveStateRef.current,
            [stateKey]: target,
          })
        }
      }
      return
    }

    const diagramButton = eventTarget.closest<HTMLElement>('[data-diagram-target]')
    if (diagramButton) {
      const group = diagramButton.closest<HTMLElement>('[data-diagram-group]')
      if (group) {
        const buttons = Array.from(group.querySelectorAll<HTMLElement>('[data-diagram-target]'))
        const panels = Array.from(group.querySelectorAll<HTMLElement>('[data-diagram-panel]'))
        const target = diagramButton.getAttribute('data-diagram-target')
        if (target) {
          const stateKey = buildInteractiveStateKey(
            lessonId,
            sectionAnchorId,
            'diagram',
            group.getAttribute('data-diagram-group'),
            Array.from(container.querySelectorAll<HTMLElement>('[data-diagram-group]')).indexOf(group),
          )
          activateToggleGroup(buttons, panels, 'data-diagram-target', 'data-diagram-panel', target)
          interactiveStateRef.current = writeInteractiveState(lessonId, {
            ...interactiveStateRef.current,
            [stateKey]: target,
          })
        }
      }
      return
    }

    const copyButton = eventTarget.closest<HTMLElement>('[data-copy-target]')
    if (copyButton) {
      const targetId = copyButton.getAttribute('data-copy-target')
      const codeTarget = targetId ? container.querySelector<HTMLElement>(`#${targetId}`) : null
      if (!codeTarget) return

      const originalText = copyButton.textContent
      try {
        await navigator.clipboard.writeText(codeTarget.textContent || '')
        copyButton.textContent = 'Copied'
      } catch {
        copyButton.textContent = 'Copy failed'
      }

      window.setTimeout(() => {
        copyButton.textContent = originalText
      }, 1200)
      return
    }

    const scrollButton = eventTarget.closest<HTMLElement>('[data-scroll-target]')
    if (scrollButton) {
      const targetId = scrollButton.getAttribute('data-scroll-target')
      const scrollTarget = targetId ? document.getElementById(targetId) : null
      if (scrollTarget) {
        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  })

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    interactiveStateRef.current = readInteractiveState(lessonId)
    initializeScrollMarkers(container, sectionAnchorId)
    initializeTabs(container, lessonId, sectionAnchorId, interactiveStateRef.current)
    initializeDiagrams(container, lessonId, sectionAnchorId, interactiveStateRef.current)
    interactiveStateRef.current = writeInteractiveState(lessonId, interactiveStateRef.current)

    container.querySelectorAll<HTMLElement>('[data-progress-width]').forEach((progressBar) => {
      const width = Number(progressBar.getAttribute('data-progress-width')) || 0
      progressBar.style.width = `${width}%`
    })

    container.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]').forEach((link) => {
      link.rel = 'noreferrer noopener'
    })
  }, [html, lessonId, sectionAnchorId])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const listener = (event: MouseEvent) => {
      void handleContentClick(event)
    }

    container.addEventListener('click', listener)
    return () => {
      container.removeEventListener('click', listener)
    }
  }, [])

  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} ref={containerRef} />
}
