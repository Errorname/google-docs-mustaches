import { fetch, multipart } from './fetch'
import crossFetch from 'cross-fetch'
import Blob from '../polyfills/Blob'

jest.mock('cross-fetch', () => jest.fn())
jest.mock('../polyfills/Blob')

describe('fetch', () => {
  const token = async () => 'my-token'

  beforeEach(() => {
    crossFetch.mockReset()
    crossFetch.mockResolvedValue({ status: 200, json: () => Promise.resolve({ some: 'data' }) })
  })

  test('mimimum', async () => {
    const result = await fetch(token)('the-url')

    expect(crossFetch).toHaveBeenCalled()
    expect(crossFetch.mock.calls).toMatchSnapshot()
    expect(result).toMatchSnapshot()
  })

  test('with body', async () => {
    await fetch(token)('the-url', { test: 'test' })

    expect(crossFetch).toHaveBeenCalled()
    expect(crossFetch.mock.calls).toMatchSnapshot()
  })

  test('custom method', async () => {
    await fetch(token)('the-url', { test: 'test' }, { method: 'DELETE' })

    expect(crossFetch).toHaveBeenCalled()
    expect(crossFetch.mock.calls).toMatchSnapshot()
  })

  test('with headers', async () => {
    await fetch(token)('the-url', { test: 'test' }, { headers: { 'X-TEST': '1234' } })

    expect(crossFetch).toHaveBeenCalled()
    expect(crossFetch.mock.calls).toMatchSnapshot()
  })

  test('raw response', async () => {
    const result = await fetch(token)('the-url', { test: 'test' }, { raw: true })

    expect(crossFetch).toHaveBeenCalled()
    expect(crossFetch.mock.calls).toMatchSnapshot()
    expect(result).toMatchSnapshot()
  })

  test('http error', async () => {
    crossFetch.mockReset()
    crossFetch.mockResolvedValue({ status: 500, json: () => Promise.resolve({ some: 'data' }) })

    expect(fetch(token)('the-url')).rejects.toThrowErrorMatchingSnapshot()
  })
})

describe('multipart', () => {
  beforeAll(() => {
    Blob.mockImplementation(args => ({ args: args.join('') }))
  })

  test('minimum', () => {
    const blob = multipart([{ data: '1234' }], 'boundary1')

    expect(blob.args).toMatchSnapshot()
  })

  test('multiple parts', () => {
    const blob = multipart([{ data: '1234' }, { data: 'abcd' }], 'boundary1')

    expect(blob.args).toMatchSnapshot()
  })

  test('with headers', () => {
    const blob = multipart([{ data: '1234', Authorization: 'Bearer the-token' }], 'boundary1')

    expect(blob.args).toMatchSnapshot()
  })
})
