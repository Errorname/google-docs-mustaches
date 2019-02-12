export type ID = string
export type AccessToken = string

export interface GoogleDocToPdfOptions {
  token: () => AccessToken
}

export interface ToPdfOptions {
  name?: string
  data?: Object
  formatters?: Formatters
}

export interface Formatters {
  [name: string]: Formatter
}

export type Formatter = (value: any) => string
