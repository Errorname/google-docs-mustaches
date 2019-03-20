import interpolate, { findPlaceholders, computeUpdates } from './interpolate'

describe('interpolate', () => {
  test('full document', () => {
    const document = {
      body: {
        content: [
          {},
          {
            paragraph: {
              elements: [{ textRun: { content: 'Hello {{ user.name }}!' } }]
            }
          },
          {
            paragraph: {
              elements: [
                { textRun: { content: 'Have you seen {{movie.title | uppercase}}?' } },
                {
                  textRun: { content: 'In my opinion, I would rate it {{ movie.rating }} out of 5' }
                },
                {}
              ]
            }
          }
        ]
      }
    }
    const result = interpolate(document, {
      user: { name: 'Thibaud' },
      movie: { title: 'Lost in Translation', rating: 5 }
    })
    expect(result).toMatchSnapshot()
  })
})

describe('findPlaceholders', () => {
  test('empty document', () => {
    const document = {
      body: {
        content: []
      }
    }
    const placeholders = findPlaceholders(document)

    expect(placeholders).toEqual([])
  })

  test('document with unknown content', () => {
    const document = {
      body: {
        content: [{}, {}]
      }
    }
    const placeholders = findPlaceholders(document)

    expect(placeholders).toEqual([])
  })

  test('single paragraph with no placeholders', () => {
    const document = {
      body: {
        content: [
          {
            paragraph: {
              elements: [{ textRun: { content: 'Hello world!' } }]
            }
          }
        ]
      }
    }
    const placeholders = findPlaceholders(document)

    expect(placeholders).toEqual([])
  })

  test('multiple paragraphs with multiple placeholders', () => {
    const document = {
      body: {
        content: [
          {
            paragraph: {
              elements: [{ textRun: { content: 'Hello {{ user.name }}!' } }]
            }
          },
          {
            paragraph: {
              elements: [
                { textRun: { content: 'Have you seen {{movie.title | uppercase}}?' } },
                {
                  textRun: { content: 'In my opinion, I would rate it {{ movie.rating }} out of 5' }
                }
              ]
            }
          }
        ]
      }
    }
    const placeholders = findPlaceholders(document)

    expect(placeholders).toEqual([' user.name ', 'movie.title | uppercase', ' movie.rating '])
  })
})

describe('computeUpdates', () => {
  test('no placeholders', () => {
    const updates = computeUpdates([], {}, {})

    expect(updates).toEqual([])
  })

  test('multiple placeholders', () => {
    const updates = computeUpdates([' user.name ', 'movie.title | uppercase'], {
      user: { name: 'Thibaud' },
      movie: { title: 'Lost in Translation' }
    })

    expect(updates).toMatchSnapshot()
  })
})
