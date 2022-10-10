# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

(feature/page-topic-styles)
## Added
- components: StarsCounter
- components: TopicPill

(feature/footer)
## Added
- build: swr
- feat: footer with components/RateLimit

(feature/search)
## Added
- build: testing-library/user-event
- feat: searchbox on header { components/{ Search, Header }

(feature/delete-homepage)
## Changed
- default home renders `/topics/react` via config rewrites (old homepage was deleted)

(feature/route-topic)
## Added
- config: `.env.example`
- config: `jsconfig.json` absolute paths support using `~/`
- utils(topic) { normalizeTopicName } function
- utils(fetchers) { fetcher, fetchGQL } functions
- pages: topics/[topic]

## Changes
- config: jest: add coverage options
- config: jest: add moduleNameMapper for jest to resolve absolute path modules

(feature/testing-setup)
## Added
- build: jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom eslint-plugin-testing-library
- config: added `jest.config.js` and `jest.setup.js`
- config: test scripts to package.json `yarn test`

## Changed
- config: added `plugin:testing-library/react` to ESLint config
- config: added env{ es6, jest } to ESLint config

## [0.0.1] - 2022-10-09
## Added
- chore: bootstrapped nextjs project
- build: eslint-config-prettier

## Changed
- config: added `prettier` and `eslint:recommended` to ESLint config

