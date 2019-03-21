# Contributor documentation

You want to contribute to **google-docs-mustaches**? Great!

First, you can follow the [Getting started](#getting-started) guide.

Ready to code? Check out the [Ready to code](#ready-to-code) section to find available tools and resources to improve your contributor experience.

## Getting started

In order to start using google-docs-mustaches, you will need to follow those 6 quick steps:

1. [Install the project](#install-the-project)
2. [Create a Google App project](#create-a-google-app-project)
3. [Create an OAuth key](#create-an-oauth-key)
4. [Enable the Drive and Docs APIs](#enable-the-drive-and-docs-apis)
5. [Generate a token](#generate-a-token)
6. [Create your Docs template](#create-your-docs-template)
7. [Run the playground](#run-the-playground)

### Install the project

Before doing anything, install the project with the following commands:

```bash
git clone https://github.com/errorname/google-docs-mustaches
cd google-docs-mustaches
npm install
npm run build
```

### Create a Google App project

Go to the [New Project](https://console.developers.google.com/projectcreate) setup page. Write the name of your app.

Once the creation is complete, use the selector on the top left of the page to select your newly created app.

### Create an OAuth key

Go to the [Oauth consent screen](https://console.developers.google.com/apis/credentials/consent) and fill in with the name of your app.

Go to the [Credentials](https://console.developers.google.com/apis/credentials) page. Click on **"Create Credentials"**, choose **"OAuth Client ID"**, select **"Other"** and validate with a name for your new key.

Finally, by clicking on the arrow icon on the left of the table, download the credentials and put the JSON file at `dev/credentials.json`

### Enable the APIs

Go to those APIs and click **"Enable"**

- Drive API: https://console.developers.google.com/apis/library/drive.googleapis.com
- Docs API: https://console.developers.google.com/apis/library/docs.googleapis.com

> **Note:** Google may need a few minutes to propagate the action into their systems. Wait a couple of minutes and retry.

### Generate a token

Execute the following command:

```bash
npm run token
```

Go the URL given, authenticate with your Google account, and **copy the given code**.

Paste the code in the console. You now have a new token available for your project!

> **Note:** If you need to regenerate a token, remove the generated `dev/token.json` file and re-execute the command.

### Create your Docs template

In Google Drive, **create a new Docs file** and write the following:

```
Hello {{ firstname }} {{ lastname | uppercase }}!

You have {{ accounts[0].money }}€ in you account...
```

In the URL, retrieve the ID of the file

```
https://docs.google.com/document/d/[THE-ID-OF-THE-FILE]/edit
```

**Create a new folder** where your interpolated files will be put and also retrieve the id

```
https://drive.google.com/drive/u/0/folders/[THE-ID-OF-THE-FOLDER]
```

### Run the playground

Copy-paste the `dev/playground.js.sample` file:

```bash
cp dev/playground.js.sample dev/playground.js
```

In the `playground.js` file, replace with the ids of the template file and destination folders with yours.

You are now ready to interpolate your first mustaches:

```
npm run playground
```

You now have an interpolated file in your folder!

_Have fun!_ :rocket:

## Ready to code

If you now have a working playground, check out the list of [available commands](#available-commands) and [resources](#resources) to help you code on this project!

### Available commands

<!-- prettier-ignore-start -->

| Command | Notes |
|---|---|
| **npm run build** | This project uses **Typescript**, so you need to transpile into Javascript to run it. (Auto retranspile: `npm run build -- -w`) |
| **npm run test** | Run **Jest** for the tests. This command will also give you the code coverage of your tests. |
| **npm run lint** | Run **eslint** to check for lint issues. |
| **npm run lint:fix** | Run **eslint** to fix lint issues. |
| **npm run prettier:write** | Run **Prettier** to prettify the files. |
| **npm run prettier:check** | Run **Prettier** to check against prettier rules. |
| **npm run token** | Generate a new OAuth token and write it in `dev/token.json` |
| **npm run playground** | Run the `dev/playground.js` file |

<!-- prettier-ignore-end -->

### Resources

- Google Drive API: https://developers.google.com/drive/api/v3/about-sdk
- Google Docs API: https://developers.google.com/docs/api/reference/rest/
