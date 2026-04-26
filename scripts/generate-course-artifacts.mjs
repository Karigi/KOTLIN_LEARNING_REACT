import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const moduleSpecs = [
  { exportName: 'foundationViews', file: 'src/legacy/foundationsContent.js', key: 'foundations' },
  { exportName: 'patternViews', file: 'src/legacy/patternsContent.js', key: 'patterns' },
  { exportName: 'comparisonViews', file: 'src/legacy/comparisonsContent.js', key: 'comparisons' },
  { exportName: 'importantConceptViews', file: 'src/legacy/importantConceptsContent.js', key: 'importantConcepts' },
  { exportName: 'masteryViews', file: 'src/legacy/masteryContent.js', key: 'mastery' },
  { exportName: 'platformStarterViews', file: 'src/legacy/platformStartersContent.js', key: 'platformStarters' },
  { exportName: 'advancedViews', file: 'src/legacy/advancedContent.js', key: 'advanced' },
]

function scanBalancedRegion(source, startIndex, openChar, closeChar) {
  let depth = 0
  let quote = null
  let templateDepth = 0
  let escaped = false
  let inLineComment = false
  let inBlockComment = false

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index]
    const nextChar = source[index + 1]

    if (inLineComment) {
      if (char === '\n') inLineComment = false
      continue
    }

    if (inBlockComment) {
      if (char === '*' && nextChar === '/') {
        inBlockComment = false
        index += 1
      }
      continue
    }

    if (quote) {
      if (escaped) {
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
        continue
      }

      if (quote === '`') {
        if (char === '$' && nextChar === '{') {
          templateDepth += 1
          index += 1
          continue
        }

        if (char === '}' && templateDepth > 0) {
          templateDepth -= 1
          continue
        }
      }

      if (char === quote && templateDepth === 0) {
        quote = null
      }
      continue
    }

    if (char === '/' && nextChar === '/') {
      inLineComment = true
      index += 1
      continue
    }

    if (char === '/' && nextChar === '*') {
      inBlockComment = true
      index += 1
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      templateDepth = 0
      continue
    }

    if (char === openChar) {
      depth += 1
      continue
    }

    if (char === closeChar) {
      depth -= 1
      if (depth === 0) {
        return index
      }
    }
  }

  throw new Error(`Unable to find matching ${closeChar} for ${openChar} starting at index ${startIndex}`)
}

function splitTopLevelItems(source) {
  const items = []
  let itemStart = 0
  let braceDepth = 0
  let bracketDepth = 0
  let parenDepth = 0
  let quote = null
  let templateDepth = 0
  let escaped = false
  let inLineComment = false
  let inBlockComment = false

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    const nextChar = source[index + 1]

    if (inLineComment) {
      if (char === '\n') inLineComment = false
      continue
    }

    if (inBlockComment) {
      if (char === '*' && nextChar === '/') {
        inBlockComment = false
        index += 1
      }
      continue
    }

    if (quote) {
      if (escaped) {
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
        continue
      }

      if (quote === '`') {
        if (char === '$' && nextChar === '{') {
          templateDepth += 1
          index += 1
          continue
        }

        if (char === '}' && templateDepth > 0) {
          templateDepth -= 1
          continue
        }
      }

      if (char === quote && templateDepth === 0) {
        quote = null
      }
      continue
    }

    if (char === '/' && nextChar === '/') {
      inLineComment = true
      index += 1
      continue
    }

    if (char === '/' && nextChar === '*') {
      inBlockComment = true
      index += 1
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      templateDepth = 0
      continue
    }

    if (char === '{') braceDepth += 1
    if (char === '}') braceDepth -= 1
    if (char === '[') bracketDepth += 1
    if (char === ']') bracketDepth -= 1
    if (char === '(') parenDepth += 1
    if (char === ')') parenDepth -= 1

    if (char === ',' && braceDepth === 0 && bracketDepth === 0 && parenDepth === 0) {
      const item = source.slice(itemStart, index).trim()
      if (item) items.push(item)
      itemStart = index + 1
    }
  }

  const finalItem = source.slice(itemStart).trim()
  if (finalItem) items.push(finalItem)
  return items
}

function extractExportedArrayItems(source, exportName) {
  const marker = `export const ${exportName} = [`
  const startIndex = source.indexOf(marker)
  if (startIndex < 0) {
    throw new Error(`Could not find exported array ${exportName}`)
  }

  const arrayStart = source.indexOf('[', startIndex)
  const arrayEnd = scanBalancedRegion(source, arrayStart, '[', ']')
  const arrayBody = source.slice(arrayStart + 1, arrayEnd)
  return splitTopLevelItems(arrayBody)
}

function extractExportedObjectSource(source, exportName) {
  const marker = `export const ${exportName} =`
  const startIndex = source.indexOf(marker)
  if (startIndex < 0) {
    throw new Error(`Could not find exported object ${exportName}`)
  }

  const objectStart = source.indexOf('{', startIndex)
  const objectEnd = scanBalancedRegion(source, objectStart, '{', '}')
  return source.slice(objectStart, objectEnd + 1)
}

function normalizeString(value) {
  return value?.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\s+/g, ' ').trim()
}

function extractField(objectSource, fieldName) {
  const pattern = new RegExp(`${fieldName}:\\s*(['"\`])([\\s\\S]*?)\\1`)
  const match = objectSource.match(pattern)
  return normalizeString(match?.[2])
}

