import resolvePlaceholders from './resolvePlaceholders'
import { UndefinedVariableError, UnknownFormatterError } from './errors'

describe('resolvePlaceholders', () => {
  test('no placeholders', () => {
    const placeholders = resolvePlaceholders([], {})

    expect(placeholders).toEqual([])
  })

  test('contentPlaceholder - text', () => {
    const placeholders = [
      {
        raw: '{{ user.name.first | lowercase }}',
        position: {
          start: 134,
          end: 166
        }
      }
    ]

    const contentPlaceholders = resolvePlaceholders(placeholders, {
      user: { name: { first: 'Thibaud' } }
    })

    expect(contentPlaceholders).toMatchSnapshot()
  })

  test('contentPlaceholder - image', () => {
    const placeholders = [
      {
        raw: '{{ catUrl | image }}',
        position: {
          start: 134,
          end: 166
        }
      }
    ]

    const contentPlaceholders = resolvePlaceholders(placeholders, {
      catUrl: 'http://example.cat'
    })

    expect(contentPlaceholders).toMatchSnapshot()
  })

  test('contentPlaceholder - image (width)', () => {
    const placeholders = [
      {
        raw: '{{ catUrl | image(150) }}',
        position: {
          start: 134,
          end: 166
        }
      }
    ]

    const contentPlaceholders = resolvePlaceholders(placeholders, {
      catUrl: 'http://example.cat'
    })

    expect(contentPlaceholders).toMatchSnapshot()
  })

  test('contentPlaceholder - image (with, height)', () => {
    const placeholders = [
      {
        raw: '{{ catUrl | image(150, 80) }}',
        position: {
          start: 134,
          end: 166
        }
      }
    ]

    const contentPlaceholders = resolvePlaceholders(placeholders, {
      catUrl: 'http://example.cat'
    })

    expect(contentPlaceholders).toMatchSnapshot()
  })

  test('commentPlaceholder', () => {
    const placeholders = [
      {
        raw: '{{ # This is a comment }}',
        position: {
          start: 134,
          end: 158
        }
      }
    ]

    const contentPlaceholders = resolvePlaceholders(placeholders, {})

    expect(contentPlaceholders).toMatchSnapshot()
  })

  test('unknownPlaceholder - reserved symbol', () => {
    const placeholders = [
      {
        raw: '{{ % reserved symbol }}',
        position: {
          start: 134,
          end: 158
        }
      }
    ]

    const contentPlaceholders = resolvePlaceholders(placeholders, {})

    expect(contentPlaceholders).toMatchSnapshot()
  })

  test('Unknown Formatter — strict', () => {
    const placeholders = [
      {
        raw: '{{ name | pretty }}',
        position: {
          start: 134,
          end: 153
        }
      }
    ]

    expect(() => {
      resolvePlaceholders(placeholders, { name: 'Antoine' }, { strict: true })
    }).toThrow(UnknownFormatterError)
  })

  test('Undefined variable — strict', () => {
    const placeholders = [
      {
        raw: '{{ surname | capitalize }}',
        position: {
          start: 134,
          end: 153
        }
      }
    ]

    expect(() => {
      resolvePlaceholders(placeholders, { name: 'Antoine' }, { strict: true })
    }).toThrow(UndefinedVariableError)
  })
})
