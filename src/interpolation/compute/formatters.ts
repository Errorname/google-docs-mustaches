import { Formatters } from '../types'

const defaultFormatters: Formatters = {
  lowercase: (s: string) => (s || '').toLowerCase(),
  uppercase: (s: string) => (s || '').toUpperCase(),
  capitalize: (s: string) =>
    s
      ? s
          .split(' ')
          .map(([head, ...tail]) => head.toUpperCase() + tail.join('').toLowerCase())
          .join(' ')
      : '',
  money: (s: string, locale: string, currencyISO: string, fractionDigits = 0) => {
    const options = currencyISO ? { style: 'currency', currency: currencyISO } : {}
    return Number(s || '').toLocaleString(locale || 'en', {
      ...options,
      minimumFractionDigits: fractionDigits
    })
  },
  image: (url: string, width: number, height: number) => ({
    url,
    width,
    height
  })
}

export default defaultFormatters
