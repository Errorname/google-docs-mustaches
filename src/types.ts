import { Formatters } from './interpolation/types'

export type ID = string
export type AccessToken = string

export interface ConstructorOptions {
  token: () => AccessToken
}

export interface InterpolationOptions {
  source: ID
  destination?: ID
  name?: string
  data: Object
  formatters?: Formatters
  strict?: boolean
}

export interface DiscoveryOptions {
  source: ID
  data?: Object
  formatters?: Formatters
  strict?: boolean
}

export interface ExportOptions {
  file: ID
  mimeType: MimeType
  name?: string
  destination?: ID
}

export enum MimeType {
  pdf = 'application/pdf',
  text = 'plain/text'
}
