import { Formatters, GDoc, TypedPlaceholder } from '../types'
import findPlaceholders from './findPlaceholders'
import resolvePlaceholders from './resolvePlaceholders'

const processPlaceholders = (
  doc: GDoc,
  data: Record<string, unknown>,
  formatters: Formatters,
  strict: boolean
): TypedPlaceholder[] => {
  const placeholders = findPlaceholders(doc)
  return resolvePlaceholders(placeholders, data, { formatters, strict })
}

export default processPlaceholders
