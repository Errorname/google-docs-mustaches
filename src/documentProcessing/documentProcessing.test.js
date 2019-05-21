import processPlaceholders, { findPlaceholders, buildUpdates } from './documentProcessing'
import { UndefinedVariableError, UnknownFormatterError } from './resolvePlaceholders/errors'

describe('documentProcessing', () => {
  test('full document', () => {
    const document = {
      body: {
        content: [
          {
            paragraph: {
              elements: [
                { textRun: { content: 'Hello {{ user.name }}!' }, startIndex: 0, endIndex: 21 },
                {}
              ]
            }
          },
          {
            paragraph: {
              elements: [
                {
                  textRun: { content: 'Have you seen {{movie.title | uppercase}}?' },
                  startIndex: 23,
                  endIndex: 64
                },
                {
                  textRun: {
                    content: 'In my opinion, I would rate it {{ movie.rating }} out of 5',
                    startIndex: 66,
                    endIndex: 123
                  }
                }
              ]
            }
          },
          {
            paragraph: {
              elements: [
                {
                  textRun: { content: '{{ movie.poster | image }}' },
                  startIndex: 124,
                  endIndex: 150
                }
              ]
            }
          }
        ]
      }
    }
    const result = processPlaceholders(document, {
      user: { name: 'Thibaud' },
      movie: { title: 'Lost in Translation', rating: 5, poster: 'http://example.img' }
    })
    const updates = buildUpdates(result)
    expect(result).toMatchSnapshot()
    expect(updates).toMatchSnapshot()
  })

  test('full document — strict - Unknown formatter', () => {
    const document = {
      body: {
        content: [
          {
            paragraph: {
              elements: [
                {
                  textRun: { content: 'Hello {{ user.name | pretty }}!' },
                  startIndex: 0,
                  endIndex: 21
                },
                {}
              ]
            }
          },
          {
            paragraph: {
              elements: [
                {
                  textRun: { content: 'Have you seen {{movie.title | uppercase}}?' },
                  startIndex: 23,
                  endIndex: 64
                },
                {
                  textRun: {
                    content: 'In my opinion, I would rate it {{ movie.rating }} out of 5',
                    startIndex: 66,
                    endIndex: 123
                  }
                }
              ]
            }
          },
          {
            paragraph: {
              elements: [
                {
                  textRun: { content: '{{ movie.poster | image }}' },
                  startIndex: 124,
                  endIndex: 150
                }
              ]
            }
          }
        ]
      }
    }
    expect(() => {
      const result = processPlaceholders(
        document,
        {
          user: { name: 'Thibaud' },
          movie: { title: 'Lost in Translation', rating: 5, poster: 'http://example.img' }
        },
        {},
        true
      )
    }).toThrow(UnknownFormatterError)
  })

  test('full document — strict - Undefined variable', () => {
    const document = {
      body: {
        content: [
          {
            paragraph: {
              elements: [
                {
                  textRun: { content: 'Hello {{ user.surname }}!' },
                  startIndex: 0,
                  endIndex: 21
                },
                {}
              ]
            }
          },
          {
            paragraph: {
              elements: [
                {
                  textRun: { content: 'Have you seen {{ movie.title | uppercase }}?' },
                  startIndex: 23,
                  endIndex: 64
                },
                {
                  textRun: {
                    content: 'In my opinion, I would rate it {{ movie.rating }} out of 5',
                    startIndex: 66,
                    endIndex: 123
                  }
                }
              ]
            }
          },
          {
            paragraph: {
              elements: [
                {
                  textRun: { content: '{{ movie.poster | image }}' },
                  startIndex: 124,
                  endIndex: 150
                }
              ]
            }
          }
        ]
      }
    }
    expect(() => {
      const result = processPlaceholders(
        document,
        {
          user: { name: 'Thibaud' },
          movie: { title: 'Lost in Translation', rating: 5, poster: 'http://example.img' }
        },
        {},
        true
      )
    }).toThrow(UndefinedVariableError)
  })

  test('full document — strict - First error is thrown first', () => {
    const document = {
      body: {
        content: [
          {
            paragraph: {
              elements: [
                {
                  textRun: { content: 'Hello {{ user.surname }}!' },
                  startIndex: 0,
                  endIndex: 21
                },
                {}
              ]
            }
          },
          {
            paragraph: {
              elements: [
                {
                  textRun: { content: 'Have you seen {{ movie.title | pretty }}?' },
                  startIndex: 23,
                  endIndex: 64
                },
                {
                  textRun: {
                    content: 'In my opinion, I would rate it {{ movie.rating }} out of 5',
                    startIndex: 66,
                    endIndex: 123
                  }
                }
              ]
            }
          },
          {
            paragraph: {
              elements: [
                {
                  textRun: { content: '{{ movie.poster | image }}' },
                  startIndex: 124,
                  endIndex: 150
                }
              ]
            }
          }
        ]
      }
    }
    expect(() => {
      const result = processPlaceholders(
        document,
        {
          user: { name: 'Thibaud' },
          movie: { title: 'Lost in Translation', rating: 5, poster: 'http://example.img' }
        },
        {},
        true
      )
    }).toThrow(UndefinedVariableError)
  })
})
