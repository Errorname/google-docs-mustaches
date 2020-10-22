import {
  CommentPlaceholder,
  ContentPlaceholder,
  PlaceholderValueImage,
  Request,
  Unit,
  UnknownPlaceholder,
} from '../types'

export const contentUpdate = (placeholder: ContentPlaceholder): Request[] => {
  const updates: Request[] = []

  // @ts-ignore
  if (placeholder.value?.type === 'image') {
    const { url, width, height } = placeholder.value as PlaceholderValueImage
    // Insert image
    updates.push({
      insertInlineImage: {
        uri: url,
        objectSize: {
          width: width ? { magnitude: width, unit: Unit.PT } : undefined,
          height: height ? { magnitude: height, unit: Unit.PT } : undefined,
        },
        location: {
          segmentId: placeholder.segmentId || '', // Empty means body
          index: placeholder.position.start,
        },
      },
    })
    // Remove mustaches
    updates.push({
      replaceAllText: {
        replaceText: '',
        containsText: {
          text: placeholder.raw,
          matchCase: true,
        },
      },
    })
  }

  // Text
  if (placeholder.value === `${placeholder.value}` || !isNaN(placeholder.value as number)) {
    updates.push({
      replaceAllText: {
        replaceText: `${placeholder.value}`,
        containsText: {
          text: placeholder.raw,
          matchCase: true,
        },
      },
    })
  }

  return updates
}

export const commentUpdate = (placeholder: CommentPlaceholder): Request => {
  return {
    replaceAllText: {
      replaceText: '',
      containsText: {
        text: placeholder.raw,
        matchCase: true,
      },
    },
  }
}

export const unknownUpdate = (placeholder: UnknownPlaceholder): Request => {
  return {
    replaceAllText: {
      replaceText: '',
      containsText: {
        text: placeholder.raw,
        matchCase: true,
      },
    },
  }
}
