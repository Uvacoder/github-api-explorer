# GitHub Topic Explorer

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Preview

https://gh-topic-explorer.vercel.app/

## Install

```bash
npm install
# or
yarn install

# copy and fill the env file with your personal access token
cp .env.example .env.local
```

## Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tests

```bash
npm run test:ci
# or
yarn test:ci
```

---

# Design Document

October 8, 2022

## Overview

We want to build a react web application that displays topics related to the term "react" using the GitHub GraphQL API. It should also display how many stargazers each topic has. When a topic is clicked, it should display the topics related to that topic and how many stargazers they have. There should also be search capability to query on any term.

This document describes at high-level how we could build the app, how the design could met requirements, how to get the required data from GitHub GraphQL API, input validation, and more.

## Motivation

This task is part of a take-home assessment for a Senior Frontend Engineer position.

## Requirements

- Display related topics for the term 'react' by default
	- Display stargazers count for each topic
- Allow displayed topics to be clickable
	- Show related topics to that topic on click
		- Display stargazers count for each topic
- Provide search capability to query any term or topic
- Implement best practices with the UI

## Constraints

- Web-based solution, accessed via URL
- Should be built using React
- Should use GitHub GraphQL API to get the data

## Assumptions

- Design flaws and potentially contentious aspects of the design will be found early on through the peer review process of this document.
- Another assumption is that all aspects of this project can work together in the way the designer is expecting.

## Design Overview

### Get the data: GitHub API queries

#### Default state

Get related topics and stargazers count for the topic "react".

