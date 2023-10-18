# gas-slack-members-on-spreadsheet

## Overview

Slack の特定のチャンネルに所属している人一覧を取得し、スプレッドシートにまとめる。

## Requirement

- [yarn](https://yarnpkg.com) v1.22.19
- [Clasp](https://github.com/google/clasp) v2.4.1

## Initialization

### 1. init project

Use the package manager yarn to install Clasp4Bo.

```shell
yarn init -y
```

Install the dependencies to the local `node_modules` folder.

```shell
yarn add -d \ 
  clasp gitmoji-cli @types/google-apps-script \ 
  eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-import \
  @types/jest jest ts-jest
```

### 2. create new project

Create new project by Clasp.

```shell
clasp create
```

Sign in Google.

```shell
clasp login
```

Rewrite `.clasp.json`

```shell
{
  "scriptId": "Script ID",
  "parentId": [
    "SpreadSheet ID"
  ]
}
```

> **Warning**
> Do not commit Script ID and SpreadSheet ID.
 
##### 参考

- [【GAS】スクリプトIDを確認する方法｜プロジェクトを判断する識別子](https://blog-and-destroy.com/42782)
- [スプレッドシートID・シートIDを確認する方法｜Google Sheets API](https://blog-and-destroy.com/33158)

### 3. add settings from

Create a file called `tsconfig.json` to enable TypeScript features.

```shell
npx tsc --init
```

Create a file called `.eslintrc.yml` to enable ES Lint features.

```shell
yarn eslint --init
```

## Usage

### curl

```shell
curl -s "https://slack.com/api/conversations.members?channel=${channel_id}" \
    -H "Authorization: Bearer ${slack_api_token}" \
    -H 'Content-Type: application/json; charset=utf-8' \
    | jq
```

### lint

```shell
yarn lint
```

### build

```shell
yarn build
```

### deploy

```shell
yarn deploy
```

## Features

スプレッドシートから既存の情報を取得し、スプレッドシートに記載の無い人のみを対象に更新する.

## Author

Ryuichiro Semba
