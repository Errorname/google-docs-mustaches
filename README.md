# google-doc-to-pdf

📝Generate PDF from Google Doc templates

[![](https://img.shields.io/npm/v/google-doc-to-pdf.svg)](https://www.npmjs.com/package/google-doc-to-pdf)
[![](https://img.shields.io/github/license/Errorname/google-doc-to-pdf.svg)](https://github.com/Errorname/google-doc-to-pdf/blob/master/LICENSE)

## How does this work?

**google-doc-to-pdf** will execute requests to the [Google Drive](https://developers.google.com/drive/api/v3/about-sdk) and [Google Docs](https://developers.google.com/docs/api/how-tos/overview) APIs to copy the file, interpolate its placeholders and generate the according PDF.

## Installation

```sh
npm install google-doc-to-pdf
```

## Basic usage

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
  name: 'Export PDF',
  data: {
    firstname: 'Thibaud',
    lastname: 'Courtoison',
    accounts: [{ money: 1500 }]
  }
})
```

## Documentation

### `new GoogleDocToPdf(options: GoogleDocToPdfOptions)`

```ts
type AccessToken = string

interface GoogleDocToPdfOptions {
  token: () => AccessToken
}
```

- `token` will be called at every request to the Google apis.

> **AccessToken** must have the following scopes:
>
> - https://www.googleapis.com/auth/drive
> - https://www.googleapis.com/auth/documents

### `gdoc.toPdf(source: ID, destination?: ID, options?: ToPdfOptions): ID`

This method will create a new Google Doc file from the `source` and into the `destination` folder.

If `options.data` is provided, this method will try to [interpolate](#interpolation) placeholders from the source file.

```ts
type ID = string

interface ToPdfOptions {
  name?: string
  data?: Object
  formatters: Formatters
}

interface Formatters {
  [name: string]: Formatter
}

type Formatter = (value: any) => string
```

- `name` will be the name of both the newly created and completed google doc file and the corresponding PDF
- `data` will be used for [interpolation](#interpolation)
- `formatters` will be used for [interpolation](#interpolation)

## Interpolation

### Mustaches

The **double brackets** notation (also known as **mustaches**) is used to define placeholders:

```
My name is {{ firstname }}. Nice to meet you!
```

During the interpolation, the placeholder will be replaced with the content of the `options.data` object.

```js
{
  firstname: 'Thibaud'
}
```

```
My name is Thibaud. Nice to meet you!
```

### Path notation

You can use **nested objects and arrays** for the interpolation:

```
{{ pokemons[1].name }}, I choose you!
```

With the following `options.data`

```js
{
  pokemons: [
    {
      name: 'Eevee',
      level: 12
    },
    {
      name: 'Pikachu',
      level: 25
    }
  ]
}
```

Will become:

```
Pikachu, I choose you!
```

### Formatters

You can use **formatters** to print your data and **more complex objects** any way you want.

There is a number of available formatters, but you can also **write your owns**

```
Hi {{ name | uppercase }}. Today is {{ today | printDay }}, tomorrow is {{ tomorrow | printDay }}.
```

With the following `options`:

```js
{
  data: {
    name: "Courtoison",
    today: new Date(),
    tomorrow: new Date(new Date().setDate(new Date().getDate()+1))
  },
  formatters: {
    printDay: date => date.toLocaleDateString('en-US',{weekday: 'long'})
  }
}
```

Will become:

```
Hi COURTOISON. Today is Thursday, tomorrow is Wednesday.
```

**Available formatters:**

- **lowercase**: `HeLLo` => `hello`
- **uppercase**: `wOrLd` => `WORLD`
- _More to come..._
