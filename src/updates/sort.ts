import { InsertInlineImageRequest, Request } from '../types'

/**
 * Order of requests:
 * - Images with greatest index
 * - Images with smallest index
 * - ReplaceAllText
 */

const sortUpdates = (updates: Request[]): Request[] => {
  return updates.sort((a, b) => {
    if (a.replaceAllText) return 1
    if (b.replaceAllText) return -1

    // Note: We compare locations even if not in same segment, it's easier and doesn't add side effects
    const aLoc = (a.insertInlineImage as InsertInlineImageRequest).location
    const bLoc = (b.insertInlineImage as InsertInlineImageRequest).location

    return bLoc.index - aLoc.index
  })
}

export default sortUpdates
