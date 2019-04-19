import { UndefinedVariableError } from './errors'

export default (path: string, data: any): any => {
  const iterative: string[] = []
  path.split('.').map(subPath => {
    const selector = subPath.match(/\[.*\]/)
    if (selector) {
      if (!subPath.endsWith(selector[0])) {
        throw new SyntaxError(`Couldn't parse ${path}`)
      }
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
      throw new UndefinedVariableError(`${accessor} is undefined.`)
    }
    prop = prop[accessor]
  }

  return prop
}
