const Blob = require('fetch-blob')

const realBlob = typeof window !== 'undefined' ? window.Blob : Blob

export default realBlob
