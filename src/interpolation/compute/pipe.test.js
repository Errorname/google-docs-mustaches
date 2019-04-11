import pipe from './pipe'
import { UnknownFormatterError, UnvalidFormatterError } from './errors'

test('One transformation - without parenthesis', () => {
  const value = pipe(
    'Thibaud',
    'lowercase',
    {}
  )

  expect(value).toBe('thibaud')
})

test('One transformation - with parenthesis, no args', () => {
  const value = pipe(
    'Thibaud',
    'lowercase()',
    {}
  )

  expect(value).toBe('thibaud')
})

test('One transformation - multiple args', () => {
  const value = pipe(
    '1500',
    'money(2, "$")',
    {}
  )

  expect(value).toBe('1500.00$')
})

test('One transformation - with variable args', () => {
  const value = pipe(
    '1500',
    'money(2, dollar)',
    { dollar: '$' }
  )

  expect(value).toBe('1500.00$')
})

test('One transformation - with unknown variable args', () => {
  const value = pipe(
    '1500',
    'money(2, dollar)',
    { euro: '€' }
  )

  expect(value).toBe('1500')
})

test('Unknown transformation', () => {
  expect(() => {
    pipe(
      'antoinecarat',
      'wtfisthat',
      {}
    )
  }).toThrow(UnknownFormatterError)
})

test('Invalid transformation', () => {
  expect(() => {
    pipe(
      'antoinecarat',
      '("hello")',
      {}
    )
  }).toThrow(UnvalidFormatterError)
})