**Note:** [`relatedTopics`](https://docs.github.com/en/graphql/reference/objects#topic) is constrained to return up to 10 Topics.

```gql
query {
  topic(name: "react") {
    name
    stargazerCount
    relatedTopics(first: 10) {
      name
      stargazerCount
    }
  }
}
```

With a valid API key, the previous query should return something like this:

```
{
  "data": {
    "topic": {
      "name": "react",
      "stargazerCount": 78800,
      "relatedTopics": [
        {
          "name": "web",
          "stargazerCount": 1554
        }
        ...
      ]
    }
  }
}
```

That'll give us all the data we need to display our default state/page for the "react" term.

#### Topic Click

Whenever a Topic is clicked, we need to display its related topics with how many stargazers each topic has. The previous query can be used to retrieve individual Topic's data just by replacing the query's topic `name` parameter to the topic we are interested in. E.g:

```gql
query {
  topic(name: "${clicked-topic-name}") {
    name
    stargazerCount
    relatedTopics(first: 10) {
      name
      stargazerCount
    }
  }
}
```

#### Search by Topic

Similarly, we could re-use the same query above to query on any term/topic.

```gql
query {
  topic(name: "${user-input-term}") {
    name
    stargazerCount
    relatedTopics(first: 10) {
      name
      stargazerCount
    }
  }
}
```

#### Conclusion

We should be able to get all the data we need by using a single dynamic query that accepts `$topic_name` as a variable.

### Normalize User Input

I couldn't find any documentation regarding the constraints of querying topic names beyond that it must be a string (UTF-8) and that it was required.

- Reference: [Queries.topic](https://docs.github.com/en/graphql/reference/queries#topic)

So I tried to figure out some rules myself, and this is what I found out:

- string should not include **whitespace in either end** — `" react"`, `"react "` or `"
  react "` will return `null`
	- we could use [`trim()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim) to remove whitespace from both ends
- string should not include whitespace inside — `"deep learning"` returns `null`
  while `"deep-learning"` will work
  - we could use `replace(/\s+/g, '-')` to replace all remaining space-characters with dash
- should be lowercase — `"React"` will return `null`
  - use [`toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase) to convert the string value to lower case
- string shouldn't be longer than 35 characters — `"12345678901234567890123456789012345"`(35) will return while `"123456789012345678901234567890123456"`(36) will return `null`
  - we could use `maxLength=35` on the input just in case
- string should not include emojis — `👍` will error
  - remove any Emoji characters using [unicode property escapes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes) for `{Emoji_Component}` and `{Extended_Pictographic}`, e.g.: `.replace(/\p{Emoji_Component}|\p{Extended_Pictographic}/ug, '')`
- string should not contain accents/diacritics — `bublé` returns `null` while `buble` will work
  - use [`normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) to return the unicode normalization form of the string and remove diacritics using the `Diacritic` Unicode category class. e.g.: `str.normalize("NFKD").replace(/\p{Diacritic}/gu, "")` [more info: stackoverflow](https://stackoverflow.com/a/37511463)

#### Conclusion

Our final normalization function could be something like this:

```js
function normalizeTopicName(name = '') {
	if (typeof name !== 'stirng')
		return ''

	return name
		// return the unicode normalization form of the string
		?.normalize('NFKD')
		// convert the string value to lower case
		.toLowerCase()
		// remove any Emoji and diacritics
		.replace(/\p{Emoji_Component}|\p{Extended_Pictographic}|\p{Diacritic}/gu, '')
		// remove whitespace from both ends
		.trim()
		// replace all remaining space-characters with dash
		.replace(/\s+/g, '-')
}
```

### Keep API Key Private

We could make requests to the API from our client as long as we include the `authorization` header with a valid OAuth token to the request. However, exposing personal access tokens (or any kind of secret in that regard) should be avoided. This data must be protected. We highly recommend moving those requests to a server or similar.

The easiest way I can think of to spin up a server quickly is by using [Next.js](https://nextjs.org/). Next.js allow us to create [new](https://nextjs.org/docs/routing/introduction) [routes](https://nextjs.org/docs/api-routes/introduction) super easy. Not only will do all the heavy lifting for us — automatic setup, zero-configuration, [data fetching](https://nextjs.org/docs/basic-features/data-fetching/overview), [routing](https://nextjs.org/docs/routing/introduction), performance optimizations, [caching](https://nextjs.org/docs/going-to-production#caching), [redirects](https://nextjs.org/docs/api-reference/next.config.js/redirects), etc etc etc — we can even [deploy](https://nextjs.org/docs/deployment) it right away with so much little effort. Overall, it enhances the development process greatly by simplifying how full-stack applications can be built using React.

#### Conclusion

Depending on our needs, we can hide the request that includes our token behind an [API Route](https://nextjs.org/docs/api-routes/introduction) request, or we could call them from the [`getServerSideProps`](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props) function if we want to go Server-Side Rendering.

### Search Capability

As mentioned in the previous point, we could allow users to search any topic name by providing an [API Route](https://nextjs.org/docs/api-routes/introduction) as a mediator between users, our signed requests and the GitHub API.

**Note:** Whichever method we choose, we should ensure user input is [normalized](#normalize-user-input) to provide a better experience and return the most accurate results possible.

## Design Issues

### Issue 1: Display the data (UI flows)

Currently, the data structure is showing us that we could be dealing with a recursive pattern, or at least it somehow that resembles the nature of recursion. For instance, `javascript` can have `nodejs` as a related topic, and `nodejs` can have `javascript` as related topic. Well, recursive might not be the right word, but if we think about the shape of the data, we can see that we could have the same structure embedded into each one of its related topics, repeating this pattern indefinitely. What if the data structure was represented as a template? We could have a dynamic template that includes itself, indefinitely.

It could also resemble a Tree or a representation of a Tree, with the distinction that each node could have multiple nodes, also, nodes/keys can be repeated anywhere down the "tree".

We have been advised to implement best practices with the UI. How can we display this data following design principles?

Let's explore some ideas to see which one could work better.

#### Alternative A: Tree Control

Trees are used to organize **hierarchical information** so that users can find it quickly and without error. With that being said, I think we can safely discard this option right away as our data does not represent hierarchy, it represents related/discoverable connections, maybe? Do we know the rules that makes a topic related to another? Does users know (or are familiar with) the "hierarchy"? I think the answer to these questions are "no", we don't know the rules that connects them, we don't know the tree, we cannot predict which items might be under another item, also, those items can change — *the API returns related topics sorted with the most relevant first*, and relevance is transient. Hence, we cannot be sure we will be able to find items if we were about to search for them on the tree.

Besides that, one of the critical aspects for trees is that they should be able to preserve their state. Most likely, users have to do a lot of work (clicking, scrolling, waiting for requests to finish) to get to a specific state of the app. This means we should account for ways to restore the state to avoid user frustration.

Now, it is more clear to me that tree control might not be a good option for our case. Let's write down the pros and cons we can identify for this alternative to see what else we can find out.

- [pros] findability: it can display hundreds or thousands of items in a compact space that users can quickly navigate, or find on the page using the built-in search functionality of the browser.
- [cons] performance: displaying a tree with hundreds or thousands of items may have an impact on performance we might need to account for.
- [cons] shareability: the latest state of the tree might difficult/expensive/time-consuming to restore (we don't know yet, but we might need to build custom-complex queries for each state or to perform `n` number of API requests to bring all the required data to reproduce — assuming we'll be able to store the state on the URL).
- [cons] SEO: if we cannot restore the state then it cannot be SEO friendly.
- [cons] UX: if we cannot restore the state then it will be frustrating for users if the tree resets and they have to start over again.

#### Alternative B: Dynamic Routes

Dynamic routes are a great way to handle a large number of pages that rely on custom URL parameters. In our case, we have already identified which variable of the query can be mapped to our dynamic URL param on this section [Get the data: GitHub API queries](/#get-the-data-github-api-queries), so we want the URL for these pages to depend on the topic name.

If we can re-use the query to request the data dynamically then we should be able to re-use our view/template to display the information of **any topic name**. GitHub does something similar already. If we visit the following URL [https://github.com/topics/react](https://github.com/topics/react) GitHub will display a dynamic page for the topic "react". We can benefit by using this same approach, it reduces complexity greatly as, theoretically, we could only need 1 dynamic route to cover any term or topic.

If we think about it, our [search functionality](#search-capability) could also be implemented using this approach with little effort, we'll only need to redirect users to our dynamic route using whatever term/topic they enter as the dynamic param. e.g: `/topics/{user-input-term}`. This is great, the idea it's so simple yet so powerful and seems effective for our case.

- [pros] scalability: it allows us to grow our app larger more quickly
- [pros] reusability: we could use it to provide simple search functionality, whatever the user wants to search for will try to be retrieved using GitHub's API.
- [pros] shareability: pages can be shared, bookmarked, etc.
- [pros] UX: users can navigate between related topics by clicking them, and browser history can be used to navigate back and forth
- [pros] SEO friendly
- [cons] It needs a server (configuration, etc). Conveniently, we have decided to use Next.js for this.

#### Conclusion

We could use a single page (powered by dynamic routes) to display Topics data. Each related topic can link to the same page updating the corresponding dynamic values. Next.js allow us to create [dynamic routes](https://nextjs.org/docs/routing/dynamic-routes) pretty easily.

## Future Improvements

### Code Structuring

I don't have problems with the current code structure. I am ok with the way it is.

### Refactoring
- **Search**:
  - Simplify it.
  - Make it work without javascript.
  - Always display search button.
- **GraphQL**: use Apollo GraphQL.

### Additional Features

- **PWA Installability support**: right now, it doesn't prevent us from delivering the main features but I think it would be useful to have quick way to access the app on desktop or mobile.
- **Search**:
  - help users autocompleting/suggesting actual topic names while they type.
  - add `/` keyboard shortcut to focus search input
  - add skip to content button on tab - [source](https://accessibility.oit.ncsu.edu/it-accessibility-at-nc-state/developers/accessibility-handbook/mouse-and-keyboard-events/skip-to-main-content/)
- **OG Image**: generate dynamic og:images to improve conversion. this might not be needed for this app, but it would be a good chance to try out vercel's og image generation library - [blog](https://vercel.com/blog/introducing-vercel-og-image-generation-fast-dynamic-social-card-images).
