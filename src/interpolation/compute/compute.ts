import dot from './dot'
import pipe from './pipe'
import { Placeholder, ContentPlaceholder, Formatters } from '../types'

export default (
  placeholder: Placeholder,
  data: Object,
  options?: { formatters?: Formatters; fallback?: string }
): ContentPlaceholder => {
  const rawWithoutBrackets = placeholder.raw.slice(2, -2).trim()

  const [inputRaw, ...transformations] = rawWithoutBrackets.split('|').map(s => s.trim())

  const input = getValue(inputRaw, data, options)

  const pipes = []
  let transformedValue = input.value
  for (let transformation of transformations) {
    const pipe = getNextValue(transformedValue, transformation, data, options)
    pipes.push(pipe)
    transformedValue = pipe.output
  }

  const output = pipes.length == 0 ? input.value : pipes[pipes.length - 1].output

  return {
    ...placeholder,
    type: 'content',
    input,
    pipes,
    output
  }
}

const getValue = (
  raw: string,
  data: Object,
  options?: { fallback?: string }
): { raw: string; error?: Error; value: any } => {
  try {
    return { raw, value: dot(raw, data) }
  } catch (error) {
    if ((options && options.fallback) === undefined) {
      return { raw, error, value: '' }
    } else {
      return { raw, error, value: options && options.fallback }
    }
  }
}

const getNextValue = (
  value: any,
  transformation: string,
  data: Object,
  options?: { formatters?: Formatters; fallback?: string }
) => {
  try {
    return {
      raw: transformation,
      output: pipe(
        value,
        transformation,
        data,
        options
      )
    }
  } catch (error) {
    return { raw: transformation, error, output: value }
  } // Ignore unknown/invalid formatters
}
