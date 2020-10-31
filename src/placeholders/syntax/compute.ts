import { Formatters } from '../../types'
import {
  BracketToken,
  ExpressionTree,
  NumberToken,
  ParentheseToken,
  PropertyToken,
  StringToken,
  Token,
} from './types'

const DEFAULT_FALLBACK = ''

const compute = (
  expression: ExpressionTree,
  data: any,
  options: {
    formatters: Formatters
    strict: boolean
  }
) => {
  const { parts } = expression

  try {
    const evaluatedParts = parts.map((part) =>
      evaluateToken(part, null, { ...options.formatters, ...data }, true)
    )

    return typeof evaluatedParts[0] !== 'undefined'
      ? evaluatedParts.reduce((prev, formatter) => formatter(prev))
      : undefined
  } catch (error) {
    if (options.strict) {
      throw error
    }
    return DEFAULT_FALLBACK
  }
}

const evaluateToken = (
  token: Token | undefined,
  parent: any,
  data: any,
  isRoot: boolean = false
): any => {
  if (!token) return

  if (isRoot) {
    parent = data
  }

  let value

  if (token.type === 'property') {
    value = parent[(token as PropertyToken).name]
  } else if (token.type === 'bracket') {
    value = parent[evaluateToken((token as BracketToken).argument, null, data, true)]
  } else if (token.type === 'parenthese') {
    value = parent(...(token as ParentheseToken).arguments.map(evaluateToken))
  } else if (token.type === 'number') {
    value = (token as NumberToken).value
  } else if (token.type === 'string') {
    value = (token as StringToken).value
  }

  if (token.accessor) {
    return evaluateToken(token.accessor, value, data)
  }
  return value
}

export default compute
