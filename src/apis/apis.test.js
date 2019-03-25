import apis from './apis'

jest.mock('./fetch', () => ({
  fetch: token => url => `${url} / (token: ${token})`
}))

const allApis = apis('my-token')

test('drive', () => {
  expect(allApis.drive.create()).toMatchSnapshot()
  expect(allApis.drive.get('abcd123')).toMatchSnapshot()
  expect(allApis.drive.copy('abcd123')).toMatchSnapshot()
  expect(allApis.drive.export('abcd123', 'plain/text')).toMatchSnapshot()
  // expect(allApis.drive.ids(42)).toMatchSnapshot()
})

test('docs', () => {
  expect(allApis.docs.get('abcd123')).toMatchSnapshot()
  expect(allApis.docs.update('abcd123')).toMatchSnapshot()
  // expect(allApis.docs.export('abcd123', 'pdf')).toMatchSnapshot()
})
