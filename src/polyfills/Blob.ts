import { Blob as BlobNode } from 'node-fetch'

const realBlob = typeof window !== 'undefined' ? window.Blob : BlobNode

export default realBlob
