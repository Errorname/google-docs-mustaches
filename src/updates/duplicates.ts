import { Request } from '../types'

const removeDuplicates = (updates: Request[]): Request[] => {
  const filteredUpdates = []
  const mustachesSet = new Set()

  for (const update of updates) {
    if (!update.replaceAllText) {
      filteredUpdates.push(update)
    } else {
      const mustaches = update.replaceAllText.containsText.text
      if (!mustachesSet.has(mustaches)) {
        mustachesSet.add(mustaches)
        filteredUpdates.push(update)
      }
    }
  }

  return filteredUpdates
}

export default removeDuplicates
