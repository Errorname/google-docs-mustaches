export interface Placeholder {
  raw: string
  position: {
    start: number
    end: number
  }
  segmentId?: string
  value?: PlaceholderValue
}

export interface TypedPlaceholder extends Placeholder {
  type: 'content' | 'comment' | 'unknown'
}

export interface ContentPlaceholder extends TypedPlaceholder {
  type: 'content'
}

export interface CommentPlaceholder extends TypedPlaceholder {
  type: 'comment'
}

export interface UnknownPlaceholder extends TypedPlaceholder {
  type: 'unknown'
}

export interface PlaceholderValueImage {
  type: 'image'
  url: string
  width?: number
  height?: number
}

export type PlaceholderValue = number | string | PlaceholderValueImage
