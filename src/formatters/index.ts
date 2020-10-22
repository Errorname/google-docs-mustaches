import { Formatters } from '../types'

export const listFormatters = (userDefinedFormatters: Formatters): Formatters => {
  return { ...defaultFormatters, ...userDefinedFormatters }
}

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
  money: (locale: string, currencyISO: string, fractionDigits = 0) => (s: string) => {
    const options = currencyISO ? { style: 'currency', currency: currencyISO } : {}
    return Number(s || '').toLocaleString(locale || 'en', {
      ...options,
      minimumFractionDigits: fractionDigits,
    })
  },
  image: (width: number, height: number) => (url: string) => ({
    type: 'image',
    url,
    width,
    height,
  }),
}
