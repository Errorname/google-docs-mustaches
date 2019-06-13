import { Placeholder, ContentPlaceholder } from '../types'
import { Unit, Request } from '../gdocTypes'

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
  /* For Google Doc, updates are applied one after the other. This means that the origin
  position of placeholders may change if a previous update was applied, (eg: with a long text)!
  We need a better dynamic position system to handle this, but in the meantime,
  we simply sort the imageUpdates first to mitigate the problem. */
  updates.sort((a, b) => {
    if (a.insertInlineImage && !b.insertInlineImage) return -1
    if (!a.insertInlineImage && b.insertInlineImage) return 1
    return 0
  })

  return updates
}

export default buildUpdates
