import { Formatters } from '../../types'

const defaultFormatters: Formatters = {
  lowercase: (s: string) => s.toLowerCase(),
  uppercase: (s: string) => s.toUpperCase(),
  capitalize: (s: string) =>
    s
      .split(' ')
      .map(([head, ...tail]) => head.toUpperCase() + tail.join('').toLowerCase())
      .join(' '),
  money: (s: string, locale: string, currencyISO: string, fractionDigits = 0) =>
    Number(s)
      .toLocaleString(locale, { style: "currency", currency: currencyISO, minimumFractionDigits: fractionDigits })
}

export default defaultFormatters
