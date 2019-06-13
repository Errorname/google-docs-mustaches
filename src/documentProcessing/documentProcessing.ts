import { Formatters, Placeholder } from './types'
import { GDoc } from './gdocTypes'

import findPlaceholders from './findPlaceholders'
import resolvePlaceholders from './resolvePlaceholders'
import buildUpdates from './buildUpdates'

const processPlaceholders = (
  doc: GDoc,
  data: any,
  formatters: Formatters,
  strict?: boolean
): Placeholder[] => {
  let placeholders = findPlaceholders(doc)
  return resolvePlaceholders(placeholders, data, { formatters, strict })
}

export default processPlaceholders
export { findPlaceholders, resolvePlaceholders, buildUpdates }
