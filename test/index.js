const Mustaches = require('../lib').default

const mustaches = new Mustaches({
  token: () =>
    'ya29.GmzKBkwGEq0-DRA2aznpdLigPXTV2h7IjHahZ8vIO-UOt8tjDAMf1MbiQXfMDz7w1RihW43WE3gk-r62mr_Pz0l9xpwihJ0idRPupCoN25ccthNnEDR23zuV-Wio7THMZyWPKcDTggk53i7i8Pc'
})

// ID of the template
const source = '11rGORd6FRxOGERe7fh6LNQfyB48ZvOgQNH6GScK_FfA'

// ID of the destination folder
const destination = '18mcqwbaXS8NOqZjztB3OUQAc5_P8M6-l'

mustaches.interpolate({
  source,
  destination,
  data: { test: 'Hello world!', arr: [42, { hell: 'yes' }], bidule: { machin: 1337 } },
  name: 'Awesome',
  export: 'application/pdf'
})
