# Complete [![Build Status](https://travis-ci.org/firstandthird/complete.svg?branch=master)](https://travis-ci.org/firstandthird/complete) ![npm](https://img.shields.io/npm/v/@firstandthird/complete.svg)

Super simple autocomplete library for domodule

## Installation

```sh
npm install @firstandthird/complete
```

## Usage

```js
import '@firstandthird/complete';
// or
import Complete from '@firstandthird/complete';
```

## Example HTML

```html
<div data-module="Complete" data-module-endpoint="/api/autocomplete?q=${term}">
  <input type="text" data-name="input" data-action="search" data-action-type="input" placeholder="Search for something">
  <div data-name="resultsContainer"></div>
</div>
```
