import dot from './dot'
import { UndefinedVariableError } from './errors'

test('One level variable', () => {
  const value = dot('name', { name: 'Thibaud' })

  expect(value).toBe('Thibaud')
})

test('Multiple level variable', () => {
  const value = dot('user.name.first', { user: { name: { first: 'Thibaud' } } })

  expect(value).toBe('Thibaud')
})

test('Array index access - on a variable', () => {
  const value = dot('pokemons[1].name', { pokemons: [{ name: 'Pikachu' }, { name: 'Eevee' }] })

  expect(value).toBe('Eevee')
})

test('Array index access - on root', () => {
  const value = dot('[0]', ['Pikachu', 'Eevee'])

  expect(value).toBe('Pikachu')
})

test('Unknown variable at root level', () => {
  expect(() => {
    dot('user', {})
  }).toThrow(UndefinedVariableError)
})

test('Unknown variable on deeper level', () => {
  expect(() => {
    dot('user.name.first', {
      user: {
        name: 'Antoine Carat'
      }
    })
  }).toThrow(UndefinedVariableError)
})
