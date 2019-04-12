import pipe from './pipe'

test('Default formatter - lowercase', () => {
  const value = pipe(
    'Thibaud',
    'lowercase',
    {}
  )

  expect(value).toBe('thibaud')
})

test('Default formatter - uppercase', () => {
  const value = pipe(
    'Thibaud',
    'uppercase',
    {}
  )

  expect(value).toBe('THIBAUD')
})

test('Default formatter - capitalize one word', () => {
  const value = pipe(
    'anTOIne',
    'capitalize',
    {}
  )

  expect(value).toBe('Antoine')
})

test('Default formatter - capitalize multiple words', () => {
  const value = pipe(
    'anTOIne caRAT',
    'capitalize',
    {}
  )

  expect(value).toBe('Antoine Carat')
})

test('Default formatter - money', () => {
  const value = pipe(
    '1500',
    'money("en", "USD", 2)',
    {}
  )

  expect(value).toBe('$1,500.00')
})
