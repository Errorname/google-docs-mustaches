export * from './gdoc'
export * from './placeholder'

/** Google API */

export type ID = string
export type AccessToken = string

export enum MimeType {
  pdf = 'application/pdf',
  text = 'plain/text',
}

/** Google Docs Mustaches */

export interface ConstructorOptions {
  token: GetToken
}

export interface InterpolationOptions {
  source: ID
  destination?: ID
  name?: string
  data: Record<string, unknown>
  formatters?: Formatters
  strict?: boolean
}

export interface DiscoverOptions {
  source: ID
  data?: Record<string, unknown>
  formatters?: Formatters
  strict?: boolean
}

export type GetToken = () => Promise<AccessToken> | AccessToken

export interface ExportOptions {
  file: ID
  mimeType: MimeType
  name?: string
  destination?: ID
}

export interface Formatters {
  [name: string]: Formatter
}

export type Formatter = (value: any, ...params: any[]) => any
