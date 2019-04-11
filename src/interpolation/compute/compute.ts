import dot from './dot'
import pipe from './pipe'
import { Formatters } from '../../types'
import { UnknownFormatterError, UnvalidFormatterError, UndefinedVariableError } from './errors'

export default (
  data: any,
  interpolation: string,
  options?: { formatters?: Formatters; fallback?: string }
): any => {
  const [path, ...transformations] = interpolation.split('|').map(s => s.trim())
  let value: string | undefined = '' // Added this undefined type for compilation reasons
  try {
    value = dot(path, data)
  } catch (UndefinedVariableError) {
    if ((options && options.fallback) === undefined) {
      return value
    } else {
      value = options && options.fallback
    }
  }
  let transformedValue = value
  transformations.forEach( transformation => {
    try {
      transformedValue = pipe(value, transformation, data, options)
    } catch (FormatterError) {}
  })
  
  return transformedValue
}
