# google-doc-to-pdf

## Installation

```sh
npm install google-doc-to-pdf
```

## Usage

Create a new Google Doc file and write the following text:

```
Hello {{ firstname }} {{ lastname | uppercase }}!

You have {{ accounts[0].money }}€ in you account...
```

Then execute the following code

```js
import GoogleDocToPdf from 'google-doc-to-pdf'

const gdoc = new GoogleDocToPdf({
  token: () => gapi.auth.getToken().access_token
})

// ID of the template
const source = '11rGORd6FRxOGERe7fh6LNQfyB48ZvOgQNH6GScK_FfA'

// ID of the destination folder
const destination = '18mcqwbaXS8NOqZjztB3OUQAc5_P8M6-l'

gdoc.toPdf(source, destination, {
  data: {
    firstname: 'Thibaud',
    lastname: 'Courtoison',
    accounts: [{ money: 1500 }]
  }
})
```
