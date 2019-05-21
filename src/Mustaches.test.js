import Mustaches from './Mustaches'
import Blob from './polyfills/Blob'
import crossFetch from 'cross-fetch'
import {
  UndefinedVariableError,
  UnknownFormatterError
} from './documentProcessing/resolvePlaceholders/errors'

jest.mock('cross-fetch', () => jest.fn())
jest.mock('./polyfills/Blob')
Blob.mockImplementation(args => ({ args: args.join('') }))

const buildFetchImpl = crossFetch => {
  const json = val => Promise.resolve({ status: 200, json: () => val })

  crossFetch.mockImplementation(url => {
    // drive.get
    if (url.includes('?fields=parents')) {
      return json({ parents: ['parent-id-123'] })
    }
    // drive.copy
    else if (url.endsWith('/copy')) {
      return json({ id: 'new-file-id-123' })
    }
    // drive.export
    else if (url.includes('export?mimeType=')) {
      return Promise.resolve({ status: 200, blob: () => 'BLOB123' })
    }
    // drive.create
    else if (url.includes('?uploadType=')) {
      return json({ id: 'upload-id-123' })
    }
    // docs.update
    else if (url.includes(':batchUpdate')) {
      return json({ status: 'OK' })
    }
    // docs.get
    else if (url.includes('v1/documents')) {
      return json({
        body: {
          content: [
            {
              paragraph: {
                elements: [
                  {
                    textRun: {
                      content:
                        'Hello {{ name | smurf }}! Do you like {{ movies[0].title | lowercase }}?'
                    },
                    startIndex: 0,
                    endIndex: 71
                  }
                ]
              }
            }
          ]
        }
      })
    }
  })
}

describe('mustaches', () => {
  const token = () => 'my-token'

  let mustaches

  beforeEach(() => {
    crossFetch.mockReset()
    buildFetchImpl(crossFetch)

    mustaches = new Mustaches({ token })
  })

  test('interpolate', async () => {
    await mustaches.interpolate({
      source: 'source-id-123',
      destination: 'destination-id-123',
      data: {
        name: 'Thibaud',
        movies: [{ title: 'Lost in Translation' }]
      }
    })

    expect(crossFetch.mock.calls).toMatchSnapshot()
  })

  test('interpolate with no destination given', async () => {
    await mustaches.interpolate({
      source: 'source-id-123',
      data: {
        name: 'Thibaud',
        movies: [{ title: 'Lost in Translation' }]
      }
    })

    expect(crossFetch.mock.calls).toMatchSnapshot()
  })

  test('interpolate with name', async () => {
    await mustaches.interpolate({
      source: 'source-id-123',
      destination: 'destination-id-123',
      name: 'New interpolated file',
      data: {
        name: 'Thibaud',
        movies: [{ title: 'Lost in Translation' }]
      }
    })

    expect(crossFetch.mock.calls).toMatchSnapshot()
  })

  test('interpolate with custom formatters ', async () => {
    await mustaches.interpolate({
      source: 'source-id-123',
      destination: 'destination-id-123',
      data: {
        name: 'Thibaud',
        movies: [{ title: 'Lost in Translation' }]
      },
      formatters: {
        smurf: () => 'Smurf'
      }
    })

    expect(crossFetch.mock.calls).toMatchSnapshot()
  })

  test('interpolate with strict mode - undefined variable ', async () => {
    await expect(
      mustaches.interpolate({
        source: 'source-id-123',
        destination: 'destination-id-123',
        data: {
          movies: [{ title: 'Lost in Translation' }]
        },
        formatters: {
          smurf: () => 'Smurf'
        },
        strict: true
      })
    ).rejects.toThrow(UndefinedVariableError)
  })

  test('interpolate with strict mode - unknown formatter ', async () => {
    await expect(
      mustaches.interpolate({
        source: 'source-id-123',
        destination: 'destination-id-123',
        data: {
          name: 'Thibaud',
          movies: [{ title: 'Lost in Translation' }]
        },
        strict: true
      })
    ).rejects.toThrow(UnknownFormatterError)
  })

  test('discovery', async () => {
    const placeholders = await mustaches.discovery({
      source: 'source-id-123',
      data: {
        name: 'Thibaud',
        movies: [{ title: 'Lost in Translation' }]
      }
    })

    expect(crossFetch.mock.calls).toMatchSnapshot()
    expect(placeholders).toMatchSnapshot()
  })

  test('discovery with no data', async () => {
    const placeholders = await mustaches.discovery({
      source: 'source-id-123'
    })

    expect(crossFetch.mock.calls).toMatchSnapshot()
    expect(placeholders).toMatchSnapshot()
  })

  test('discovery with formatters', async () => {
    const placeholders = await mustaches.discovery({
      source: 'source-id-123',
      data: {
        name: 'Thibaud',
        movies: [{ title: 'Lost in Translation' }]
      },
      formatters: {
        smurf: () => 'Smurf'
      }
    })

    expect(crossFetch.mock.calls).toMatchSnapshot()
    expect(placeholders).toMatchSnapshot()
  })

  test('discovery with strict mode - Undefined variable', async () => {
    await expect(
      mustaches.discovery({
        source: 'source-id-123',
        data: {
          movies: [{ title: 'Lost in Translation' }]
        },
        formatters: {
          smurf: () => 'Smurf'
        },
        strict: true
      })
    ).rejects.toThrow(UndefinedVariableError)
  })

  test('discovery with strict mode - Unknown formatter', async () => {
    await expect(
      mustaches.interpolate({
        source: 'source-id-123',
        destination: 'destination-id-123',
        data: {
          name: 'Thibaud',
          movies: [{ title: 'Lost in Translation' }]
        },
        strict: true
      })
    ).rejects.toThrow(UnknownFormatterError)
  })

  test('export', async () => {
    await mustaches.export({
      file: 'source-id-123',
      mimeType: 'application/pdf'
    })

    expect(crossFetch.mock.calls).toMatchSnapshot()
  })

  test('export with name', async () => {
    await mustaches.export({
      file: 'source-id-123',
      mimeType: 'application/pdf',
      name: 'My great pdf'
    })

    expect(crossFetch.mock.calls).toMatchSnapshot()
  })

  test('export with destination', async () => {
    await mustaches.export({
      file: 'source-id-123',
      mimeType: 'application/pdf',
      destination: 'destination-id-123'
    })

    expect(crossFetch.mock.calls).toMatchSnapshot()
  })
})
