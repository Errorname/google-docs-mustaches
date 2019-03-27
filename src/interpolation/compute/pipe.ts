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
    console.log(matches)
    if (matches && matches.groups && matches.groups.formatter) {
      const formatter = formatters[matches.groups.formatter.toLowerCase()]
      if (formatter) {
        if (matches.groups.params) {
          const typedParams = matches.groups.params
            .split(',')
            .map(e => e.trim())
            .map(e => {
              if (/^(\“.*\”|\".*\"|\‘.*\’|\'.*\')$/.test(e)) { // String
                return e.slice(1, -1)
              } else if (/^[-+]?([0-9]+|[0-9]+\.[0-9]*|[0-9]*\.[0-9]+)$/.test(e)) { // Number
                return +e
              } else { // Variable
                // TODO: manage potential null return
                return dot(e, data, options)
              }
            })
          value = formatter(value, ...typedParams)
        } else {
          value = formatter(value)
        }
      }
    }
  })

  return value
}
