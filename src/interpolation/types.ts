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