function extractSectionTitles(objectSource) {
  const titles = new Set()

  for (const match of objectSource.matchAll(/\b(?:hero|panel)\(\s*(['"`])([\s\S]*?)\1/g)) {
    const title = normalizeString(match[2])
    if (title) titles.add(title)
  }

  return [...titles]
}

function buildSearchText(fields) {
  return fields
    .flat()
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

async function main() {
  const contentFile = path.join(repoRoot, 'src/legacy/content.js')
  const contentSource = await readFile(contentFile, 'utf8')
  const appMetaSource = extractExportedObjectSource(contentSource, 'appMeta')
  const orderedViewItems = extractExportedArrayItems(contentSource, 'views')

  const moduleEntriesBySpread = new Map()

  for (const spec of moduleSpecs) {
    const filePath = path.join(repoRoot, spec.file)
    const fileSource = await readFile(filePath, 'utf8')
    const items = extractExportedArrayItems(fileSource, spec.exportName).map((objectSource) => ({
      moduleKey: spec.key,
      objectSource,
    }))
    moduleEntriesBySpread.set(spec.exportName, items)
  }

  const orderedEntries = []
  const coreEntries = []

  for (const item of orderedViewItems) {
    if (item.startsWith('...')) {
      const spreadName = item.slice(3).trim()
      const spreadEntries = moduleEntriesBySpread.get(spreadName)
      if (!spreadEntries) {
        throw new Error(`No module mapping found for spread ${spreadName}`)
      }
      orderedEntries.push(...spreadEntries)
      continue
    }

    const coreEntry = {
      moduleKey: 'core',
      objectSource: item,
    }
    orderedEntries.push(coreEntry)
    coreEntries.push(coreEntry)
  }

  const coreModuleSource = [
    "import { hero, panel } from './contentBuilders';",
    '',
    `export const appMeta = ${appMetaSource};`,
    '',
    'export const coreCourseViews = [',
    coreEntries.map((entry) => entry.objectSource).join(',\n'),
    '];',
    '',
  ].join('\n')

  const manifestEntries = orderedEntries.map((entry) => {
    const metadata = {
      group: extractField(entry.objectSource, 'group'),
      id: extractField(entry.objectSource, 'id'),
      level: extractField(entry.objectSource, 'level'),
      moduleKey: entry.moduleKey,
      navLabel: extractField(entry.objectSource, 'navLabel'),
      sampleSource: extractField(entry.objectSource, 'sampleSource'),
      searchText: buildSearchText([
        extractField(entry.objectSource, 'title'),
        extractField(entry.objectSource, 'navLabel'),
        extractField(entry.objectSource, 'group'),
        extractField(entry.objectSource, 'level'),
        extractField(entry.objectSource, 'time'),
        extractField(entry.objectSource, 'sampleSource'),
        extractField(entry.objectSource, 'summary'),
        extractSectionTitles(entry.objectSource),
      ]),
      summary: extractField(entry.objectSource, 'summary'),
      time: extractField(entry.objectSource, 'time'),
      title: extractField(entry.objectSource, 'title'),
    }

    if (!metadata.id || !metadata.title || !metadata.navLabel) {
      throw new Error(`Missing required metadata for lesson source: ${entry.objectSource.slice(0, 120)}...`)
    }

    return metadata
  })

  const manifestSource = [
    "export type CourseModuleKey = 'core' | 'foundations' | 'patterns' | 'comparisons' | 'importantConcepts' | 'mastery' | 'platformStarters' | 'advanced'",
    '',
    'export interface CourseManifestEntry {',
    '  group?: string',
    '  id: string',
    '  level?: string',
    '  moduleKey: CourseModuleKey',
    '  navLabel: string',
    '  sampleSource?: string',
    '  searchText: string',
    '  summary?: string',
    '  time?: string',
    '  title: string',
    '}',
    '',
    'export const manifestViews: CourseManifestEntry[] = [',
    manifestEntries
      .map((entry) => {
        const lines = [
          `  { id: ${JSON.stringify(entry.id)}, title: ${JSON.stringify(entry.title)}, navLabel: ${JSON.stringify(entry.navLabel)}, moduleKey: ${JSON.stringify(entry.moduleKey)}, searchText: ${JSON.stringify(entry.searchText)}`,
        ]

        if (entry.group) lines.push(`    , group: ${JSON.stringify(entry.group)}`)
        if (entry.level) lines.push(`    , level: ${JSON.stringify(entry.level)}`)
        if (entry.time) lines.push(`    , time: ${JSON.stringify(entry.time)}`)
        if (entry.sampleSource) lines.push(`    , sampleSource: ${JSON.stringify(entry.sampleSource)}`)
        if (entry.summary) lines.push(`    , summary: ${JSON.stringify(entry.summary)}`)
        lines.push('  }')

        return lines.join('\n')
      })
      .join(',\n'),
    ']',
    '',
  ].join('\n')

  await mkdir(path.join(repoRoot, 'src/data'), { recursive: true })
  await writeFile(path.join(repoRoot, 'src/legacy/coreCourseContent.js'), coreModuleSource)
  await writeFile(path.join(repoRoot, 'src/data/courseManifest.ts'), manifestSource)

  console.log(`Generated coreCourseContent.js and courseManifest.ts for ${manifestEntries.length} lessons.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
