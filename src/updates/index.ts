import {
  CommentPlaceholder,
  ContentPlaceholder,
  Request,
  TypedPlaceholder,
  UnknownPlaceholder,
} from '../types'
import { commentUpdate, contentUpdate, unknownUpdate } from './create'
import removeDuplicates from './duplicates'
import sortUpdates from './sort'

const buildUpdates = (placeholders: TypedPlaceholder[]): Request[] => {
  let updates: Request[] = []

  // Create updates from placeholders
  for (const placeholder of placeholders) {
    if (placeholder.type == 'content') {
      updates.push(...contentUpdate(placeholder as ContentPlaceholder))
    } else if (placeholder.type == 'comment') {
      updates.push(commentUpdate(placeholder as CommentPlaceholder))
    } else if (placeholder.type == 'unknown') {
      updates.push(unknownUpdate(placeholder as UnknownPlaceholder))
    }
  }

  // Remove duplicates from `replaceAllText`
  updates = removeDuplicates(updates)

  // Sort updates
  updates = sortUpdates(updates)

  return updates
}

export default buildUpdates
