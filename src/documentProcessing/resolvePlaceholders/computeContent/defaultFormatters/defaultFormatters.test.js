import pipe from '../pipe'

test('Default formatter - lowercase', () => {
  const value = pipe(
    'Thibaud',
    'lowercase',
    {}
  )

  expect(value).toBe('thibaud')
})

test('Default formatter - lowercase undefined', () => {
  const value = pipe(
    undefined,
    'lowercase',
    {}
  )

  expect(value).toBe('')
})

test('Default formatter - uppercase', () => {
  const value = pipe(
    'Thibaud',
    'uppercase',
    {}
  )

  expect(value).toBe('THIBAUD')
})

test('Default formatter - uppercase undefined', () => {
  const value = pipe(
    undefined,
    'uppercase',
    {}
  )

  expect(value).toBe('')
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

test('Default formatter - capitalize undefined', () => {
  const value = pipe(
    undefined,
    'capitalize',
    {}
  )

  expect(value).toBe('')
})

test('Default formatter - money', () => {
  const value = pipe(
    '1500',
    'money("en", "USD", 2)',
    {}
  )

  expect(value).toBe('$1,500.00')
})

test('Default formatter - money undefined value', () => {
  const value = pipe(
    undefined,
    'money("en", "USD", 2)',
    {}
  )

  expect(value).toBe('$0.00')
})

test('Default formatter - money undefined locale', () => {
  const value = pipe(
    '1500',
    'money(en, "USD", 2)',
    {}
  )

  expect(value).toBe('$1,500.00')
})

test('Default formatter - money undefined ISO', () => {
  const value = pipe(
    '1500',
    'money("en", usd, 2)',
    {}
  )

  expect(value).toBe('1,500.00')
})
