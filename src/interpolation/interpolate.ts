import { GDoc, Request } from './types'

import dot from './dot'

const interpolate = (doc: GDoc, data: any): Request[] => {
  const placeholders = findPlaceholders(doc)
  return computeUpdates(placeholders, data)
}

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

const transformers = {
  lowercase: (s: string) => s.toLowerCase(),
  uppercase: (s: string) => s.toUpperCase()
}

const computeUpdates = (placeholders: string[], data: any): Request[] => {
  const replacements = placeholders.map(
    (placeholder): [string, string] => {
      const computed: string = `${dot(data, placeholder, { transformers })}`
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

export default interpolate
