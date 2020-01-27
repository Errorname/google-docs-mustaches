import {
  ID,
  ConstructorOptions,
  InterpolationOptions,
  DiscoverOptions,
  ExportOptions,
  MimeType
} from './types'
import processPlaceholders, { buildUpdates } from './documentProcessing'
import { Placeholder } from './documentProcessing/types'
import { GDoc, Request } from './documentProcessing/gdocTypes'
import apis, { multipart } from './apis'
import Blob from './polyfills/Blob'

class Mustaches {
  apis: any

  constructor(options: ConstructorOptions) {
    this.apis = apis(options.token)
  }

  async interpolate({
    source,
    destination,
    name,
    data,
    formatters = {},
    strict
  }: InterpolationOptions): Promise<ID> {
    // If no destination given, use same folder as source
    destination = destination || (await this.getParent(source))

    let copyOptions: any = name ? { name } : {}

    // Copy template to destination
    const copiedFile: ID = await this.copyFile(source, destination, copyOptions)

    // Compute updates
    const placeholders = await this.discover({ source: copiedFile, data, formatters, strict })
    const updates = buildUpdates(placeholders)

    // Update copy with interpolations
    await this.updateDoc(copiedFile, updates)

    return copiedFile
  }

  async discover({
    source,
    data = {},
    formatters = {},
    strict
  }: DiscoverOptions): Promise<Placeholder[]> {
    const doc = await this.readDoc(source)
    return processPlaceholders(doc, data, formatters, strict)
  }

  async export({ file, mimeType, name, destination }: ExportOptions): Promise<ID> {
    // If no destination given, use same folder as source
    destination = destination || (await this.getParent(file))

    // There is a 10Mo limit to the Google Drive API
    const exported: Blob = await this.apis.drive
      .export(file, mimeType, null, { raw: true })
      .then((r: Response) => r.blob())

    // Upload to destination
    return this.upload(name || 'Export', destination, mimeType, exported)
  }

  async readDoc(file: ID): Promise<GDoc> {
    return this.apis.docs.get(file)
  }

  private getParent(fileId: ID): Promise<ID> {
    return this.apis.drive.get(fileId).then(({ parents }: any) => parents[0])
  }

  private copyFile(source: ID, destination: ID, options?: Object): Promise<ID> {
    return this.apis.drive
      .copy(source, { parents: [destination], ...options })
      .then(({ id }: any) => id)
  }

  private updateDoc(file: ID, updates: Request[]): Promise<any> {
    return this.apis.docs.update(file, {
      documentId: file,
      requests: updates
    })
  }

  private async upload(name: string, destination: ID, mimeType: MimeType, body: any): Promise<ID> {
    const metadata = { name, parents: [destination] }

    const data = await body.arrayBuffer()

    return this.apis.drive
      .create(
        multipart(
          [
            { 'Content-Type': 'application/json; charset=UTF-8', data: JSON.stringify(metadata) },
            { 'Content-Type': mimeType, 'Content-Encoding': 'base64', data }
          ],
          '--BOUNDARY'
        ),
        {
          headers: {
            ['Content-Type']: 'multipart/related; boundary=--BOUNDARY',
            Accept: 'application/json'
          }
        }
      )
      .then(({ id }: any) => id)
  }
}

export default Mustaches
