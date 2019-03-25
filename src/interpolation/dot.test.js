import dot from './dot'

test('One level interpolation', () => {
  const interpolated = dot({ name: 'Thibaud' }, 'name')

  expect(interpolated).toBe('Thibaud')
})

test('Multiple level interpolation', () => {
  const interpolated = dot({ user: { name: { first: 'Thibaud' } } }, 'user.name.first')

  expect(interpolated).toBe('Thibaud')
})

test('Array interpolation', () => {
  const interpolated = dot(
    { pokemons: [{ name: 'Pikachu' }, { name: 'Eevee' }] },
    'pokemons[1].name'
  )

  expect(interpolated).toBe('Eevee')
})

test('Array interpolation on root', () => {
  const interpolated = dot(['Pikachu', 'Eevee'], '[0]')

  expect(interpolated).toBe('Pikachu')
})

test('Unknown interpolation', () => {
  const interpolated = dot({}, 'user.name')

  expect(interpolated).toBe('')
})

test('Default formatter - lowercase', () => {
  const interpolated = dot({ name: 'Thibaud' }, 'name | lowercase')

  expect(interpolated).toBe('thibaud')
})

test('Default formatter - uppercase', () => {
  const interpolated = dot({ name: 'Thibaud' }, 'name|uppercase')

  expect(interpolated).toBe('THIBAUD')
})

test('Unknown formatter', () => {
  const interpolated = dot({ name: 'Thibaud' }, 'name | smurf')

  expect(interpolated).toBe('Thibaud')
})

test('Option fallback', () => {
  const interpolated = dot({}, 'user.name', { fallback: 'Unknown' })

  expect(interpolated).toBe('Unknown')
})

test('Option formatters', () => {
  const interpolated = dot({ name: 'Thibaud' }, 'name | smurf', {
    formatters: { smurf: txt => 'Smurf!' }
  })

  expect(interpolated).toBe('Smurf!')
})
