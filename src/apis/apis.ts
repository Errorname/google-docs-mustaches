import { ID, MimeType } from '../types'
import { fetch } from './fetch'

const DRIVE_URL = 'https://www.googleapis.com/drive/v3/files'
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files'
const DOCS_URL = 'https://docs.googleapis.com/v1/documents'
const DOCS_EXPORT_URL = 'https://docs.google.com/document'

const apis = (token: Function) => {
  const f = fetch(token)

  return {
    drive: {
      create: (...args: any[]) => f(`${DRIVE_UPLOAD_URL}?uploadType=multipart&alt=json`, ...args),
      get: (id: ID, ...args: any[]) => f(`${DRIVE_URL}/${id}?fields=parents`, ...args),
      copy: (id: ID, ...args: any[]) => f(`${DRIVE_URL}/${id}/copy`, ...args),
      export: (id: ID, mimeType: MimeType, ...args: any[]) =>
        f(`${DRIVE_URL}/${id}/export?mimeType=${mimeType}`, ...args),
      ids: (count: number, ...args: any[]) => f(`${DRIVE_URL}/generateIds?count=${count}`, ...args)
    },
    docs: {
      get: (id: ID, ...args: any[]) => f(`${DOCS_URL}/${id}`, ...args),
      update: (id: ID, ...args: any[]) => f(`${DOCS_URL}/${id}:batchUpdate`, ...args),
      export: (id: ID, ...args: any[]) => f(`${DOCS_EXPORT_URL}/d/${id}/export?format=pdf`, ...args)
    }
  }
}

export default apis
