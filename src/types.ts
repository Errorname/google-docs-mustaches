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
  export?: MimeType
}

export interface DiscoveryOptions {
  source: ID
  data?: Object
  formatters?: Formatters
}

export enum MimeType {
  pdf = 'application/pdf',
  text = 'plain/text'
}
