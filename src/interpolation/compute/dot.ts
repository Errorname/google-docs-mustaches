import { Formatters } from '../../types'

export default (
  path: string,
  data: any,
  options?: { formatters?: Formatters; fallback?: string }
): any => {

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
      return null
    }
    prop = prop[accessor]
  }

  return prop
}
