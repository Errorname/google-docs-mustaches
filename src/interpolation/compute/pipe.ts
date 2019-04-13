import { Formatters } from '../../types'
import defaultFormatters from './formatters'
import dot from './dot'
import { UnvalidFormatterError, UnknownFormatterError } from './errors';

export default (
  value: any,
  transformation: string,
  data: any,
  options?: { formatters?: Formatters; fallback?: string }
): any => {
  const formatters: Formatters = { ...defaultFormatters, ...(options && options.formatters) }
    const matches = transformation.match(/^(?<formatter>[^\(]+)(\((?<params>.+)?\))?/)

    if (matches && matches.groups && matches.groups.formatter) {
      const formatterName = matches.groups.formatter.toLowerCase()
      const formatter = formatters[formatterName]
      if (formatter) {
        let typedParams = []
        if (matches.groups.params) {
          try {
            typedParams = matches.groups.params
              .split(',')
              .map(e => e.trim())
              .map(e => {
                if (/^(\“.*\”|\".*\"|\‘.*\’|\'.*\')$/.test(e)) { // String
                  return e.slice(1, -1)
                } else if (/^[-+]?([0-9]+|[0-9]+\.[0-9]*|[0-9]*\.[0-9]+)$/.test(e)) { // Number
                  return Number(e)
                } else if (/^true|false$/.test(e)) { //Boolean
                  return Boolean(e)
                } else { // Variable
                  try {
                    return dot(e, data)
                  } catch (err) {
                    if ((options && options.fallback) === undefined) {
                      throw err
                    } else {
                      return options && options.fallback
                    }
                  }
                }
              }
            )
          } catch (err) { // Ignore the formatter if unknown variable (w/o fallback) in params
            return value
          }
        }
        value = formatter(value, ...typedParams)
      } else {
        throw new UnknownFormatterError(`${formatterName} is not defined.`)
      }
    } else {
      throw new UnvalidFormatterError(`${transformation} is not a valid formatter.`)
    }
  return value
}
