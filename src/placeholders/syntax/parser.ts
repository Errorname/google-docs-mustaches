import { Accessor, Argument, ExpressionTree, PropertyToken, Token } from './types'

const matchRegex = (str: string, regexp: RegExp) => {
  const match = str.match(regexp)
  if (!match) {
    throw new Error(`Couldn't parse: ${str}`)
  }
  return match.slice(1)
}

const parseExpression = (str: string): string[] => {
  const [token, rest] = matchRegex(
    str,
    /^(\w+(?:(?:\.\w+)|(?:\[.*\])|(?:\(.*\)))*)(?:\s*\|\s*(.+))?$/
  )

  if (rest) {
    return [token, ...parseExpression(rest)]
  }
  return [token]
}

const parseToken = (str: string): PropertyToken | undefined => {
  if (!str) return undefined

  const [name, rest] = matchRegex(str, /^(\w+)(.*)$/)

  return {
    type: 'property',
    name,
    accessor: parseAccessor(rest),
  }
}

const parseAccessor = (str: string): Accessor | undefined => {
  if (!str) return undefined

  const [token, rest] = matchRegex(str, /^(\.\w+|\[.*\]|\(.*\))(.*)$/)

  if (token.startsWith('[')) {
    return {
      type: 'bracket',
      argument: parseArgument(token.slice(1, -1).trim()),
      accessor: parseAccessor(rest),
    }
  } else if (token.startsWith('(')) {
    return {
      type: 'parenthese',
      arguments: parseArguments(token.slice(1, -1).trim()).map(parseArgument) as Argument[],
      accessor: parseAccessor(rest),
    }
  } else if (token.startsWith('.')) {
    return parseToken(str.slice(1))
  } else {
    throw new Error(`Couldn't parse: ${str}`)
  }
}

const parseArgument = (str: string): Argument | undefined => {
  if (str.match(/^\d+(\.\d+)?$/)) {
    return {
      type: 'number',
      value: Number(str),
    }
  } else if (str.match(/^((['"]).*?[^\\]\2)|([“”].*?[^\\][“”])$/)) {
    return {
      type: 'string',
      value: str.slice(1, -1),
    }
  } else {
    return parseToken(str)
  }
}

const parseArguments = (str: string): string[] => {
  const [arg1, , , rest] = matchRegex(
    str,
    /^((?:\w+(?:(?:\.\w+)|(?:\[.*\])|(?:\(.*\)))*)|(?:(['"]).*?[^\\]\2)|([“”].*?[^\\][“”]))(?:\s*\,\s*(.+))?$/
  )

  if (rest) {
    return [arg1.trim(), ...parseArguments(rest)]
  }
  return [arg1.trim()]
}

const parser = (raw: string): ExpressionTree => {
  const parts = parseExpression(raw).map(parseToken) as PropertyToken[]
  return { raw, parts }
}

export default parser
