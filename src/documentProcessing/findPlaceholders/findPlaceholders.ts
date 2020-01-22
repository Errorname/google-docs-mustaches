import { Placeholder } from '../types'
import { GDoc, StructuralElement } from '../gdocTypes'

const findPlaceholders = (doc: GDoc): Placeholder[] => {
  const placeholders: Placeholder[] = []
  findInContent(placeholders, doc.body.content)
  return placeholders
}

const findInContent = (placeholders: Placeholder[], content:StructuralElement[]): void => {
  content.map(c => {
    if (c.paragraph) {
      c.paragraph.elements.map(e => {
        if (e.textRun) {
          let textRun = e.textRun.content
          const matches = textRun.match(/{{([^}]*)}}/gi) || []
          for (let match of matches) {
            const start = e.startIndex + textRun.indexOf(match)
            textRun = textRun.replace(match, ''.padStart(match.length))
            placeholders.push({
              raw: match,
              position: {
                start,
                end: start + match.length
              }
            })
          }
        }
      })
    } else if (c.table) {
      c.table.tableRows.forEach(r => {
        r.tableCells.forEach(c => {
          findInContent(placeholders, c.content)
        })
      })
    } 
  })
}

export default findPlaceholders
