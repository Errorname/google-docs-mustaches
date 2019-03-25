import crossFetch from 'cross-fetch'
import Blob from '../polyfills/Blob'

export const fetch = (token: Function): Function => (
  url: string,
  body: any = null,
  options: { method?: string; headers?: any; raw?: boolean } = {}
): Promise<Response> => {
  const { method, headers, raw, ...rest } = options

  if (body && !(Blob && body instanceof Blob)) {
    body = JSON.stringify(body)
  }

  return crossFetch(url, {
    method: method || (body ? 'POST' : 'GET'),
    body,
    headers: {
      authorization: `Bearer ${token()}`,
      'Content-Type': 'application/json',
      ...headers
    },
    ...rest
  }).then(async result => {
    if (result.status !== 200) {
      throw new Error(`Fetch Error: status ${result.status}`)
    }
    return raw ? result : result.json()
  })
}

export const multipart = (
  parts: {
    data: string
    [propName: string]: string
  }[],
  boundary: string
): Blob => {
  const body = []

  parts.map(part => {
    const { data, ...headers } = part
    body.push(
      [
        `--${boundary}`,
        ...Object.entries(headers).map(([key, value]) => `${key}: ${value}`),
        '\n'
      ].join('\n')
    )
    body.push(data)
    body.push('\n\n')
  })

  body.push(`--${boundary}--`)

  return new Blob(body)
}
