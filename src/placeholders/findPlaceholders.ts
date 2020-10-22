import { GDoc, Placeholder, StructuralElement } from '../types'

const findPlaceholders = (doc: GDoc): Placeholder[] => {
  const placeholders: Placeholder[] = []

  // Body
  placeholders.push(...findInContent(doc.body.content))

  // Headers
  for (const header of Object.values(doc.headers || {})) {
    placeholders.push(...findInContent(header.content, header.headerId))
  }

  // Footers
  for (const footer of Object.values(doc.footers || {})) {
    placeholders.push(...findInContent(footer.content, footer.footerId))
  }

  return placeholders
}

const findInContent = (content: StructuralElement[], segmentId?: string): Placeholder[] => {
  const placeholders: Placeholder[] = []

  for (const element of content) {
    // Paragraph
    if (element.paragraph) {
      for (const paragraphElement of element.paragraph.elements) {
        if (paragraphElement.textRun) {
          const textRun = paragraphElement.textRun.content
          const matches = textRun.match(/{{([^}]+)}}/gi) || []
          for (const match of matches) {
            const start = (paragraphElement.startIndex || 1) + textRun.indexOf(match)

            placeholders.push({
              raw: match,
              position: {
                start,
                end: start + match.length,
              },
              segmentId,
            })
          }
        }
      }
    }
    // Table
    else if (element.table) {
      element.table.tableRows.forEach((row) => {
        row.tableCells.forEach((cell) => {
          placeholders.push(...findInContent(cell.content, segmentId))
        })
      })
    }
  }

  return placeholders
}

export default findPlaceholders
