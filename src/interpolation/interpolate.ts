import { Formatters, Placeholder, ContentPlaceholder } from './types'
import { GDoc, Request, Unit } from './gdocTypes'

import computeContent from './compute'

const findPlaceholders = (doc: GDoc): Placeholder[] => {
  const placeholders: Placeholder[] = []

  doc.body.content.map(c => {
    if (c.paragraph) {
      c.paragraph.elements.map(e => {
        if (e.textRun) {
          let textRun = e.textRun.content
          const matches = textRun.match(/{{([^}]*)}}/gi) || []
          for (let match of matches) {
            const start = e.startIndex + textRun.indexOf(match)
            textRun = textRun.replace(match, ''.padStart(match.length))
            placeholders.push({
              raw: match,
              position: {
                start,
                end: start + match.length
              }
            })
          }
        }
      })
    }
  })

  return placeholders
}

const analyzePlaceholders = (
  placeholders: Placeholder[],
  data: Record<string, any>,
  options?: {
    formatters?: Formatters
  }
): Placeholder[] => {
  return placeholders.map(placeholder => {
    const rawWithoutBrackets = placeholder.raw.slice(2, -2).trim()

    // CommentPlaceholder
    if (rawWithoutBrackets.startsWith('#')) {
      return {
        ...placeholder,
        type: 'comment',
        value: rawWithoutBrackets.slice(1).trim()
      }
    }

    if (['%', '@'].includes(rawWithoutBrackets[0])) {
      // Reserved for later usage
      return placeholder
    }

    // ContentPlaceholder
    return computeContent(placeholder, data, options)
  })
}

const buildUpdates = (placeholders: Placeholder[]): Request[] => {
  const updates: Request[] = []

  for (let placeholder of placeholders) {
    // ContentPlaceholder
    if (placeholder.type == 'content') {
      const contentPlaceholder = placeholder as ContentPlaceholder
      // Image
      if (contentPlaceholder.output.url) {
        const output = contentPlaceholder.output
        // Insert image
        updates.push({
          insertInlineImage: {
            uri: output.url,
            objectSize: {
              width: output.width ? { magnitude: output.width, unit: Unit.PT } : undefined,
              height: output.height ? { magnitude: output.height, unit: Unit.PT } : undefined
            },
            location: {
              segmentId: '', // Empty means body
              index: placeholder.position.start
            }
          }
        })
        // Remove mustaches
        updates.push({
          replaceAllText: {
            replaceText: '',
            containsText: {
              text: placeholder.raw,
              matchCase: true
            }
          }
        })
      }

      // Text
      if (
        contentPlaceholder.output === `${contentPlaceholder.output}` ||
        !isNaN(contentPlaceholder.output)
      ) {
        updates.push({
          replaceAllText: {
            replaceText: `${contentPlaceholder.output}`,
            containsText: {
              text: placeholder.raw,
              matchCase: true
            }
          }
        })
      }
    }

    // CommentPlaceholder
    else if (placeholder.type == 'comment') {
      updates.push({
        replaceAllText: {
          replaceText: '',
          containsText: {
            text: placeholder.raw,
            matchCase: true
          }
        }
      })
    }
  }

  // Sort updates
  updates.sort((a, b) => {
    if (a.insertInlineImage && !b.insertInlineImage) return -1
    if (!a.insertInlineImage && b.insertInlineImage) return 1
    return 0
  })

  return updates
}

const interpolate = (doc: GDoc, data: any, formatters: Formatters): Placeholder[] => {
  let placeholders = findPlaceholders(doc)
  return analyzePlaceholders(placeholders, data, { formatters })
}

export default interpolate
export { findPlaceholders, analyzePlaceholders, buildUpdates }
