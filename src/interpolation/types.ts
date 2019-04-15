/* Placeholders */

export interface Placeholder {
  type?: string
  raw: string
  position: {
    start: Number
    end: Number
  }
}

export interface ContentPlaceholder extends Placeholder {
  type: string
  input: {
    raw: string
    error?: Error
    value: any
  }
  pipes: {
    raw: string
    error?: Error
    output: any
  }[]
  output: any
}

export interface CommentPlaceholder extends Placeholder {
  type: string
  value: string
}

/* Formatters */

export interface Formatters {
  [name: string]: Formatter
}

export type Formatter = (value: any, ...params: any[]) => string

/**
 * Partial implementation of the Google Docs types
 * Documentation for Document: https://developers.google.com/docs/api/reference/rest/v1/documents
 * Documentation for Request: https://developers.google.com/docs/api/reference/rest/v1/documents/request
 */

/* Document */

export interface GDoc {
  body: Body
}

export interface Body {
  content: StructuralElement[]
}

export interface StructuralElement {
  paragraph?: Paragraph
}

export interface Paragraph {
  elements: ParagraphElement[]
}

export interface ParagraphElement {
  startIndex: number
  endIndex: number
  textRun?: TextRun
}

export interface TextRun {
  content: string
}

/* Request */

export interface Request {
  replaceAllText?: ReplaceAllTextRequest
}

export interface ReplaceAllTextRequest {
  replaceText: string
  containsText: SubstringMatchCriteria
}

export interface SubstringMatchCriteria {
  text: string
  matchCase: boolean
}
