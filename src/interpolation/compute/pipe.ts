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

  if (!matches || !matches.groups || !matches.groups.formatter) {
    throw new UnvalidFormatterError(`${transformation} is not a valid formatter.`)
  }

  const formatterName = matches.groups.formatter.toLowerCase()
  const formatter = formatters[formatterName]

  if (!formatter) {
    throw new UnknownFormatterError(`${formatterName} is not defined.`)
  }

  let typedParams = []
  if (matches.groups.params) {
    typedParams = normalizeParams(matches.groups.params.split(','), data, options)
  }

  return formatter(value, ...typedParams)
}

const normalizeParams = function(untypedParams: string[], data: any, options?: { formatters?: Formatters; fallback?: string }) {
  return untypedParams.map(e => e.trim())
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
          return undefined
        }
      }
    }
  )
}