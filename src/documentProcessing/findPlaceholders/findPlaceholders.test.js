import findPlaceholders from './findPlaceholders'

const Body = content => ({ body: { content } })
const Paragraph = elements => ({ paragraph: { elements } })
const TextRun = content => ({ textRun: { content } })
const Table = rows => ({
  tableRows: rows.map(row => ({ tableCells: row.map(cell => ({ content: cell })) }))
})

describe('findPlaceholders', () => {
  test('empty document', () => {
    const document = Body([])
    const placeholders = findPlaceholders(document)

    expect(placeholders).toEqual([])
  })

  test('document with unknown content', () => {
    const document = Body([{}, {}])
    const placeholders = findPlaceholders(document)

    expect(placeholders).toEqual([])
  })

  test('single paragraph with no placeholders', () => {
    const document = Body([Paragraph([TextRun('Hello world!')])])

    const placeholders = findPlaceholders(document)

    expect(placeholders).toEqual([])
  })

  test('multiple paragraphs with multiple placeholders', () => {
    const document = Body([
      Paragraph([TextRun('Hello {{ user.name }}')]),
      Paragraph([
        TextRun('Have you seen {{movie.title | uppercase}}?'),
        TextRun('In my opinion, I would rate it {{ movie.rating }} out of 5')
      ])
    ])

    const placeholders = findPlaceholders(document)

    expect(placeholders).toMatchSnapshot()
  })

  test('table with placeholders', () => {
    const document = Body([
      Paragraph([TextRun('Hello {{ user.name }}')]),
      Table([
        [Paragraph([TextRun('{{ upper_left }}')]), Paragraph([TextRun('{{ upper_right }}')])],
        [Paragraph([TextRun('{{ bottom_left }}')]), Paragraph([TextRun('{{ bottom_right }}')])]
      ])
    ])

    const placeholders = findPlaceholders(document)

    expect(placeholders).toMatchSnapshot()
  })
})
