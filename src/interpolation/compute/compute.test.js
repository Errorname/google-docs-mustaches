import compute from './compute'

test('One level variable', () => {
  const interpolated = compute({ name: 'Thibaud' }, 'name')

  expect(interpolated).toBe('Thibaud')
})

test('Multiple level variable', () => {
  const interpolated = compute({ user: { name: { first: 'Thibaud' } } }, 'user.name.first')

  expect(interpolated).toBe('Thibaud')
})

test('Array variable', () => {
  const interpolated = compute(
    { pokemons: [{ name: 'Pikachu' }, { name: 'Eevee' }] },
    'pokemons[1].name'
  )

  expect(interpolated).toBe('Eevee')
})

test('Array interpolation on root', () => {
  const interpolated = compute(['Pikachu', 'Eevee'], '[0]')

  expect(interpolated).toBe('Pikachu')
})

test('Default formatter - lowercase', () => {
  const interpolated = compute({ name: 'Thibaud' }, 'name | lowercase')

  expect(interpolated).toBe('thibaud')
})

test('Default formatter - uppercase', () => {
  const interpolated = compute({ name: 'Thibaud' }, 'name|uppercase')

  expect(interpolated).toBe('THIBAUD')
})

test('Default formatter - capitalize one word', () => {
  const interpolated = compute({ name: 'anTOIne' }, 'name | capitalize')

  expect(interpolated).toBe('Antoine')
})

test('Default formatter - capitalize two words', () => {
  const interpolated = compute({ name: 'anTOIne caRAT' }, 'name | capitalize')

  expect(interpolated).toBe('Antoine Carat')
})

test('Unknown variable', () => {
  const interpolated = compute({}, 'user.name')

  expect(interpolated).toBe('')
})

test('Unknown variable - with option fallback', () => {
  const interpolated = compute({}, 'user.name', { fallback: 'Unknown' })

  expect(interpolated).toBe('Unknown')
})

test('Unknown formatter', () => {
  const interpolated = compute({ name: 'Thibaud' }, 'name | smurf')

  expect(interpolated).toBe('Thibaud')
})

test('Option formatters', () => {
  const interpolated = compute({ name: 'Thibaud' }, 'name | smurf', {
    formatters: { smurf: txt => 'Smurf!' }
  })

  expect(interpolated).toBe('Smurf!')
})
