import buildUpdates from './buildUpdates'
describe('buildUpdates', () => {
  test('no placeholders', () => {
    const updates = buildUpdates([])

    expect(updates).toEqual([])
  })

  test('contentPlaceholder - text', () => {
    const contentPlaceholder = {
      raw: '{{ user.name.first }}',
      position: {
        start: 0,
        end: 0
      },
      type: 'content',
      input: {
        raw: 'user.name.first',
        value: 'Thibaud'
      },
      pipes: [],
      output: 'Thibaud'
    }
    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })

  test('contentPlaceholder - text (number)', () => {
    const contentPlaceholder = {
      raw: '{{ accounts[0].money }}',
      position: {
        start: 0,
        end: 0
      },
      type: 'content',
      input: {
        raw: 'accounts[0].money',
        value: 1500
      },
      pipes: [],
      output: '1500'
    }
    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })

  test('contentPlaceholder - image', () => {
    const contentPlaceholder = {
      raw: '{{ catUrl | image }}',
      position: {
        start: 42,
        end: 47
      },
      type: 'content',
      input: {
        raw: 'catUrl',
        value: 'http://example.cat'
      },
      pipes: [],
      output: {
        url: 'http://example.cat'
      }
    }

    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })

  test('contentPlaceholder - image (width)', () => {
    const contentPlaceholder = {
      raw: '{{ catUrl | image(150) }}',
      position: {
        start: 42,
        end: 47
      },
      type: 'content',
      input: {
        raw: 'catUrl',
        value: 'http://example.cat'
      },
      pipes: [],
      output: {
        url: 'http://example.cat',
        width: 150
      }
    }

    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })

  test('contentPlaceholder - image (width, height)', () => {
    const contentPlaceholder = {
      raw: '{{ catUrl | image(150, 80) }}',
      position: {
        start: 42,
        end: 47
      },
      type: 'content',
      input: {
        raw: 'catUrl',
        value: 'http://example.cat'
      },
      pipes: [],
      output: {
        url: 'http://example.cat',
        width: 150,
        height: 180
      }
    }

    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })

  test('contentPlaceholder - unknown', () => {
    const contentPlaceholder = {
      raw: '{{ strange.type }}',
      position: {
        start: 0,
        end: 0
      },
      type: 'content',
      input: {
        raw: 'strange.type',
        value: { test: 123 }
      },
      pipes: [],
      output: { test: 123 }
    }
    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })

  test('commentPlaceholder', () => {
    const contentPlaceholder = {
      raw: '{{ # This is a comment }}',
      position: {
        start: 0,
        end: 0
      },
      type: 'comment'
    }
    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })

  test('unknownPlaceholder', () => {
    const contentPlaceholder = {
      raw: '{{ % Unknown placeholder }}',
      position: {
        start: 0,
        end: 0
      },
      type: 'not_real_type'
    }
    const updates = buildUpdates([contentPlaceholder])

    expect(updates).toMatchSnapshot()
  })
})
