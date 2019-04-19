const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')
const credentials = require('./credentials.json')

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/documents'
]

const TOKEN_PATH = 'dev/token.json'

const readFile = path =>
  new Promise((resolve, reject) =>
    fs.readFile(path, (err, content) => {
      if (err) return reject(err)
      resolve(JSON.parse(content))
    })
  )

const writeFile = (path, json) =>
  new Promise((resolve, reject) =>
    fs.writeFile(path, JSON.stringify(json), err => {
      if (err) return reject(err)
      resolve()
    })
  )

const askQuestion = text =>
  new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl.question(text, code => {
      rl.close()
      resolve(code)
    })
  })

const getNewToken = oAuth2Client =>
  new Promise(async resolve => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })
    console.log('Authorize this app by visiting this url:', authUrl)

    const code = await askQuestion('Enter the code from that page here: ')

    oAuth2Client.getToken(code, async (err, token) => {
      if (err) return console.error('Error retrieving access token', err)
      console.log(token)
      oAuth2Client.setCredentials(token)
      await writeFile(TOKEN_PATH, token)
      console.log('Token stored to', TOKEN_PATH)
      resolve(token)
    })
  })

const refreshToken = (oAuth2Client, token) =>
  new Promise(async resolve => {
    oAuth2Client.setCredentials(token)
    const accessToken = (await oAuth2Client.getRequestHeaders()).Authorization.split(' ')[1]
    token.access_token = accessToken
    await writeFile(TOKEN_PATH, token)
    console.log('Token refreshed')
    resolve()
  })

;(async () => {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

  let token
  try {
    token = await readFile(TOKEN_PATH)
    oAuth2Client.setCredentials(token)
    refreshToken(oAuth2Client, token)
  } catch (err) {
    console.error(err)
    token = await getNewToken(oAuth2Client)
  }

  console.log('\nYou can now use the playground: npm run playground')
})()
