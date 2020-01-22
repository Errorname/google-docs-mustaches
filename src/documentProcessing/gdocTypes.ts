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
  table?: Table
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

export interface Table {
  tableRows: TableRow[]
}

export interface TableRow {
  tableCells: TableCell[]
}

export interface TableCell {
  content: StructuralElement[]
}

/* Request */

export interface Request {
  replaceAllText?: ReplaceAllTextRequest
  insertInlineImage?: InsertInlineImageRequest
}

export interface ReplaceAllTextRequest {
  replaceText: string
  containsText: SubstringMatchCriteria
}

export interface SubstringMatchCriteria {
  text: string
  matchCase: boolean
}

export interface InsertInlineImageRequest {
  uri: string
  objectSize?: Size
  location: Location
}

export interface Size {
  height?: Dimension
  width?: Dimension
}

export interface Dimension {
  magnitude: number
  unit: Unit
}

export enum Unit {
  UNIT_UNSPECIFIED = 'UNIT_UNSPECIFIED',
  PT = 'PT'
}

export interface Location {
  segmentId: string
  index: number
}
