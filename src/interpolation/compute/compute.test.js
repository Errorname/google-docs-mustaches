import compute from './compute'
import { UndefinedVariableError, UnknownFormatterError } from './errors'

const buildPlaceholder = txt => ({
  raw: `{{ ${txt} }}`,
  position: {
    start: 0,
    end: txt.length + 6
  }
})

test('One level variable', () => {
  const interpolated = compute(buildPlaceholder('name'), { name: 'Thibaud' })

  expect(interpolated.output).toBe('Thibaud')
  expect(interpolated).toMatchSnapshot()
})

test('Multiple level variable', () => {
  const interpolated = compute(buildPlaceholder('user.name.first'), {
    user: { name: { first: 'Thibaud' } }
  })

  expect(interpolated.output).toBe('Thibaud')
  expect(interpolated).toMatchSnapshot()
})

test('Array variable', () => {
  const interpolated = compute(buildPlaceholder('pokemons[1].name'), {
    pokemons: [{ name: 'Pikachu' }, { name: 'Eevee' }]
  })

  expect(interpolated.output).toBe('Eevee')
  expect(interpolated).toMatchSnapshot()
})

test('Array interpolation on root', () => {
  const interpolated = compute(buildPlaceholder('[0]'), ['Pikachu', 'Eevee'])

  expect(interpolated.output).toBe('Pikachu')
  expect(interpolated).toMatchSnapshot()
})

test('Default formatter - lowercase', () => {
  const interpolated = compute(buildPlaceholder('name | lowercase'), { name: 'Thibaud' })

  expect(interpolated.output).toBe('thibaud')
  expect(interpolated).toMatchSnapshot()
})

test('Default formatter - uppercase', () => {
  const interpolated = compute(buildPlaceholder('name|uppercase'), { name: 'Thibaud' })

  expect(interpolated.output).toBe('THIBAUD')
  expect(interpolated).toMatchSnapshot()
})

test('Default formatter - capitalize one word', () => {
  const interpolated = compute(buildPlaceholder('name | capitalize'), { name: 'anTOIne' })

  expect(interpolated.output).toBe('Antoine')
  expect(interpolated).toMatchSnapshot()
})

test('Default formatter - capitalize two words', () => {
  const interpolated = compute(buildPlaceholder('name | capitalize'), { name: 'anTOIne caRAT' })

  expect(interpolated.output).toBe('Antoine Carat')
  expect(interpolated).toMatchSnapshot()
})

test('Option formatters', () => {
  const interpolated = compute(
    buildPlaceholder('name | smurf'),
    { name: 'Thibaud' },
    {
      formatters: { smurf: txt => 'Smurf!' }
    }
  )

  expect(interpolated.output).toBe('Smurf!')
  expect(interpolated).toMatchSnapshot()
})

test('Option formatters awaiting for param', () => {
  const interpolated = compute(
    buildPlaceholder('name | smurf(true)'),
    { name: 'Thibaud' },
    {
      formatters: { smurf: (txt, smurf) => (smurf ? 'Smurf!' : txt) }
    }
  )

  expect(interpolated.output).toBe('Smurf!')
  expect(interpolated).toMatchSnapshot()
})

// Strict: false
test('Unknown variable', () => {
  const interpolated = compute(buildPlaceholder('user.name'), {})

  expect(interpolated.output).toBe('')
  expect(interpolated).toMatchSnapshot()
})

test('Unknown variable - with formatter', () => {
  const interpolated = compute(buildPlaceholder('user.name | capitalize'), {})

  expect(interpolated.output).toBe('')
  expect(interpolated).toMatchSnapshot()
})

test('Unknown variable - with option fallback', () => {
  const interpolated = compute(buildPlaceholder('user.name'), {}, { fallback: 'Unknown' })

  expect(interpolated.output).toBe('Unknown')
  expect(interpolated).toMatchSnapshot()
})

test('Unknown variable - with empty string as fallback', () => {
  const interpolated = compute(buildPlaceholder('user.name'), {}, { fallback: '' })

  expect(interpolated.output).toBe('')
  expect(interpolated).toMatchSnapshot()
})

test('Unknown formatter', () => {
  const interpolated = compute(buildPlaceholder('name | smurf'), { name: 'Thibaud' })

  expect(interpolated.output).toBe('Thibaud')
  expect(interpolated).toMatchSnapshot()
})

test('Unknown formatter in middle is ignored', () => {
  const interpolated = compute(buildPlaceholder('name | smurf | lowercase'), { name: 'Thibaud' })

  expect(interpolated.output).toBe('thibaud')
  expect(interpolated).toMatchSnapshot()
})

// Strict: true
test('Unknown variable — strict', () => {
  expect(() => {
    compute(buildPlaceholder('user.name'), {}, { strict: true })
  }).toThrow(UndefinedVariableError)
})

test('Unknown variable - with formatter — strict', () => {
  expect(() => {
    compute(buildPlaceholder('user.name | capitalize'), {}, { strict: true })
  }).toThrow(UndefinedVariableError)
})

test('Unknown variable - with option fallback — strict', () => {
  expect(() => {
    compute(buildPlaceholder('user.name'), {}, { strict: true, fallback: 'Unknown' })
  }).toThrow(UndefinedVariableError)
})

test('Unknown formatter — strict', () => {
  expect(() => {
    compute(buildPlaceholder('name | smurf'), { name: 'Thibaud' }, { strict: true })
  }).toThrow(UnknownFormatterError)
})

test('Unknown formatter in middle — strict', () => {
  expect(() => {
    compute(buildPlaceholder('name | smurf | lowercase'), { name: 'Thibaud' }, { strict: true })
  }).toThrow(UnknownFormatterError)
})
