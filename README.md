# mine.css

A classless stylesheet for HTML documents and evolution of [style.css][style].

[![latest version][npm-img]][npm-url] [![Actions Status][action-img]][action-url] [![downloads][downloads-img]][npm-url] [![Neocities][neocities-img]](https://mine-css.neocities.org)

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
- [CHANGELOG.md](./CHANGELOG.md)

## Browser support

The distributed stylesheet uses native CSS nesting. The package's Browserslist contract is `supports css-nesting`; older browsers should use a separately transpiled build.

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
<link rel="stylesheet" href="https://unpkg.com/mine.css@^10.0.0">
```

```sh
# npm package
$ npm install mine.css
```

```css
/* CSS file */
@import url('https://unpkg.com/mine.css');
```

If your bundler implements package.json `exports` resolution, you can explicitly reference the js or css exports from mine.css doing the following:

```css
/* esbuild css */
@import 'mine.css/dist/mine.css';
```

```js
/* esbuild js */
import { toggleTheme } from 'mine.css/dist/theme-switcher.js';
/* or */
import { toggleTheme } from 'mine.css';
```

## Usage

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hello World</title>
    <link rel="stylesheet" href="https://unpkg.com/mine.css@^10.0.0">
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

- [postcss-import](https://github.com/postcss/postcss-import)

### CSS Variables

You can override defaults directly with CSS variables. Here are the default variable settings for `mine.css`:

```css
:root {
  /* font family */
  --font-body: var(--system-sans);
  --font-code: var(--system-mono);

  /* font size and spacing */
  --font-size-body: clamp(1rem, calc(0.95rem + 0.2vw), 1.125rem);

  /* note: use unitless line heights
   https://css-tricks.com/almanac/properties/l/line-height/#article-header-id-0 */
  --line-height-body: 1.75;
  --line-height-pre: 1.45;

  /* light colors */
  --light-text: hsl(0deg, 0%, 7%, 100%); /* #111 */
  --light-background: white;
  --light-layer-background: hsl(0deg, 0%, 100%, 0%);
  --light-accent-background: hsl(0deg, 0%, 95%, 100%); /* #f2f2f2 */
  --light-accent-midground: hsl(0deg, 0%, 46%, 100%); /* #757575 */
  --light-accent-foreground: hsl(0deg, 0%, 40%, 100%); /* #666 */
  --light-link-text: hsl(210deg, 100%, 40%, 100%); /* #06c */
  --light-mark-background: hsl(60deg, 100%, 50%, 100%); /* #ff0 */
  --light-code-text: var(--light-text);
  --light-code-background: var(--light-accent-background);
  --light-code-border: var(--light-accent-midground);

  /* dark colors */
  --dark-text: white;
  --dark-background: hsl(0deg, 0%, 12%, 100%); /* #1f1f1f */
  --dark-layer-background: transparent;
  --dark-accent-background: hsl(0deg, 0%, 20%, 100%); /* #333 */
  --dark-accent-midground: hsl(0deg, 0%, 42%, 100%); /* #6b6b6b */
  --dark-accent-foreground: hsl(0deg, 0%, 60%, 100%); /* #999 */
  --dark-link-text: hsl(206deg, 100%, 70%, 100%); /* #66bdff */
  --dark-mark-background: hsl(58deg, 66%, 30%, 100%); /* #7f7c1a */
  --dark-code-text: var(--dark-text);
  --dark-code-background: var(--dark-accent-background);
  --dark-code-border: var(--dark-accent-midground);
}
```

#### Overriding settings

You can override settings like so:

```css
@import 'mine.css';

:root {
  --font-size-body: 1rem;
}
```

If you want to use the font stacks to override global font settings, you can do so like this:

```css
@import 'mine.css';

:root {
  --font-body: var(--system-serif);
}
```

#### Customizing colors

To customize colors, override the color variable for dark and light mode:

```css
:root {
  --light-text: red;
  --light-background: blue;

  --dark-text: blue;
  --dark-background: red;
}
```

If you want to implement other styles that follow the light/dark mode pattern in mine.css, use the theme agnostic color var:


```css
.some-class {
  color: var(--accent-foreground);
}
```

The theme agnostic variables are as follows:

```css
:root,
.light-mode {
  /* main colors */
  --text: var(--light-text);
  --background: var(--light-background);
  --layer-background: var(--light-layer-background);
  --accent-background: var(--light-accent-background);
  --accent-midground: var(--light-accent-midground);
  --accent-foreground: var(--light-accent-foreground);

  /* misc colors */
  --link-text: var(--light-link-text);
  --mark-background: var(--light-mark-background);
  --code-text: var(--light-code-text);
  --code-background: var(--light-code-background);
  --code-border: var(--light-code-border);
}

.dark-mode {
  /* main colors */
  --text: var(--dark-text);
  --background: var(--dark-background);
  --layer-background: var(--dark-layer-background);
  --accent-background: var(--dark-accent-background);
  --accent-midground: var(--dark-accent-midground);
  --accent-foreground: var(--dark-accent-foreground);

  /* misc colors */
  --link-text: var(--dark-link-text);
  --mark-background: var(--dark-mark-background);
  --code-text: var(--dark-code-text);
  --code-background: var(--dark-code-background);
  --code-border: var(--dark-code-border);
}
```

## Overriding the system theme

If you want to allow users to switch between light and dark independently of the system theme, apply the `.light-mode` or `.dark-mode` class to the document root.

There is a subtle relationship between the class and the system preference, so it is better to use the theme switcher script ([./src/theme-switcher.js](./dist/theme-switcher.js)), which handles a user override while still following the system preference.

Usage:

```html
<script type="module">
  import { toggleTheme } from 'https://unpkg.com/bcomnes/mine.css@^10.0.0?module';

  window.toggleTheme = toggleTheme
</script>
```

The `toggleTheme` export is exclusively offered as an ESM module.  If you need CJS, just vendor it.

See [global.client.js](./global.client.js) and [root.layout.js](./root.layout.js) for this site's integration.

Additionally, when using `theme-switcher.js`, you can easily target dark mode using the following selector:

```css
.dark-mode:not(.light-mode) {
  /* additional dark mode styles go here */
}
```

and the document root will stay in sync with the system preference or user override. Otherwise, define the corresponding styles in the dark-mode media query:

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* duplicate your dark mode styles here if not using theme-switcher.js */
  }
}
```

## Dark mode images

Images can be swapped out using the `<picture>` tag.

```html
<picture>
    <source srcset="mojave-night.jpg" media="(prefers-color-scheme: dark)">
    <img src="mojave-day.jpg">
</picture>
```

See [this webkit blogpost](https://webkit.org/blog/8840/dark-mode-support-in-webkit/) for more info on dark mode.

## Layout

`mine.css` does not include page layout by default, but it ships a small companion stylesheet with a readable document measure and safe-area support for notched displays.

```html
<!-- CDN Production (specific release) -->
<link rel="stylesheet" href="https://unpkg.com/mine.css@^10.0.0/dist/layout.css">
```

You can see this layout style in action on the [`mine.css`][guide] website.

The two classes are:

- `safe-area-inset`: Adds at least a `1em` inline gutter and expands it where a device safe area requires more room.
- `mine-layout`: Provides a self-contained, responsive document measure. Apply it to the main content container.

## Thanks

`mine.css` stands on the shoulders of giants from the excellent work found in [style.css][style]. Thank you!

## License

[MIT](LICENSE)

[style]: https://css-pkg.github.io/style.css/
[style-gh]: https://github.com/css-pkg/style.css
[guide]: https://mine-css.neocities.org/guide/

[neocities-img]: https://img.shields.io/website/https/mine-css.neocities.org?label=neocities&logo=data:image/png;base64,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
