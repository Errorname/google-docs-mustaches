import dot from './dot'
import pipe from './pipe'
import { Formatters } from '../../types'

export default (
  data: any,
  interpolation: string,
  options?: { strict?: Boolean; formatters?: Formatters; fallback?: string }
): any => {
  const [path, ...transformations] = interpolation.split('|').map(s => s.trim())
  let value: string | undefined = '' // Added this undefined type for compilation reasons
  try {
    value = dot(path, data)
  } catch (err) {
    if (options && options.strict) {
      throw err
    }

    if ((options && options.fallback) === undefined) {
      return value
    } else {
      value = options && options.fallback
    }
  }
  let transformedValue = value
  transformations.forEach(transformation => {
    try {
      transformedValue = pipe(
        value,
        transformation,
        data,
        options
      )
    } catch (err) {
      if (options && options.strict) {
        throw err
      }
    } // Ignore unknown/invalid formatters
  })

  return transformedValue
}
