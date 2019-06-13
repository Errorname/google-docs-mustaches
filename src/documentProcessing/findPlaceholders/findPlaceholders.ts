import { Placeholder } from '../types'
import { GDoc } from '../gdocTypes'

const findPlaceholders = (doc: GDoc): Placeholder[] => {
  const placeholders: Placeholder[] = []

  doc.body.content.map(c => {
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
    }
  })

  return placeholders
}

export default findPlaceholders
