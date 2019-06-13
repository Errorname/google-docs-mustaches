import { Placeholder, Formatters } from '../types'

import computeContent from './computeContent'

const resolvePlaceholders = (
  placeholders: Placeholder[],
  data: Record<string, any>,
  options?: {
    formatters?: Formatters
    strict?: boolean
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

export default resolvePlaceholders
