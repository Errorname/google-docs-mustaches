import { GDoc, Request } from './types'
import { Formatters } from '../types'

import compute from './compute'

const findPlaceholders = (doc: GDoc): string[] => {
  const placeholders: string[] = []

  doc.body.content.map(c => {
    if (c.paragraph) {
      c.paragraph.elements.map(e => {
        if (e.textRun) {
          const matches = e.textRun.content.match(/{{([^}]*)}}/gi) || []
          matches.map(m => placeholders.push(m.slice(2, -2)))
        }
      })
    }
  })

  return placeholders
}

const computeUpdates = (placeholders: string[], data: any, formatters: Formatters): Request[] => {
  const replacements = placeholders.map(
    (placeholder): [string, string] => {
      const computed: string = `${compute(data, placeholder, { formatters })}`
      return [placeholder, computed]
    }
  )

  return replacements.map(([placeholder, computed]) => ({
    replaceAllText: {
      replaceText: computed,
      containsText: {
        text: `{{${placeholder}}}`,
        matchCase: false
      }
    }
  }))
}

const interpolate = (doc: GDoc, data: any, formatters: Formatters): Request[] => {
  const placeholders = findPlaceholders(doc)
  return computeUpdates(placeholders, data, formatters)
}

export default interpolate
export { findPlaceholders, computeUpdates }
