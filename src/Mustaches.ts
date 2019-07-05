import { ID, ConstructorOptions, InterpolationOptions, MimeType } from './types'
import interpolate from './interpolation'
import { GDoc, Request } from './interpolation/types'
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
    resolver,
    formatters = {},
    export: exportType
  }: InterpolationOptions): Promise<ID> {
    // If no destination given, use same folder as source
    destination = destination || (await this.getParent(source))

    let copyOptions: any = name ? { name } : {}

    // Copy template to destination
    const copiedFile: ID = await this.copyFile(source, destination, copyOptions)

    // Compute interpolations
    const doc = await this.readDoc(copiedFile)
    const updates = await interpolate(doc, data, formatters, resolver)

    // Update copy with interpolations
    await this.updateDoc(copiedFile, updates)

    if (exportType) {
      // Export
      const exported: Blob = await this.export(copiedFile, exportType)

      // Upload to destination
      return this.upload(name || 'Export', destination, exportType, exported)
    }

    return copiedFile
  }

  private copyFile(source: ID, destination: ID, options?: Object): Promise<ID> {
    return this.apis.drive
      .copy(source, { parents: [destination], ...options })
      .then(({ id }: any) => id)
  }

  private getParent(fileId: ID): Promise<ID> {
    return this.apis.drive.get(fileId).then(({ parents }: any) => parents[0])
  }

  private export(source: ID, mimeType: MimeType): Promise<Blob> {
    // There is a 10Mo limit to the Google Drive API
    return this.apis.drive
      .export(source, mimeType, null, { raw: true })
      .then((r: Response) => r.blob())
  }

  private upload(name: string, destination: ID, mimeType: MimeType, body: any): Promise<ID> {
    const metadata = { name, parents: [destination] }

    return this.apis.drive
      .create(
        multipart(
          [
            { 'Content-Type': 'application/json; charset=UTF-8', data: JSON.stringify(metadata) },
            { 'Content-Type': mimeType, 'Content-Encoding': 'base64', data: body }
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

  private readDoc(file: ID): Promise<GDoc> {
    return this.apis.docs.get(file)
  }

  private updateDoc(file: ID, updates: Request[]): Promise<any> {
    return this.apis.docs.update(file, {
      documentId: file,
      requests: updates
    })
  }
}

export default Mustaches
