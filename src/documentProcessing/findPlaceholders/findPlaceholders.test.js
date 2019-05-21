import findPlaceholders from './findPlaceholders'

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
