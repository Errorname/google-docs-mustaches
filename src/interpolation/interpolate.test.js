import interpolate, { findPlaceholders, analyzePlaceholders, buildUpdates } from './interpolate'

describe('interpolate', () => {
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
    const result = interpolate(document, {
      user: { name: 'Thibaud' },
      movie: { title: 'Lost in Translation', rating: 5, poster: 'http://example.img' }
    })
    const updates = buildUpdates(result)
    expect(result).toMatchSnapshot()
    expect(updates).toMatchSnapshot()
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
              elements: [
                { textRun: { content: 'Hello {{ user.name }}!' }, startIndex: 0, endIndex: 21 }
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
          }
        ]
      }
    }
    const placeholders = findPlaceholders(document)

    expect(placeholders).toMatchSnapshot()
  })
})

describe('analyzePlaceholders', () => {
  test('no placeholders', () => {
    const placeholders = analyzePlaceholders([], {})

    expect(placeholders).toEqual([])
  })

  test('contentPlaceholder - text', () => {
    const placeholders = [
      {
        raw: '{{ user.name.first | lowercase }}',
        position: {
          start: 134,
          end: 166
        }
      }
    ]

    const contentPlaceholders = analyzePlaceholders(placeholders, {
      user: { name: { first: 'Thibaud' } }
    })

    expect(contentPlaceholders).toMatchSnapshot()
  })

  test('contentPlaceholder - image', () => {
    const placeholders = [
      {
        raw: '{{ catUrl | image }}',
        position: {
          start: 134,
          end: 166
        }
      }
    ]

    const contentPlaceholders = analyzePlaceholders(placeholders, {
      catUrl: 'http://example.cat'
    })

    expect(contentPlaceholders).toMatchSnapshot()
  })

  test('contentPlaceholder - image (width)', () => {
    const placeholders = [
      {
        raw: '{{ catUrl | image(150) }}',
        position: {
          start: 134,
          end: 166
        }
      }
    ]

    const contentPlaceholders = analyzePlaceholders(placeholders, {
      catUrl: 'http://example.cat'
    })

    expect(contentPlaceholders).toMatchSnapshot()
  })

  test('contentPlaceholder - image (with, height)', () => {
    const placeholders = [
      {
        raw: '{{ catUrl | image(150, 80) }}',
        position: {
          start: 134,
          end: 166
        }
      }
    ]

    const contentPlaceholders = analyzePlaceholders(placeholders, {
      catUrl: 'http://example.cat'
    })

    expect(contentPlaceholders).toMatchSnapshot()
  })

  test('commentPlaceholder', () => {
    const placeholders = [
      {
        raw: '{{ # This is a comment }}',
        position: {
          start: 134,
          end: 158
        }
      }
    ]

    const contentPlaceholders = analyzePlaceholders(placeholders, {})

    expect(contentPlaceholders).toMatchSnapshot()
  })

  test('unknownPlaceholder - reserved symbol', () => {
    const placeholders = [
      {
        raw: '{{ % reserved symbol }}',
        position: {
          start: 134,
          end: 158
        }
      }
    ]

    const contentPlaceholders = analyzePlaceholders(placeholders, {})

    expect(contentPlaceholders).toMatchSnapshot()
  })
})

describe('buildUpdates', () => {
  test('no placeholders', () => {
    const updates = buildUpdates([])

    expect(updates).toEqual([])
  })

  test('contentPlaceholder - text', () => {
    const contentPlaceholder = {
      raw: '{{ user.name.first }}',
      position: {
        start: 0,
        end: 0
      },
      type: 'content',
      input: {
        raw: 'user.name.first',
        value: 'Thibaud'
      },
      pipes: [],
      output: 'Thibaud'
    }
    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })

  test('contentPlaceholder - text (number)', () => {
    const contentPlaceholder = {
      raw: '{{ accounts[0].money }}',
      position: {
        start: 0,
        end: 0
      },
      type: 'content',
      input: {
        raw: 'accounts[0].money',
        value: 1500
      },
      pipes: [],
      output: '1500'
    }
    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })

  test('contentPlaceholder - image', () => {
    const contentPlaceholder = {
      raw: '{{ catUrl | image }}',
      position: {
        start: 42,
        end: 47
      },
      type: 'content',
      input: {
        raw: 'catUrl',
        value: 'http://example.cat'
      },
      pipes: [],
      output: {
        url: 'http://example.cat'
      }
    }

    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })

  test('contentPlaceholder - image (width)', () => {
    const contentPlaceholder = {
      raw: '{{ catUrl | image(150) }}',
      position: {
        start: 42,
        end: 47
      },
      type: 'content',
      input: {
        raw: 'catUrl',
        value: 'http://example.cat'
      },
      pipes: [],
      output: {
        url: 'http://example.cat',
        width: 150
      }
    }

    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })

  test('contentPlaceholder - image (width, height)', () => {
    const contentPlaceholder = {
      raw: '{{ catUrl | image(150, 80) }}',
      position: {
        start: 42,
        end: 47
      },
      type: 'content',
      input: {
        raw: 'catUrl',
        value: 'http://example.cat'
      },
      pipes: [],
      output: {
        url: 'http://example.cat',
        width: 150,
        height: 180
      }
    }

    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })

  test('contentPlaceholder - unknown', () => {
    const contentPlaceholder = {
      raw: '{{ strange.type }}',
      position: {
        start: 0,
        end: 0
      },
      type: 'content',
      input: {
        raw: 'strange.type',
        value: { test: 123 }
      },
      pipes: [],
      output: { test: 123 }
    }
    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })

  test('commentPlaceholder', () => {
    const contentPlaceholder = {
      raw: '{{ # This is a comment }}',
      position: {
        start: 0,
        end: 0
      },
      type: 'comment'
    }
    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })

  test('unknownPlaceholder', () => {
    const contentPlaceholder = {
      raw: '{{ % Unknown placeholder }}',
      position: {
        start: 0,
        end: 0
      },
      type: 'not_real_type'
    }
    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })
})
