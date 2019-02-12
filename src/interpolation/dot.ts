export default (
  data: any,
  interpolation: string,
  options?: { transformers: { [name: string]: Function } }
): any => {
  const [path, ...transformations] = interpolation.split('|').map(s => s.trim())

  const iterative: string[] = []
  path.split('.').map(subPath => {
    const selector = subPath.match(/\[.*\]/)
    if (selector) {
      subPath = subPath.replace(selector[0], '')
      iterative.push(subPath)
      iterative.push(selector[0].slice(1, -1))
    } else {
      iterative.push(subPath)
    }
  })

  let prop = iterative.reduce((acc, accessor) => acc[accessor], data)

  if (options && options.transformers) {
    transformations.map(transformation => {
      const transformer = options.transformers[transformation.toLowerCase()]
      if (transformer) {
        prop = transformer(prop)
      }
    })
  }

  return prop
}
