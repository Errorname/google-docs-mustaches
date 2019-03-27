import dot from './dot'

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

test('Unknown variable', () => {
  const value = dot('user.name', {})

  expect(value).toBe(null)
})
