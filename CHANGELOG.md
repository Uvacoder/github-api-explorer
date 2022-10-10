# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2022-10-09
## Added
- build: dependencies: `swr`, `jest`, `jest-environment-jsdom`,
  `testing-library/react`, `testing-library/jest-dom`,
  `eslint-plugin-testing-library`, `testing-library/user-event`
- tests: using jest and react-testing-library
- config: `.env.example`
- config: `~/` absolute paths support (`jsconfig.json`)
- utils: topic{normalizeTopicName}, fetchers{fetcher, fetchGQL}
- feat: pages: topics/[topic]
- feat: header searchbox
- feat: footer with rate-limit component
- color-scheme: dark support

## Changed
- homepage now displays `/topics/react` via config rewrites
- config: ESLint: added `plugin:testing-library/react` and env{es6, jest}

## Fixed
- custom 404 page to avoid style issues

## [0.0.1] - 2022-10-09
## Added
- chore: bootstrapped nextjs project
- build: eslint-config-prettier

## Changed
- config: added `prettier` and `eslint:recommended` to ESLint config

[Unreleased]: https://github.com/noeldelgado/gh-topic-explorer/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/noeldelgado/gh-topic-explorer/compare/v0.0.1...v0.1.0
