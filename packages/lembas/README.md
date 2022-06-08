# @hirez_io/lembas 🍞✨

This library makes Smoke testing's DB seeding easier!

[![npm version](https://img.shields.io/npm/v/@hirez_io/lembas.svg?style=flat-square)](https://www.npmjs.org/package/@hirez_io/lembas)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

<br/>


# Table of Contents

<br/>

## Installation

```console
yarn add -D @hirez_io/lembas

or

npm install -D @hirez_io/lembas
```

<br/>


## THE PROBLEM: 

Smoke tests require a real database to provide the highest confidence possible.

Populating the database with data (or "DB seeding") is slow, that's why developers / testers usually just use the same DB data between all tests and "clean up" after their changes.

This strategy makes our smoke tests more fragile and less maintainable.



## THE SOLUTION: Lembas

![image](https://user-images.githubusercontent.com/1430726/172548918-b8e018a1-56bd-4ea7-ad55-56ead20c61be.png)

If the smoke test is the "Critical User Journey".. we need food for this journey.

And "Lembas" (the Elvish way-bread) is the best food we can get for our journey (god I'm a nerd 😅🤦‍♂️)


## How does it work?

1. You write the setup code for the smoke test (sending ajax requests to create entities)
   
2. You wrap with with a `lembasWrapper()`
   
3. Next time you'll run the same test it'll skip the setup code, and will populate the DB initial state from the cache.


![image](https://user-images.githubusercontent.com/1430726/172550271-2d42c96f-5fd6-49e0-82ff-f93ae73b6045.png)

## Lembas's Benefits:

* ✅ **Repeatable** - Bugs are easier to reproduce because the "snapshots" are committed to git.

* ✅ **Minimal** - Only create the data you need for the test, no need for giant db dumps from production.

* ✅ **Faster** - Restoring from cache is faster than writing data via the server layer.

* ✅ **Flexible** - Write your own "backup and restore" logic that fits your stack.
 

# Usage

In order to setup `lembas` you'll need a `lembas.json` file and 

## Setup the `lembas.json` configuration file




`lembas-hooks/` folder with 3 files: `empty.ts`, `restore.ts` and `snapshot.ts`

## `lembasWrapper( asyncSetupFunction )`

Where `asyncSetupFunction` is where your setup logic located.

It must be an `async` function (return a promise)


Example: 

```js

import {lembasWrapper} from '@hirez_io/lembas`;

export async function setup(){

  return lembasWrapper( async () => {

  })
}

```


## `emptyData()`


## Contributing

Want to contribute? Yayy! 🎉

Please read and follow our [Contributing Guidelines](CONTRIBUTING.md) to learn what are the right steps to take before contributing your time, effort and code.

Thanks 🙏

<br/>

## Code Of Conduct

Be kind to each other and please read our [code of conduct](CODE_OF_CONDUCT.md).

<br/>

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://hirez.io/?utm_source=github&utm_medium=link&utm_campaign=lembas"><img src="https://avatars1.githubusercontent.com/u/1430726?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Shai Reznik</b></sub></a><br /><a href="https://github.com/hirezio/lembas/commits?author=shairez" title="Code">💻</a> <a href="https://github.com/hirezio/lembas/commits?author=shairez" title="Tests">⚠️</a> <a href="#infra-shairez" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/hirezio/lembas/commits?author=shairez" title="Documentation">📖</a> <a href="#maintenance-shairez" title="Maintenance">🚧</a> <a href="https://github.com/hirezio/lembas/pulls?q=is%3Apr+reviewed-by%3Ashairez" title="Reviewed Pull Requests">👀</a> <a href="#ideas-shairez" title="Ideas, Planning, & Feedback">🤔</a></td>
 
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

<br/>


## License

MIT


