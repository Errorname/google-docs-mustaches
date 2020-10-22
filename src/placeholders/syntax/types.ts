export interface ExpressionTree {
  raw: string
  parts: Token[]
}

export interface Token {
  type: string
  accessor?: Accessor
}

export interface PropertyToken extends Token {
  type: 'property'
  name: string
}

export interface BracketToken extends Token {
  type: 'bracket'
  argument?: Argument
}

export interface ParentheseToken extends Token {
  type: 'parenthese'
  arguments: Argument[]
}

export interface NumberToken extends Token {
  type: 'number'
  value: number
}

export interface StringToken extends Token {
  type: 'string'
  value: string
}

export type Argument = StringToken | NumberToken | PropertyToken
export type Accessor = PropertyToken | BracketToken | ParentheseToken
