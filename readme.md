# mine.css

A classless stylesheet for HTML documents and evolution of [style.css][style].

[![latest version][npm-img]][npm-url] [![Actions Status][action-img]][action-url] [![downloads][downloads-img]][npm-url]

[npm-img]: https://img.shields.io/npm/v/mine.css.svg
[npm-url]: https://www.npmjs.com/package/mine.css
[action-img]: https://github.com/bcomnes/mine.css/workflows/tests/badge.svg
[action-url]: https://github.com/bcomnes/mine.css/actions
[downloads-img]: https://img.shields.io/npm/dm/mine.css.svg

## About

Make a plain HTML page look good and readable with zero effort!  Serves as a nice base layer default.

Check out the [style guide][guide] to see what it looks like.

## Differences

Some differences from [style.css][style]:

- CSS Variables
- Dark Mode
- Remove some old browser support
- Use post-css build pipeline
- Minor stylistic differences

## Install

[![download style.css][dl-sans-img]][dl-sans-url]

[dl-sans-img]: https://img.shields.io/badge/download-mine.css-6495ED.svg
[dl-sans-url]: https://unpkg.com/mine.css

```html
<!-- CDN Development (always latest) -->
<link rel="stylesheet" href="https://unpkg.com/mine.css">
```

```html
<!-- CDN Production (specific release) -->
<link rel="stylesheet" href="https://unpkg.com/mine.css@1.0.0">
```

```sh
# npm package
$ npm install mine.css
```

```css
/* CSS file */
@import url('https://unpkg.com/style.css/mine.css');
```

## Usage

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hello World</title>
    <link rel="stylesheet" href="https://unpkg.com/mine.css@^1.0.0/style.css">
  </head>
  <body>
    <h1>Hooray!</h1>
  </body>
</html>
```

The best way to get familiar with the look and feel of `mine.css` is to visit the [style guide][guide]. Detailed examples of every HTML element (and how to write them in markdown) are available there.

### Node

```console
npm install mine.css --save-dev
```

Here are some modules out there for requiring CSS using JavaScript that should also work just fine:

- [browserify-css](https://www.npmjs.com/package/browserify-css)
- [css-modules](https://github.com/css-modules/css-modules)
- [parcelify](https://www.npmjs.com/package/parcelify)
- [rework-npm](https://www.npmjs.com/package/rework-npm)
- [postcss-import](https://github.com/postcss/postcss-import)

### CSS Variables

You can override defaults directly with CSS variables. Here are the default variable settings for `mine.css`:

```css
:root {
  --font-body: var(--system-sans);
  --font-code: var(--system-mono);
  --font-size-body: 14px;
  --font-size-scale: 0.25vw;
  --line-height-body: 1.75;
  --line-height-pre: 1.45;

  /* light colors */
  --light-background: white;
  --light-layer-background: var(--transparent);
  --light-link-blue: hsla(208, 100%, 50%, 1); /* #08f */
  --light-mark-yellow: hsla(60, 100%, 50%, 1); /* #ff0 */
  --light-black: hsla(0, 0%, 7%, 1); /* #111 */
  --light-accent-background: hsla(0, 0%, 95%, 1); /* #f2f2f2 */
  --light-accent-midground: hsla(0, 0%, 84%, 1); /* #d6d6d6 */
  --light-accent-foreground: hsla(0, 0%, 49%, 1); /* #7d7d7d */

  /* dark colors */
  --dark-background: hsla(0, 0%, 12%, 1); /* #1f1f1f from safari */
  --dark-layer-background: var(--transparent);
  --dark-link-blue: hsl(206, 100%, 70%); /* #66bdff */
  --dark-mark-yellow: hsla(58, 66%, 30%, 1); /* #7f7c1a */
  --dark-white: white;
  --dark-accent-background: hsla(0, 0%, 20%, 1); /* #333 */
  --dark-accent-midground: hsla(0, 0%, 30%, 1); /* #4d4d4d */
  --dark-accent-foreground: hsla(0, 0%, 60%, 1); /* #999 */
}
```

#### Overriding settings

You can override settings like so:

```css
@import 'mine.css';

:root {
  --font-size-body: 14px;
}
```

If you want to use the font stacks to override global font settings, you can do so like this:

```css
@import 'mine.css';

:root {
  --font-body: var(--system-serif);
}
```


## Thanks

`mine.css` stands on the shoulders of giants from the excellent work found in [style.css][style]. Thank you!

## Contributing

Contributions welcome! Please read the [contributing guidelines](contributing.md) first.

## License

[ISC](LICENSE.md)

[style]: https://css-pkg.github.io/style.css/
[style-gh]: https://github.com/css-pkg/style.css
[guide]: https://mine-css.neocities.com/guide.html
