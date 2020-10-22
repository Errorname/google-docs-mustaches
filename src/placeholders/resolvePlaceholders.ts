import { Formatters, Placeholder, TypedPlaceholder } from '../types'
import { compute, parser } from './syntax'

const resolvePlaceholders = (
  placeholders: Placeholder[],
  data: Record<string, unknown>,
  options: {
    formatters: Formatters
    strict: boolean
  }
): TypedPlaceholder[] => {
  return placeholders.map((placeholder) => {
    const rawWithoutBrackets = placeholder.raw.slice(2, -2).trim()

    // Comment Placeholder
    if (rawWithoutBrackets.startsWith('#')) {
      return {
        ...placeholder,
        type: 'comment',
        value: rawWithoutBrackets.slice(1).trim(),
      }
    }

    // Future Placeholders
    if (['%', '@'].includes(rawWithoutBrackets[0])) {
      // Reserved for later usage
      return {
        ...placeholder,
        type: 'unknown',
      }
    }

    // Content Placeholder
    const expression = parser(rawWithoutBrackets)
    const result = compute(expression, data, options)
    return {
      ...placeholder,
      type: 'content',
      value: result,
    }
  })
}

export default resolvePlaceholders
