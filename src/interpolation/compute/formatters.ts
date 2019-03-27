import { Formatters } from '../../types'

const defaultFormatters: Formatters = {
  lowercase: (s: string) => s.toLowerCase(),
  uppercase: (s: string) => s.toUpperCase(),
  capitalize: (s: string) =>
    s
      .split(' ')
      .map(([head, ...tail]) => head.toUpperCase() + tail.join('').toLowerCase())
      .join(' '),
  money: (s: string, round: number, currency: string) => parseInt(s).toFixed(round) + currency
}

export default defaultFormatters
