import { ID, GoogleDocToPdfOptions, ToPdfOptions } from './types'
import interpolate from './interpolation'
import { GDoc, Request } from './interpolation/types'
import apis, { multipart } from './apis'

class GoogleDocToPdf {
  apis: any

  constructor(options: GoogleDocToPdfOptions) {
    this.apis = apis(options.token)
  }

  async toPdf(source: ID, optDestination?: ID, options?: ToPdfOptions): Promise<ID> {
    // If no destination given, use same folder as source
    let destination: ID = optDestination || (await this.getParent(source))

    const { name = null, data = null, formatters = {} } = options || {}

    // If some data is given, we consider the source to be a template
    if (data) {
      let copyOptions: any = name ? { name } : {}

      // Copy template to destination
      source = await this.copyFile(source, destination, copyOptions)

      // Compute interpolations
      const doc = await this.readDoc(source)
      const updates = interpolate(doc, data, formatters)

      // Update copy with interpolations
      await this.updateDoc(source, updates)
    }

    // Export to PDF
    const pdf: Blob = await this.exportPdf(source)

    // Upload PDF to destination
    const id: ID = await this.uploadPdf(name || 'Export PDF', destination, pdf)

    return id
  }

  private copyFile(source: ID, destination: ID, options?: Object): Promise<ID> {
    return this.apis.drive
      .copy(source, { parents: [destination], ...options })
      .then(({ id }: any) => id)
  }

  private getParent(fileId: ID): Promise<ID> {
    return this.apis.drive.get(fileId).then(({ parents }: any) => parents[0])
  }

  private exportPdf(source: ID): Promise<Blob> {
    /**
     * There is two methods to export a google doc file to PDF:
     */

    // Method 1: Google Drive API (limited to 10Mo)
    return this.apis.drive.export(source, null, { raw: true }).then((r: Response) => r.blob())

    // Method 2: Google Doc API (undocumented, unlimited?)
    //return this.apis.docs.export(source, null, { raw: true }).then((r: Response) => r.blob())
  }

  private uploadPdf(name: string, destination: ID, body: any): Promise<ID> {
    const metadata = { name, parents: [destination] }

    return this.apis.drive
      .create(
        multipart(
          [
            { 'Content-Type': 'application/json; charset=UTF-8', data: JSON.stringify(metadata) },
            { 'Content-Type': 'application/pdf', 'Content-Encoding': 'base64', data: body }
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

export default GoogleDocToPdf
