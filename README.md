#complete

Autocomplete Plugin

##Installation

###Bower

`bower install complete`

###Manual Download

- [Development]()
- [Production]()

##Usage

Usage is fairly simple. Just target an input and call autocomplete on top of it:

```
$('#test').autocomplete();
```

The only mandatory option is the `source` which is an array of words you want to auto-suggest. For example:

```
$('#test').autocomplete({
    source : ['jQuery', 'Backbone', 'Ember', 'Prototype', 'Angular']
});
```

Once you start typing, suggestions will appear. You can use the normal navigation within keys.

### Optional parameters

#### `search`

The function against which are evaluated the suggestions. Have to return either `true` or `false`.

#### `listClass`

The CSS class used to style the list of suggestions.

#### `suggestionActiveClass`

The CSS class used to style the an active suggestion (ie: hovered or moved with keys)

#### `suggestionClass`

The CSS class used to style the suggestion element.

#### `maxHeight`

The maximum height of the suggestion box.

#### `minChars`

Minimum chars you need to write for the suggestions to appear.

#### `zIndex`

The z-index value for the list of suggestions.

#### `formatSuggestion`

A function that is used to format a suggestion while typing. Function receives two parameters:

* `suggestion` : The value of the full suggestion
* `value` : The value typed on the input.

##Development

###Requirements

- node and npm
- bower `npm install -g bower`
- grunt `npm install -g grunt-cli`

###Setup

- `npm install`
- `bower install`

###Run

`grunt dev`

or for just running tests on file changes:

`grunt ci`

###Tests

`grunt mocha`
