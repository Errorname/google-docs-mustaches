import { Formatters } from '../../types'
import defaultFormatters from './formatters'
import dot from './dot'

export default (
  value: any,
  transformations: string[],
  data: any,
  options?: { formatters?: Formatters; fallback?: string }
): any => {
  const formatters: Formatters = { ...defaultFormatters, ...(options && options.formatters) }

  transformations.forEach(transformation => {
    const matches = transformation.match(/^(?<formatter>[^\(]+)(\((?<params>.+)?\))?/)

    if (matches && matches.groups && matches.groups.formatter) {
      const formatter = formatters[matches.groups.formatter.toLowerCase()]
      if (formatter) {
        let typedParams = []
        if (matches.groups.params) {
          typedParams = matches.groups.params
            .split(',')
            .map(e => e.trim())
            .map(e => {
              if (/^(\“.*\”|\".*\"|\‘.*\’|\'.*\')$/.test(e)) { // String
                return e.slice(1, -1)
              } else if (/^[-+]?([0-9]+|[0-9]+\.[0-9]*|[0-9]*\.[0-9]+)$/.test(e)) { // Number
                return +e
              } else { // Variable
                if ((options && options.fallback) === undefined) {
                  return dot(e, data)
                } else {
                  return dot(e, data) || (options && options.fallback)
                }
              }
            })
          if (typedParams.includes(null)) { // Ignore if unknown variable in params
            return value
          }
        }
        value = formatter(value, ...typedParams)
      }
    }
  })

  return value
}
