import pipe from './pipe'

test('No transformation', () => {
  const value = pipe(
    'antoinecarat',
    [],
    {}
  )

  expect(value).toBe('antoinecarat')
})

test('One transformation - without parenthesis', () => {
  const value = pipe(
    'Thibaud',
    ['lowercase'],
    {}
  )

  expect(value).toBe('thibaud')
})

test('One transformation - with parenthesis, without args', () => {
  const value = pipe(
    'Thibaud',
    ['lowercase()'],
    {}
  )

  expect(value).toBe('thibaud')
})

test('One transformation - with multiple args', () => {
  const value = pipe(
    '1500',
    ['money(2, "$")'],
    {}
  )

  expect(value).toBe('1500.00$')
})

test('One transformation - with variable args', () => {
  const value = pipe(
    '1500',
    ['money(2, dollard)'],
    { dollard: '$' }
  )

  expect(value).toBe('1500.00$')
})

test('One transformation - with unknown variable args', () => {
  const value = pipe(
    '1500',
    ['money(2, dollard)'],
    { euro: '€' }
  )

  expect(value).toBe('1500')
})

test('Unknown transformation', () => {
  const value = pipe(
    'antoinecarat',
    ['wtfisthat'],
    {}
  )

  expect(value).toBe('antoinecarat')
})

test('Unvalid transformation', () => {
  const value = pipe(
    'antoinecarat',
    ['("hello")'],
    {}
  )

  expect(value).toBe('antoinecarat')
})
