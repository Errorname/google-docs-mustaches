import { Formatters } from '../types'

const defaultFormatters: Formatters = {
  lowercase: (s: string) => s.toLowerCase(),
  uppercase: (s: string) => s.toUpperCase(),
  capitalize: (s: string) =>
    s
      .split(' ')
      .map(e => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase())
      .join(' ')
}

export default (
  data: any,
  interpolation: string,
  options?: { formatters?: Formatters; fallback?: string }
): any => {
  const [path, ...transformations] = interpolation.split('|').map(s => s.trim())

  const iterative: string[] = []
  path.split('.').map(subPath => {
    const selector = subPath.match(/\[.*\]/)
    if (selector) {
      subPath = subPath.replace(selector[0], '')
      if (subPath) {
        iterative.push(subPath)
      }
      iterative.push(selector[0].slice(1, -1))
    } else {
      iterative.push(subPath)
    }
  })

  let prop = data
  for (let accessor of iterative) {
    if (prop[accessor] === undefined) {
      return (options && options.fallback) || ''
    }
    prop = prop[accessor]
  }

  const formatters: Formatters = { ...(options && options.formatters), ...defaultFormatters }

  transformations.map(transformation => {
    const formatter = formatters[transformation.toLowerCase()]
    if (formatter) {
      prop = formatter(prop)
    }
  })

  return prop
}
