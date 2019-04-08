import dot from './dot'
import pipe from './pipe'
import { Formatters } from '../../types'

export default (
  data: any,
  interpolation: string,
  options?: { formatters?: Formatters; fallback?: string }
): any => {
  const [path, ...transformations] = interpolation.split('|').map(s => s.trim())

  let value = dot(path, data) || (options && options.fallback)
  let transformedValue = value ? pipe(value, transformations, data, options): ''
  return transformedValue
}
