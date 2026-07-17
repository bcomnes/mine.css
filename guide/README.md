<!-- omit from toc -->
# Style Guide

See how elements are styled with `mine.css`.

<details>
  <summary><strong>Table of Contents</strong></summary>

[[toc]]

</details>


## <a id="headings" href="#headings">Headings</a>

<!-- omit from toc -->
# h1 Heading `with code` <small>and small text</small>
<!-- omit from toc -->
## h2 Heading `with code` <small>and small text</small>
<!-- omit from toc -->
### h3 Heading `with code` <small>and small text</small>
<!-- omit from toc -->
#### h4 Heading `with code` <small>and small text</small>
<!-- omit from toc -->
##### h5 Heading `with code` <small>and small text</small>
<!-- omit from toc -->
###### h6 Heading `with code` <small>and small text</small>

```md
# h1 Heading `with code` <small>and small text</small>
## h2 Heading `with code` <small>and small text</small>
### h3 Heading `with code` <small>and small text</small>
#### h4 Heading `with code` <small>and small text</small>
##### h5 Heading `with code` <small>and small text</small>
###### h6 Heading `with code` <small>and small text</small>
```

## <a id="paragraphs" href="#paragraphs">Paragraphs</a>

At the base of the mainmast, full beneath the doubloon and the flame, the Parsee was kneeling in Ahab's front, but with his head bowed away from him; while near by, from the arched and overhanging rigging, where they had just been engaged securing a spar, a number of the seamen, arrested by the glare, now cohered together, and hung pendulous, like a knot of numbed wasps from a drooping, orchard twig. In various enchanted attitudes, like the standing, or stepping, or running skeletons in Herculaneum, others remained rooted to the deck; but all their eyes upcast.

"There it is again—under the hatches—don't you hear it—a cough—it sounded like a cough."

```md
At the base of the mainmast, full beneath the doubloon and the flame, the Parsee was kneeling in Ahab's front, but with his head bowed away from him; while near by, from the arched and overhanging rigging, where they had just been engaged securing a spar, a number of the seamen, arrested by the glare, now cohered together, and hung pendulous, like a knot of numbed wasps from a drooping, orchard twig. In various enchanted attitudes, like the standing, or stepping, or running skeletons in Herculaneum, others remained rooted to the deck; but all their eyes upcast.

"There it is again—under the hatches—don't you hear it—a cough—it sounded like a cough."
```

## <a id="links" href="#links">Links</a>

[link text](http://dev.nodeca.com)

```md
[link text](http://dev.nodeca.com)
```

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

```md
[link with title](http://nodeca.github.io/pica/demo/ "title text!")
```

[link with footnote style syntax][footnote style]

[footnote style]: https://en.wikipedia.org/wiki/Note_(typography)

```md
[link with footnote style syntax][footnote style]

[footnote style]: https://en.wikipedia.org/wiki/Note_(typography)
```

## <a id="lists" href="#lists">Lists</a>

### Unordered

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

```md
+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!
```

### Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as `1.`

```md
1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as `1.`
```

#### Offset

57. foo
1. bar

```md
57. foo
1. bar
```

## <a id="blockquotes" href="#blockquotes">Blockquotes</a>

This is a paragraph preceding a blockquote.

> `<blockquote>` can also be nested...
>> ...by using additional greater-than (`'>'`) signs right next to each other...
> > > ...or with spaces between arrows.

This is a paragraph following a blockquote.

```md
This is a paragraph preceding a blockquote.

> `<blockquote>` can also be nested...
>> ...by using additional greater-than (`'>'`) signs right next to each other...
> > > ...or with spaces between arrows.

This is a paragraph following a blockquote.
```

## <a id="emphasis" href="#emphasis">Emphasis</a>

- **This is bold text**
- __This is also bold text__
- *This is italic text*
- _This is also italic text_
- ~~This is deleted text~~

```md
- **This is bold text**
- __This is also bold text__
- *This is italic text*
- _This is also italic text_
- ~~This is deleted text~~
```

## <a id="code" href="#code">Code</a>

`Inline code`

    Indented code

    line 3 of code
    line 4 of code
    line 5 of code

    line 7 of code

```
Fenced code blocks
```

```js
// Syntax highlighting
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```

    `Inline code`

        Indented code

        line 3 of code
        line 4 of code
        line 5 of code

        line 7 of code

    ```
    Fenced code blocks
    ```

    ```js
    // Syntax highlighting
    var foo = function (bar) {
      return bar++;
    };

    console.log(foo(5));
    ```

Code blocks without any highlight.js theme:

<pre><code>// Syntax highlighting
var foo = function (bar) {
  return bar++;
};

console.log(foo(5)); console.log(foo(5)); console.log(foo(5)); console.log(foo(5));
</code></pre>

### <a id="language-examples" href="#language-examples">Language Examples</a>

These examples model the same small record in several languages so their syntax colors are easy to compare.

#### TypeScript

```typescript
type User = {
  id: number
  name: string
}

const formatUser = ({ id, name }: User): string =>
  `${id}: ${name}`

console.log(formatUser({ id: 7, name: 'Ada' }))
```

#### Python

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class User:
    id: int
    name: str

def format_user(user: User) -> str:
    return f"{user.id}: {user.name}"
```

#### Go

```go
package main

import "fmt"

type User struct {
    ID   int
    Name string
}

func (user User) String() string {
    return fmt.Sprintf("%d: %s", user.ID, user.Name)
}
```

#### Rust

```rust
#[derive(Debug)]
struct User {
    id: u32,
    name: &'static str,
}

impl User {
    fn label(&self) -> String {
        format!("{}: {}", self.id, self.name)
    }
}
```

#### C

```c
#include <stdio.h>

typedef struct {
    int id;
    const char *name;
} User;

static void print_user(const User *user) {
    printf("%d: %s\n", user->id, user->name);
}
```

#### C++

```cpp
#include <iostream>
#include <string>

struct User {
    int id;
    std::string name;
};

std::ostream& operator<<(std::ostream& out, const User& user) {
    return out << user.id << ": " << user.name;
}
```

### <a id="user-input" href="#user-input">User Input</a>

<kbd>ctrl</kbd><kbd>alt</kbd><kbd>delete</kbd>

<kbd title="Command">⌘</kbd><kbd title="Option">⌥</kbd><kbd title="Shift">⇧</kbd>

<kbd>q</kbd><kbd>w</kbd><kbd>e</kbd><kbd>r</kbd><kbd>t</kbd><kbd>y</kbd>

<kbd>a</kbd><kbd>z</kbd><kbd>e</kbd><kbd>r</kbd><kbd>t</kbd><kbd>y</kbd>

```html
<kbd>ctrl</kbd><kbd>alt</kbd><kbd>delete</kbd>

<kbd title="Command">⌘</kbd><kbd title="Option">⌥</kbd><kbd title="Shift">⇧</kbd>

<kbd>q</kbd><kbd>w</kbd><kbd>e</kbd><kbd>r</kbd><kbd>t</kbd><kbd>y</kbd>

<kbd>a</kbd><kbd>z</kbd><kbd>e</kbd><kbd>r</kbd><kbd>t</kbd><kbd>y</kbd>
```

## <a id="tables" href="#tables">Tables</a>

### Markdown table

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

```md
| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |
```

### Right-aligned Markdown columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

```md
| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |
```

### Accessible responsive HTML table

Wrap a table that may overflow in a named, keyboard-focusable region. Reference
the table caption from `aria-labelledby` so the scrolling region has an
accessible name.

<div role="region" aria-labelledby="template-options-caption" tabindex="0">
  <table>
    <caption id="template-options-caption">Template engine options</caption>
    <thead>
      <tr>
        <th scope="col">Option</th>
        <th scope="col">Type</th>
        <th scope="col">Default</th>
        <th scope="col">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">data</th>
        <td>string</td>
        <td>—</td>
        <td>Path to data files supplied to templates.</td>
      </tr>
      <tr>
        <th scope="row">engine</th>
        <td>string</td>
        <td>handlebars</td>
        <td>Rendering engine used to process templates.</td>
      </tr>
      <tr>
        <th scope="row">ext</th>
        <td>string</td>
        <td>.html</td>
        <td>File extension used for generated documents.</td>
      </tr>
    </tbody>
  </table>
</div>

```html
<div role="region" aria-labelledby="template-options-caption" tabindex="0">
  <table>
    <caption id="template-options-caption">Template engine options</caption>
    <thead>
      <tr>
        <th scope="col">Option</th>
        <th scope="col">Type</th>
        <th scope="col">Default</th>
        <th scope="col">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">data</th>
        <td>string</td>
        <td>—</td>
        <td>Path to data files supplied to templates.</td>
      </tr>
      <tr>
        <th scope="row">engine</th>
        <td>string</td>
        <td>handlebars</td>
        <td>Rendering engine used to process templates.</td>
      </tr>
      <tr>
        <th scope="row">ext</th>
        <td>string</td>
        <td>.html</td>
        <td>File extension used for generated documents.</td>
      </tr>
    </tbody>
  </table>
</div>
```

Cells can still opt into alignment without changing the responsive structure:

<div role="region" aria-labelledby="release-metrics-caption" tabindex="0">
  <table>
    <caption id="release-metrics-caption">Release metrics</caption>
    <thead>
      <tr>
        <th scope="col">Version</th>
        <th scope="col" style="text-align: end;">Downloads</th>
        <th scope="col" style="text-align: end;">Bundle size</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">11.0.0</th>
        <td style="text-align: end;">12,480</td>
        <td style="text-align: end;">9.8 kB</td>
      </tr>
      <tr>
        <th scope="row">10.2.0</th>
        <td style="text-align: end;">10,315</td>
        <td style="text-align: end;">9.4 kB</td>
      </tr>
    </tbody>
  </table>
</div>

```html
<div role="region" aria-labelledby="release-metrics-caption" tabindex="0">
  <table>
    <caption id="release-metrics-caption">Release metrics</caption>
    <thead>
      <tr>
        <th scope="col">Version</th>
        <th scope="col" style="text-align: end;">Downloads</th>
        <th scope="col" style="text-align: end;">Bundle size</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">11.0.0</th>
        <td style="text-align: end;">12,480</td>
        <td style="text-align: end;">9.8 kB</td>
      </tr>
      <tr>
        <th scope="row">10.2.0</th>
        <td style="text-align: end;">10,315</td>
        <td style="text-align: end;">9.4 kB</td>
      </tr>
    </tbody>
  </table>
</div>
```

## <a id="horizontal-rules" href="#horizontal-rules">Horizontal Rules</a>

___

---

***

```md
___

---

***
```

## <a id="images" href="#images">Images</a>

![Finn and Jake](http://38.media.tumblr.com/tumblr_mdo6z0KBpf1rwy00jo1_400.gif "One style is all that is needed.")

```md
![Finn and Jake](http://38.media.tumblr.com/tumblr_mdo6z0KBpf1rwy00jo1_400.gif "One style is all that is needed.")
```

![Captain Story-Martense House](https://upload.wikimedia.org/wikipedia/commons/6/66/1996.164.1-65_IMLS_SL2.jpg "Captain Story-Martense House, Front Door, Church Avenue and East 38th Street, Flatbush, Brooklyn, ca. 1899-1909.")

```md
![Captain Story-Martense House](https://upload.wikimedia.org/wikipedia/commons/6/66/1996.164.1-65_IMLS_SL2.jpg "Captain Story-Martense House, Front Door, Church Avenue and East 38th Street, Flatbush, Brooklyn, ca. 1899-1909.")
```

Like links, images also have a footnote style syntax.

![Alt text][id]

The reference defining the URL location can be later in the document.

[id]: https://upload.wikimedia.org/wikipedia/commons/1/1f/Ries.PNG  "1550 Woodcut of 58-year-old Adam Ries, inscription: ANNO 1550 ADAM RIES SEINS ALTERS IM LVIII"

```md
Like links, images also have a footnote style syntax.

![Alt text][id]

The reference defining the URL location can be later in the document.

[id]: https://upload.wikimedia.org/wikipedia/commons/1/1f/Ries.PNG  "1550 Woodcut of 58-year-old Adam Ries, inscription: ANNO 1550 ADAM RIES SEINS ALTERS IM LVIII"
```

## <a id="audio" href="#audio">Audio</a>

Native audio controls fill the available document measure. Audio without
controls remains hidden according to the browser's rendering rules.

<audio id="demo-audio" controls aria-label="Audio player without a source"></audio>

```html
<audio controls aria-label="Audio player without a source"></audio>
```

## <a id="canvas" href="#canvas">Canvas</a>

A wide canvas shrinks with its container while preserving its intrinsic ratio.
The gradient below is authored demo content rather than a framework default.

<canvas
  id="demo-canvas"
  aria-label="Responsive gradient canvas"
  width="1280"
  height="240"
  style="background: linear-gradient(90deg, var(--link-text), var(--valid));">
  Responsive gradient canvas.
</canvas>

```html
<canvas
  aria-label="Responsive gradient canvas"
  width="1280"
  height="240">
  Responsive gradient canvas.
</canvas>
```

## <a id="video" href="#video">Video</a>

A video without a source or poster still reserves a visible, theme-aware frame while media is unavailable or loading.

<video
  id="blank-video"
  aria-label="Blank video placeholder"
  width="640"
  height="360"></video>

```html
<video
  aria-label="Blank video placeholder"
  width="640"
  height="360"></video>
```

## <a id="iframes" href="#iframes">Iframes</a>

An iframe keeps its authored dimensions while shrinking to fit narrower containers.

<iframe
  id="demo-iframe"
  title="Embedded document example"
  width="1280"
  height="180"
  srcdoc="<style>:root{color-scheme:light dark}body{font:1rem/1.5 system-ui;padding:1rem}</style><p>Embedded document</p>"></iframe>

```html
<iframe
  title="Embedded document example"
  width="1280"
  height="180"
  srcdoc="<p>Embedded document</p>"></iframe>
```

## <a id="figures" href="#figures">Figures</a>

<figure>
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Helsinki_z00.jpg/1920px-Helsinki_z00.jpg"
    alt="Helsinki">
  <figcaption>
    Panoramic view of
    <a
      href="//commons.wikimedia.org/wiki/Helsinki"
      title="Helsinki">Helsinki</a>,
    Finland from the Ateljee bar of
    <a
      href="https://en.wikipedia.org/wiki/Hotel_Torni"
      title="en:Hotel Torni">Hotel Torni</a>.
  </figcaption>
</figure>

<figure class="borderless">
  <picture>
    <source srcset="/img/fork-dark.png" media="(prefers-color-scheme: dark)">
    <img src="/img/fork-light.png" alt="Screenshot of Fork.app">
  </picture>
  <figcaption>
    Light and dark mode images with the
    <code>&lt;picture&gt;</code>
    tag.
  </figcaption>
</figure>

```html
<figure>
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Helsinki_z00.jpg/1920px-Helsinki_z00.jpg"
    alt="Helsinki">
  <figcaption>
    Panoramic view of
    <a
      href="//commons.wikimedia.org/wiki/Helsinki"
      title="Helsinki">Helsinki</a>,
    Finland from the Ateljee bar of
    <a
      href="https://en.wikipedia.org/wiki/Hotel_Torni"
      title="en:Hotel Torni">Hotel Torni</a>.
  </figcaption>
</figure>

<figure class="borderless">
  <picture>
    <source srcset="/img/fork-dark.png" media="(prefers-color-scheme: dark)">
    <img src="/img/fork-light.png" alt="Screenshot of Fork.app">
  </picture>
  <figcaption>
    Light and dark mode images with the
    <code>&lt;picture&gt;</code>
    tag.
  </figcaption>
</figure>
```

## <a id="extras" href="#extras">Extras</a>

The following markup falls outside the [CommonMark](http://commonmark.org) specification and may require plugins or special options for your markdown parser of choice. We're using [markdown-it](https://github.com/markdown-it/markdown-it) and related [plugins](https://www.npmjs.com/browse/keyword/markdown-it) to show how the following elements look when using `style.css`.

### <a id="abbreviations" href="#abbreviations">Abbreviations</a>

> via [markdown-it-abbr](https://github.com/markdown-it/markdown-it-abbr)

This is a HTML abbreviation example.

It converts "HTML" but keeps partial entries like "xxxHTMLyyy" intact.

*[HTML]: Hyper Text Markup Language

```md
This is a HTML abbreviation example.

It converts "HTML" but keeps partial entries like "xxxHTMLyyy" intact.

*[HTML]: Hyper Text Markup Language
```

### <a id="definitions" href="#definitions">Definitions</a>

> via [markdown-it-deflist](https://github.com/markdown-it/markdown-it-deflist)

Term 1

:   Definition 1
with lazy continuation.

Term 2 with *inline markup*

:   Definition 2

        { some code, part of Definition 2 }

    Third paragraph of definition 2.

_Compact style:_

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b

```md
Term 1

:   Definition 1
with lazy continuation.

Term 2 with *inline markup*

:   Definition 2

        { some code, part of Definition 2 }

    Third paragraph of definition 2.

_Compact style:_

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b
```

### <a id="footnotes" href="#footnotes">Footnotes</a>

> via [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote)

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.

```md
Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.
```

### <a id="special-emphasis" href="#special-emphasis">Special Emphasis</a>

- Superscript: 19^th^ (via [markdown-it-sup](https://github.com/markdown-it/markdown-it-sup))
- Subscript: H~2~O (via [markdown-it-sub](https://github.com/markdown-it/markdown-it-sub))
- ++Inserted text++ (via [markdown-it-ins](https://github.com/markdown-it/markdown-it-ins))
- ==Marked text== (via [markdown-it-mark](https://github.com/markdown-it/markdown-it-mark))

```md
- Superscript: 19^th^ (via [markdown-it-sup](https://github.com/markdown-it/markdown-it-sup))
- Subscript: H~2~O (via [markdown-it-sub](https://github.com/markdown-it/markdown-it-sub))
- ++Inserted text++ (via [markdown-it-ins](https://github.com/markdown-it/markdown-it-ins))
- ==Marked text== (via [markdown-it-mark](https://github.com/markdown-it/markdown-it-mark))
```

## <a id="input-types" href="#input-types">Input Types</a>

Mine.css offers improved default styling of built-in HTML form controls that follows the browser's light and dark preferences.

- [`<input>` element][input]
- [HTML5 input types](https://developer.mozilla.org/en-US/docs/Learn/Forms/HTML5_input_types)

[input]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input

#### <a id="hidden" href="#hidden">Hidden</a>

Hidden inputs submit data without rendering an interactive control.

<p>
  This example includes a hidden CSRF token; the input itself is not visible.
  <input type="hidden" name="csrf-token" value="example-token">
</p>

```html
<input type="hidden" name="csrf-token" value="example-token">
```

#### <a id="buttons" href="#buttons">Button</a>

<details>
  <summary><strong>Description</strong></summary>
  <blockquote>
    <p>
      <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>button</code> are rendered as simple push buttons, which can be programmed to control custom functionality anywhere on a webpage as required when assigned an event handler function (typically for the <a href="https://wiki.developer.mozilla.org/en-US/docs/Web/Events/click"><code>click</code></a> event). –<a href="https://wiki.developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button">mdn</a>
    </p>
  </blockquote>
</details>

<p>
  <input type="button" value="Input Button">
  <button type="button">Button Element</button>
  <input disabled type="button" value="Input Button (Disabled)">
</p>

```html
<input type="button" value="Input Button">
<button type="button">Button Element</button>
<input disabled type="button" value="Input Button (Disabled)">
```

#### <a id="checkbox" href="#checkbox">Checkbox</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>checkbox</code> are rendered by default as boxes that are checked (ticked) when activated, like you might see in an official government paper form. The exact appearance depends upon the operating system configuration under which the browser is running. Generally this is a square but it may have rounded corners. A checkbox allows you to select single values for submission in a form (or not). –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox">mdn</a></p>
    </blockquote>
</details>

<div>
  <input type="checkbox" name="scales" id="scales" checked>
  <label for="scales">Scales</label>
</div>

<div>
  <input type="checkbox" name="horns" id="horns">
  <label for="horns">Horns</label>
</div>

<div>
  <input disabled type="checkbox" name="teeth" id="teeth">
  <label for="teeth">Teeth (Disabled)</label>
</div>

```html
<div>
  <input type="checkbox" name="scales" id="scales" checked>
  <label for="scales">Scales</label>
</div>

<div>
  <input type="checkbox" name="horns" id="horns">
  <label for="horns">Horns</label>
</div>

<div>
  <input disabled type="checkbox" name="teeth" id="teeth">
  <label for="teeth">Teeth (Disabled)</label>
</div>
```

#### <a id="color" href="#color">Color</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
  <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>color</code> provide a user interface element that lets a user specify a color, either by using a visual color picker interface or by entering the color into a text field in <code>#rrggbb</code> hexadecimal format. Only simple colors (without alpha channel) are allowed though CSS colors has more formats, e.g. color names, functional notations and a hexadecimal format with an alpha channel.</p>
  <p>The element’s presentation may vary substantially from one browser and/or platform to another—it might be a simple textual input that automatically validates to ensure that the color information is entered in the proper format, or a platform-standard color picker, or some kind of custom color picker window. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color">mdn</a></p>
  </blockquote>
</details>

<div>
  <input type="color" name="head" id="color-head" value="#e66465">
  <label for="color-head">Head</label>
</div>

<div>
  <input type="color" name="body" id="color-body" value="#f6b73c">
  <label for="color-body">Body</label>
</div>

<div>
  <input disabled type="color" name="foot" id="color-foot" value="#0083f5">
  <label for="color-foot">Footer (Disabled)</label>
</div>

```html
<div>
  <input type="color" name="head" id="color-head" value="#e66465">
  <label for="color-head">Head</label>
</div>

<div>
  <input type="color" name="body" id="color-body" value="#f6b73c">
  <label for="color-body">Body</label>
</div>
<div>
  <input disabled type="color" name="foot" id="color-foot" value="#0083f5">
  <label for="color-foot">Footer (Disabled)</label>
</div>
```

#### <a id="date" href="#date">Date</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
  <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of <code>type="date"</code> create input fields that let the user enter a date, either with a textbox that validates the input or a special date picker interface.</p>
  <p>The resulting value includes the year, month, and day, but not the time. The <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time">time</a> and <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local">datetime-local</a> input types support time and date+time input. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date">mdn</a></p>
  </blockquote>
</details>

<p>
  <label class="block" for="trip-start">Date:</label>
  <input type="date" name="trip-start" id="trip-start" value="2020-08-15">
  <label class="block" for="empty-date">Date (Empty):</label>
  <input type="date" name="empty-date" id="empty-date">
  <label class="block" for="trip-end">Date (Disabled):</label>
  <input disabled type="date" name="trip-end" id="trip-end" value="2020-08-25">
</p>

```html
<label class="block" for="trip-start">Date:</label>
<input type="date" name="trip-start" id="trip-start" value="2020-08-15">
<label class="block" for="empty-date">Date (Empty):</label>
<input type="date" name="empty-date" id="empty-date">
<label class="block" for="trip-end">Date (Disabled):</label>
<input disabled type="date" name="trip-end" id="trip-end" value="2020-08-25">
```

#### <a id="datetime-local" href="#datetime-local">Datetime Local</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>datetime-local</code> create input controls that let the user easily enter both a date and a time, including the year, month, and day as well as the time in hours and minutes. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local">mdn</a></p>
    </blockquote>
</details>

<p>
  <label class="block" for="meeting-time">Datetime Local:</label>
  <input
    type="datetime-local"
    name="meeting-time"
    id="meeting-time"
    value="2018-06-12T19:30"
    min="2018-06-07T00:00"
    max="2018-06-14T00:00">
  <label class="block" for="meeting-time-empty">Datetime Local (Empty):</label>
  <input
    type="datetime-local"
    name="meeting-time-empty"
    id="meeting-time-empty"
    min="2018-06-07T00:00"
    max="2018-06-14T00:00">
  <label class="block" for="meeting-time-disabled">Datetime Local (Disabled):</label>
  <input
    disabled
    type="datetime-local"
    name="meeting-time-disabled"
    id="meeting-time-disabled"
    value="2018-06-13T12:00"
    min="2018-06-07T00:00"
    max="2018-06-14T00:00">
</p>

```html
<label class="block" for="meeting-time">Datetime Local:</label>
<input
  type="datetime-local"
  name="meeting-time"
  id="meeting-time"
  value="2018-06-12T19:30"
  min="2018-06-07T00:00"
  max="2018-06-14T00:00">
<label class="block" for="meeting-time-empty">Datetime Local (Empty):</label>
<input
  type="datetime-local"
  name="meeting-time-empty"
  id="meeting-time-empty"
  min="2018-06-07T00:00"
  max="2018-06-14T00:00">
<label class="block" for="meeting-time-disabled">Datetime Local (Disabled):</label>
<input
  disabled
  type="datetime-local"
  name="meeting-time-disabled"
  id="meeting-time-disabled"
  value="2018-06-13T12:00"
  min="2018-06-07T00:00"
  max="2018-06-14T00:00">
```

#### <a id="email" href="#email">Email</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>email</code> are used to let the user enter and edit an e-mail address, or, if the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/multiple"><code>multiple</code></a> attribute is specified, a list of e-mail addresses. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email">mdn</a></p>
    </blockquote>
</details>

<p>
  <label class="block" for="email-populated">Email:</label>
  <input
    type="email"
    name="email-populated"
    id="email-populated"
    value="bob@example.com">
  <label class="block" for="email-placeholder">Email (Placeholder):</label>
  <input
    type="email"
    name="email-placeholder"
    id="email-placeholder"
    placeholder="bob@example.com">
  <label class="block" for="email-disabled">Email (Disabled):</label>
  <input
    disabled
    type="email"
    name="email-disabled"
    id="email-disabled"
    value="bob@example.com">
</p>

```html
<label class="block" for="email-populated">Email:</label>
<input
  type="email"
  name="email-populated"
  id="email-populated"
  value="bob@example.com">
<label class="block" for="email-placeholder">Email (Placeholder):</label>
<input
  type="email"
  name="email-placeholder"
  id="email-placeholder"
  placeholder="bob@example.com">
<label class="block" for="email-disabled">Email (Disabled):</label>
<input
  disabled
  type="email"
  name="email-disabled"
  id="email-disabled"
  value="bob@example.com">
```

#### <a id="file" href="#file">File</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements with <code>type="file"</code> let the user choose one or more files from their device storage. Once chosen, the files can be uploaded to a server using <a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms">form submission</a>, or manipulated using JavaScript code and <a href="https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications">the File API</a>. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file">mdn</a></p>
    </blockquote>
</details>

<p>
  <label class="block" for="avatar">Avatar:</label>
  <input
    type="file"
    name="avatar"
    id="avatar"
    accept="image/png, image/jpeg">
  <label class="block" for="avatar-disabled">Avatar (Disabled):</label>
  <input
    disabled
    type="file"
    name="avatar-disabled"
    id="avatar-disabled"
    accept="image/png, image/jpeg">
</p>

```html
<label class="block" for="avatar">Avatar:</label>
<input
  type="file"
  name="avatar"
  id="avatar"
  accept="image/png, image/jpeg">
<label class="block" for="avatar-disabled">Avatar (Disabled):</label>
<input
  disabled
  type="file"
  name="avatar-disabled"
  id="avatar-disabled"
  accept="image/png, image/jpeg">
```

#### <a id="image-input" href="#image-input">Image</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>image</code> are used to create graphical submit buttons, i.e. submit buttons that take the form of an image rather than text. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/image">mdn</a></p>
    </blockquote>
</details>

Browsers do not consistently distinguish disabled image inputs visually, so Mine.css reduces their opacity.

<div class="paragraph">
  <input
    class="dark-icon"
    type="image"
    name="login"
    id="image-login"
    alt="Login"
    src="/light-dark.svg">
  <input
    disabled
    class="dark-icon"
    type="image"
    name="login-disabled"
    id="image-login-disabled"
    alt="Login (Disabled)"
    src="/light-dark.svg">
</div>

```html
<input
  class="dark-icon"
  type="image"
  name="login"
  id="image-login"
  alt="Login"
  src="/light-dark.svg">
<input
  disabled
  class="dark-icon"
  type="image"
  name="login-disabled"
  id="image-login-disabled"
  alt="Login (Disabled)"
  src="/light-dark.svg">
```

#### <a id="month" href="#month">Month</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>month</code> create input fields that let the user enter a month and year allowing a month and year to be easily entered. The value is a string whose value is in the format “YYYY-MM”, where YYYY is the four-digit year and MM is the month number. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month">mdn</a></p>
    </blockquote>
</details>

<p>
  <label class="block" for="start-month">Month:</label>
  <input type="month" name="start-month" id="start-month" value="2020-08" min="2018-03">
  <label class="block" for="empty-month">Month (Empty):</label>
  <input type="month" name="empty-month" id="empty-month" min="2018-03">
  <label class="block" for="end-month">Month (Disabled):</label>
  <input disabled type="month" name="end-month" id="end-month" value="2020-09" min="2018-03">
</p>

```html
<label class="block" for="start-month">Month:</label>
<input type="month" name="start-month" id="start-month" value="2020-08" min="2018-03">
<label class="block" for="empty-month">Month (Empty):</label>
<input type="month" name="empty-month" id="empty-month" min="2018-03">
<label class="block" for="end-month">Month (Disabled):</label>
<input disabled type="month" name="end-month" id="end-month" value="2020-09" min="2018-03">
```

#### <a id="number" href="#number">Number</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>number</code> are used to let the user enter a number. They include built-in validation to reject non-numerical entries. The browser may opt to provide stepper arrows to let the user increase and decrease the value using their mouse or by simply tapping with a fingertip. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number">mdn</a></p>
    </blockquote>
</details>

<p>
  <label class="block" for="number-populated">Number (10-100):</label>
  <input type="number" name="number-populated" id="number-populated" value="42" min="10" max="100">
  <label class="block" for="number-placeholder">Number (Placeholder):</label>
  <input type="number" name="number-placeholder" id="number-placeholder" placeholder="12" min="10" max="100">
  <label class="block" for="number-disabled">Number (Disabled):</label>
  <input disabled type="number" name="number-disabled" id="number-disabled" value="50" min="10" max="100">
</p>

```html
<label class="block" for="number-populated">Number (10-100):</label>
<input type="number" name="number-populated" id="number-populated" value="42" min="10" max="100">
<label class="block" for="number-placeholder">Number (Placeholder):</label>
<input type="number" name="number-placeholder" id="number-placeholder" placeholder="12" min="10" max="100">
<label class="block" for="number-disabled">Number (Disabled):</label>
<input disabled type="number" name="number-disabled" id="number-disabled" value="50" min="10" max="100">
```

#### <a id="password" href="#password">Password</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>password</code> provide a way for the user to securely enter a password. The element is presented as a one-line plain text editor control in which the text is obscured so that it cannot be read, usually by replacing each character with a symbol such as the asterisk ("*") or a dot ("•"). This character will vary depending on the <a href="https://developer.mozilla.org/en-US/docs/Glossary/user_agent">user agent</a> and OS. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password">mdn</a></p>
    </blockquote>
</details>

<p>
  <label class="block" for="password-populated">Password:</label>
  <input type="password" name="password-populated" id="password-populated" value="correct-horse" minlength="8">
  <label class="block" for="password-placeholder">Password (Placeholder):</label>
  <input
    type="password"
    name="password-placeholder"
    id="password-placeholder"
    placeholder="8+ characters"
    minlength="8">
  <label class="block" for="password-disabled">Password (Disabled):</label>
  <input disabled type="password" name="password-disabled" id="password-disabled" value="correct-horse" minlength="8">
</p>

```html
<label class="block" for="password-populated">Password:</label>
<input
  type="password"
  name="password-populated"
  id="password-populated"
  value="correct-horse"
  minlength="8">
<label class="block" for="password-placeholder">Password (Placeholder):</label>
<input
  type="password"
  name="password-placeholder"
  id="password-placeholder"
  placeholder="8+ characters"
  minlength="8">
<label class="block" for="password-disabled">Password (Disabled):</label>
<input
  disabled
  type="password"
  name="password-disabled"
  id="password-disabled"
  value="correct-horse"
  minlength="8">
```

#### <a id="radio" href="#radio">Radio</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>radio</code> are generally used in <code>radio groups</code>—collections of radio buttons describing a set of related options. Only one radio button in a given group can be selected at the same time. Radio buttons are typically rendered as small circles, which are filled or highlighted when selected. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio">mdn</a></p>
    </blockquote>
</details>

<div>
  <input type="radio" name="drone" value="huey" id="huey" checked>
  <label for="huey">Huey</label>
</div>

<div>
  <input type="radio" name="drone" value="dewey" id="dewey">
  <label for="dewey">Dewey</label>
</div>

<div>
  <input disabled type="radio" name="drone" value="louie" id="louie">
  <label for="louie">Louie (Disabled)</label>
</div>

```html
<div>
  <input type="radio" name="drone" value="huey" id="huey" checked>
  <label for="huey">Huey</label>
</div>

<div>
  <input type="radio" name="drone" value="dewey" id="dewey">
  <label for="dewey">Dewey</label>
</div>

<div>
  <input disabled type="radio" name="drone" value="louie" id="louie">
  <label for="louie">Louie (Disabled)</label>
</div>
```

#### <a id="range" href="#range">Range</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>range</code> let the user specify a numeric value which must be no less than a given value, and no more than another given value. The precise value, however, is not considered important. This is typically represented using a slider or dial control rather than a text entry box like the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number">number</a> input type. Because this kind of widget is imprecise, it shouldn’t typically be used unless the control’s exact value isn’t important. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range">mdn</a></p>
    </blockquote>
</details>

<div>
  <input type="range" name="volume" id="volume" min="0" max="11">
  <label for="volume">Volume</label>
</div>

<div>
  <input disabled type="range" name="cowbell" id="cowbell" min="0" max="100" value="90" step="10">
  <label for="cowbell">Cowbell (Disabled)</label>
</div>

```html
<div>
  <input type="range" name="volume" id="volume" min="0" max="11">
  <label for="volume">Volume</label>
</div>

<div>
  <input
    disabled
    type="range"
    name="cowbell"
    id="cowbell"
    min="0"
    max="100"
    value="90"
    step="10">
  <label for="cowbell">Cowbell (Disabled)</label>
</div>
```

#### <a id="reset" href="#reset">Reset</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>"reset"</code>  are rendered as buttons, with a default <a href="https://developer.mozilla.org/en-US/docs/Web/Events/click"><code>click</code></a> event handler that resets all of the inputs in the form to
their initial values. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/reset">mdn</a></p>
    </blockquote>
</details>

<form>
    <div class="controls">
      <label for="user-id">User ID:</label>
      <input name="user-id" id="user-id">
      <input type="reset" value="Reset">
      <input disabled type="reset" value="Reset (Disabled)">
    </div>
</form>

```html
<form>
  <div class="controls">
    <label for="user-id">User ID:</label>
    <input name="user-id" id="user-id">
    <input type="reset" value="Reset">
    <input disabled type="reset" value="Reset (Disabled)">
  </div>
</form>
```

#### <a id="search" href="#search">Search</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a>  elements of type <code>search</code> are text fields designed for the user to enter search queries into. These are functionally identical to <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text"><code>text</code></a> inputs, but may be styled differently by the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search">user agent</a>. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search">mdn</a></p>
    </blockquote>
</details>

<p>
  <label class="block" for="search-populated">Search:</label>
  <input type="search" name="search-populated" id="search-populated" value="mine.css">
  <label class="block" for="search-placeholder">Search (Placeholder):</label>
  <input type="search" name="search-placeholder" id="search-placeholder" placeholder="Search...">
  <label class="block" for="search-disabled">Search (Disabled):</label>
  <input disabled type="search" name="search-disabled" id="search-disabled" value="mine.css">
</p>

```html
<label class="block" for="search-populated">Search:</label>
<input type="search" name="search-populated" id="search-populated" value="mine.css">
<label class="block" for="search-placeholder">Search (Placeholder):</label>
<input type="search" name="search-placeholder" id="search-placeholder" placeholder="Search...">
<label class="block" for="search-disabled">Search (Disabled):</label>
<input disabled type="search" name="search-disabled" id="search-disabled" value="mine.css">
```

#### <a id="submit" href="#submit">Submit</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>submit</code> are rendered as buttons. When the <a href="https://developer.mozilla.org/en-US/docs/Web/Events/click"><code>click</code></a> event occurs (typically because the user clicked the button), the <a href="https://developer.mozilla.org/en-US/docs/Glossary/user_agent">user agent</a> attempts to submit the form to the server. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/submit">mdn</a></p>
    </blockquote>
</details>

<p>
  <input type="submit" value="Submit">
  <input disabled type="submit" value="Submit (Disabled)">
</p>

```html
<input type="submit" value="Submit">
<input disabled type="submit" value="Submit (Disabled)">
```


#### <a id="tel" href="#tel">Tel</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>tel</code> are used to let the user enter and edit a telephone number. Unlike <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email"><code>&lt;input type="email"&gt;</code></a> and <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url"><code>&lt;input type="url"&gt;</code></a> , the input value is not automatically validated to a particular format before the form can be submitted, because formats for telephone numbers vary so much around the world. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel">mdn</a></p>
    </blockquote>
</details>

<p>
  <label class="block" for="phone-populated">Tel:</label>
  <input
    class="block"
    type="tel"
    name="phone-populated"
    id="phone-populated"
    value="123-456-7890"
    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
    required>
  <label class="block" for="phone-placeholder">Tel (Placeholder):</label>
  <input
    class="block"
    type="tel"
    name="phone-placeholder"
    id="phone-placeholder"
    placeholder="123-456-7890"
    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
    required>
  <small>Format: 123-456-7890</small>
  <label class="block" for="phone-disabled">Tel (Disabled):</label>
  <input
    class="block"
    disabled
    type="tel"
    name="phone-disabled"
    id="phone-disabled"
    value="123-456-7890"
    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
    required>
</p>

```html
<label class="block" for="phone-populated">Tel:</label>
<input
  class="block"
  type="tel"
  name="phone-populated"
  id="phone-populated"
  value="123-456-7890"
  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
  required>
<label class="block" for="phone-placeholder">Tel (Placeholder):</label>
<input
  class="block"
  type="tel"
  name="phone-placeholder"
  id="phone-placeholder"
  placeholder="123-456-7890"
  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
  required>
<small>Format: 123-456-7890</small>
<label class="block" for="phone-disabled">Tel (Disabled):</label>
<input
  class="block"
  disabled
  type="tel"
  name="phone-disabled"
  id="phone-disabled"
  value="123-456-7890"
  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
  required>
```

#### <a id="text" href="#text">Text</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>text</code> create basic single-line text fields. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text">mdn</a></p>
    </blockquote>
</details>

<p>
  <label class="block" for="name-populated">Name (4 to 8 characters):</label>
  <input
    class="block"
    type="text"
    name="name-populated"
    id="name-populated"
    value="Jane Doe"
    required
    minlength="4"
    maxlength="8"
    size="10">
  <label class="block" for="name-auto">Name (Auto-growing):</label>
  <input
    class="block content-sized"
    type="text"
    name="name-auto"
    id="name-auto"
    placeholder="Keep typing to grow this field...">
  <label class="block" for="name-placeholder">Name (Placeholder):</label>
  <input
    class="block"
    type="text"
    name="name-placeholder"
    id="name-placeholder"
    placeholder="Jane Doe"
    required
    minlength="4"
    maxlength="8"
    size="10">
  <label class="block" for="name-disabled">Name (Disabled):</label>
  <input
    class="block"
    disabled
    type="text"
    name="name-disabled"
    id="name-disabled"
    value="Jane Doe"
    required
    minlength="4"
    maxlength="8"
    size="10">
</p>

```html
<label class="block" for="name-populated">Name (4 to 8 characters):</label>
<input
  class="block"
  type="text"
  name="name-populated"
  id="name-populated"
  value="Jane Doe"
  required
  minlength="4"
  maxlength="8"
  size="10">
<label class="block" for="name-auto">Name (Auto-growing):</label>
<input
  class="block content-sized"
  type="text"
  name="name-auto"
  id="name-auto"
  placeholder="Keep typing to grow this field...">
<label class="block" for="name-placeholder">Name (Placeholder):</label>
<input
  class="block"
  type="text"
  name="name-placeholder"
  id="name-placeholder"
  placeholder="Jane Doe"
  required
  minlength="4"
  maxlength="8"
  size="10">
<label class="block" for="name-disabled">Name (Disabled):</label>
<input
  class="block"
  disabled
  type="text"
  name="name-disabled"
  id="name-disabled"
  value="Jane Doe"
  required
  minlength="4"
  maxlength="8"
  size="10">
```

#### <a id="textarea" href="#textarea">Text Area</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p>The <strong><code>&lt;textarea&gt;</code></strong> <a href="/en-US/docs/Web/HTML">HTML</a> element represents a multi-line plain-text editing control, useful when you want to allow users to enter a sizeable amount of free-form text, for example a comment on a review or feedback form. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea">mdn</a></p>
    </blockquote>
</details>

<p>
  <label class="block" for="story">Tell us your story:</label>
  <textarea
    class="block"
    id="story"
    name="story"
    rows="5"
    cols="33">It was a dark and stormy night...</textarea>
  <label class="block" for="story-auto">Tell us your story (Auto-growing):</label>
  <textarea
    class="block"
    id="story-auto"
    name="story-auto"
    placeholder="Start typing to grow this field..."></textarea>
  <label class="block" for="story-placeholder">Tell us your story (Placeholder):</label>
  <textarea
    class="block"
    id="story-placeholder"
    name="story-placeholder"
    rows="5"
    cols="33"
    placeholder="It was a dark and stormy night..."></textarea>
  <label class="block" for="story-disabled">Tell us your story (Disabled):</label>
  <textarea
    class="block"
    disabled
    id="story-disabled"
    name="story-disabled"
    rows="5"
    cols="33">It wasn't a dark and stormy night...</textarea>
</p>

```html
<label class="block" for="story">Tell us your story:</label>
<textarea
  class="block"
  id="story"
  name="story"
  rows="5"
  cols="33">It was a dark and stormy night...</textarea>
<label class="block" for="story-auto">Tell us your story (Auto-growing):</label>
<textarea
  class="block"
  id="story-auto"
  name="story-auto"
  placeholder="Start typing to grow this field..."></textarea>
<label class="block" for="story-placeholder">Tell us your story (Placeholder):</label>
<textarea
  class="block"
  id="story-placeholder"
  name="story-placeholder"
  rows="5"
  cols="33"
  placeholder="It was a dark and stormy night..."></textarea>
<label class="block" for="story-disabled">Tell us your story (Disabled):</label>
<textarea
  class="block"
  disabled
  id="story-disabled"
  name="story-disabled"
  rows="5"
  cols="33">It wasn't a dark and stormy night...</textarea>
```

#### <a id="time" href="#time">Time</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>time</code> let users enter a time. The control’s interface varies by browser and operating system. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time">mdn</a></p>
    </blockquote>
</details>

<p>
  <label class="block" for="appt">Choose a time for your meeting:</label>
  <input type="time" name="appt" id="appt" value="10:30" min="09:00" max="18:00" required>
  <small>Office hours are 9am to 6pm</small>
  <label class="block" for="appt-empty">Time (Empty):</label>
  <input type="time" name="appt-empty" id="appt-empty" min="09:00" max="18:00" required>
  <label class="block" for="appt-disabled">Time (Disabled):</label>
  <input disabled type="time" name="appt-disabled" id="appt-disabled" value="16:00" min="09:00" max="18:00" required>
</p>

```html
<label class="block" for="appt">Choose a time for your meeting:</label>
<input type="time" name="appt" id="appt" value="10:30" min="09:00" max="18:00" required>
<small>Office hours are 9am to 6pm</small>
<label class="block" for="appt-empty">Time (Empty):</label>
<input type="time" name="appt-empty" id="appt-empty" min="09:00" max="18:00" required>
<label class="block" for="appt-disabled">Time (Disabled):</label>
<input disabled type="time" name="appt-disabled" id="appt-disabled" value="16:00" min="09:00" max="18:00" required>
```

#### <a id="url" href="#url">URL</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>url</code> are used to let the user enter and edit a URL. –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url">mdn</a></p>
    </blockquote>
</details>

<p>
  <label class="block" for="url-populated">Enter an https:// URL:</label>
  <input
    class="block"
    type="url"
    name="url-populated"
    id="url-populated"
    value="https://example.com"
    pattern="https://.*"
    size="30"
    required>
  <label class="block" for="url-placeholder">URL (Placeholder):</label>
  <input
    class="block"
    type="url"
    name="url-placeholder"
    id="url-placeholder"
    placeholder="https://example.com"
    pattern="https://.*"
    size="30"
    required>
  <label class="block" for="url-disabled">URL (Disabled):</label>
  <input
    disabled
    class="block"
    type="url"
    name="url-disabled"
    id="url-disabled"
    value="https://example.com"
    pattern="https://.*"
    size="30"
    required>
</p>

```html
<label class="block" for="url-populated">Enter an https:// URL:</label>
<input
  class="block"
  type="url"
  name="url-populated"
  id="url-populated"
  value="https://example.com"
  pattern="https://.*"
  size="30"
  required>
<label class="block" for="url-placeholder">URL (Placeholder):</label>
<input
  class="block"
  type="url"
  name="url-placeholder"
  id="url-placeholder"
  placeholder="https://example.com"
  pattern="https://.*"
  size="30"
  required>
<label class="block" for="url-disabled">URL (Disabled):</label>
<input
  disabled
  class="block"
  type="url"
  name="url-disabled"
  id="url-disabled"
  value="https://example.com"
  pattern="https://.*"
  size="30"
  required>
```

#### <a id="week" href="#week">Week</a>

<details>
    <summary><strong>Description</strong></summary>
    <blockquote>
      <p><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"><code>&lt;input&gt;</code></a> elements of type <code>week</code> create input fields allowing easy entry of a year plus the <a href="https://en.wikipedia.org/wiki/ISO_8601#Week_dates">ISO 8601 week number</a> during that year (i.e., week 1 to <a href="https://en.wikipedia.org/wiki/ISO_8601#Week_dates">52 or 53</a>). –<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/week">mdn</a></p>
    </blockquote>
</details>

<p>
  <label class="block" for="week-example">Week:</label>
  <input
    class="block"
    value="2018-W20"
    type="week"
    name="week-example"
    id="week-example"
    min="2018-W18"
    max="2018-W26"
    required>
  <label class="block" for="week-empty">Week (Empty):</label>
  <input
    class="block"
    type="week"
    name="week-empty"
    id="week-empty"
    min="2018-W18"
    max="2018-W26"
    required>
  <label class="block" for="week-disabled">Week (Disabled):</label>
  <input
    class="block"
    disabled
    value="2018-W24"
    type="week"
    name="week-disabled"
    id="week-disabled"
    min="2018-W18"
    max="2018-W26"
    required>
</p>

```html
<label class="block" for="week-example">Week:</label>
<input
  class="block"
  value="2018-W20"
  type="week"
  name="week-example"
  id="week-example"
  min="2018-W18"
  max="2018-W26"
  required>
<label class="block" for="week-empty">Week (Empty):</label>
<input
  class="block"
  type="week"
  name="week-empty"
  id="week-empty"
  min="2018-W18"
  max="2018-W26"
  required>
<label class="block" for="week-disabled">Week (Disabled):</label>
<input
  class="block"
  disabled
  value="2018-W24"
  type="week"
  name="week-disabled"
  id="week-disabled"
  min="2018-W18"
  max="2018-W26"
  required>
```

### <a id="form-controls" href="#form-controls">Additional Form Controls</a>

#### <a id="select" href="#select">Select, Option, and Optgroup</a>

The select element presents a menu of options. Optgroups add labels to related choices.

<div class="paragraph">
  <label class="block" for="destination">Destination:</label>
  <select class="block" name="destination" id="destination">
    <option value="" selected disabled>Choose a destination</option>
    <optgroup label="North America">
      <option value="vancouver">Vancouver</option>
      <option value="portland">Portland</option>
    </optgroup>
    <optgroup label="Europe">
      <option value="helsinki">Helsinki</option>
      <option value="lisbon">Lisbon</option>
    </optgroup>
  </select>
  <label class="block" for="destination-disabled">Destination (Disabled):</label>
  <select
    class="block"
    disabled
    name="destination-disabled"
    id="destination-disabled">
    <option value="helsinki">Helsinki</option>
  </select>
</div>

```html
<label class="block" for="destination">Destination:</label>
<select class="block" name="destination" id="destination">
  <option value="" selected disabled>Choose a destination</option>
  <optgroup label="North America">
    <option value="vancouver">Vancouver</option>
    <option value="portland">Portland</option>
  </optgroup>
  <optgroup label="Europe">
    <option value="helsinki">Helsinki</option>
    <option value="lisbon">Lisbon</option>
  </optgroup>
</select>
<label class="block" for="destination-disabled">Destination (Disabled):</label>
<select
  class="block"
  disabled
  name="destination-disabled"
  id="destination-disabled">
  <option value="helsinki">Helsinki</option>
</select>
```

#### <a id="datalist" href="#datalist">Datalist</a>

A datalist supplies suggestions while preserving free-form text entry.

<p>
  <label class="block" for="browser-choice">Browser:</label>
  <input
    class="block"
    list="browser-suggestions"
    name="browser-choice"
    id="browser-choice"
    placeholder="Choose or enter a browser">
  <datalist id="browser-suggestions">
    <option value="Chrome"></option>
    <option value="Firefox"></option>
    <option value="Safari"></option>
  </datalist>
</p>

```html
<label class="block" for="browser-choice">Browser:</label>
<input
  class="block"
  list="browser-suggestions"
  name="browser-choice"
  id="browser-choice"
  placeholder="Choose or enter a browser">
<datalist id="browser-suggestions">
  <option value="Chrome"></option>
  <option value="Firefox"></option>
  <option value="Safari"></option>
</datalist>
```

#### <a id="output" href="#output">Output</a>

Output associates a calculated result with the controls that produced it.

<form class="paragraph" id="quantity-form">
  <label class="block" for="quantity">Quantity:</label>
  <input
    type="range"
    name="quantity"
    id="quantity"
    min="0"
    max="100"
    value="40">
  <label for="quantity-output">Selected quantity:</label>
  <output
    name="quantity-output"
    id="quantity-output"
    for="quantity">40</output>
</form>

```html
<form id="quantity-form">
  <label class="block" for="quantity">Quantity:</label>
  <input
    type="range"
    name="quantity"
    id="quantity"
    min="0"
    max="100"
    value="40">
  <label for="quantity-output">Selected quantity:</label>
  <output
    name="quantity-output"
    id="quantity-output"
    for="quantity">40</output>
</form>
```

```js
const quantity = document.querySelector('#quantity')
const output = document.querySelector('#quantity-output')

quantity.addEventListener('input', () => {
  output.value = quantity.value
})
```

#### <a id="meter" href="#meter">Meter</a>

Meters show scalar measurements within a known range and can identify low, high, and optimum regions.

<div class="paragraph">
  <label class="block" for="storage-meter">Storage used:</label>
  <meter
    id="storage-meter"
    min="0"
    max="100"
    low="30"
    high="80"
    optimum="20"
    value="65">65 of 100</meter>
  <label class="block" for="battery-meter">Battery remaining:</label>
  <meter
    id="battery-meter"
    min="0"
    max="100"
    low="20"
    high="80"
    optimum="100"
    value="15">15 of 100</meter>
</div>

```html
<label class="block" for="storage-meter">Storage used:</label>
<meter
  id="storage-meter"
  min="0"
  max="100"
  low="30"
  high="80"
  optimum="20"
  value="65">65 of 100</meter>
<label class="block" for="battery-meter">Battery remaining:</label>
<meter
  id="battery-meter"
  min="0"
  max="100"
  low="20"
  high="80"
  optimum="100"
  value="15">15 of 100</meter>
```

#### <a id="progress" href="#progress">Progress</a>

Progress elements show determinate work with a value or indeterminate work without one.

<div class="paragraph">
  <label class="block" for="download-progress">Download:</label>
  <progress id="download-progress" max="100" value="65">65%</progress>
  <label class="block" for="preparing-progress">Preparing:</label>
  <progress id="preparing-progress">Working...</progress>
</div>

```html
<label class="block" for="download-progress">Download:</label>
<progress id="download-progress" max="100" value="65">65%</progress>
<label class="block" for="preparing-progress">Preparing:</label>
<progress id="preparing-progress">Working...</progress>
```

#### <a id="fieldset" href="#fieldset">Fieldset</a>

<form style="display: inline-block;">
    <fieldset>
      <legend>Log into your account:</legend>
      <div>
        <label class="block" for="username">Email:</label>
        <input type="email" name="username" id="username">
      </div>
      <div>
        <label class="block" for="password-fieldset">Password:</label>
        <input type="password" name="password" id="password-fieldset">
      </div>
      <input style="width:100%" type="submit" value="Login">
    </fieldset>
</form>

```html
<form style="display: inline-block;">
  <fieldset>
    <legend>Log into your account:</legend>
    <div>
      <label class="block" for="username">Email:</label>
      <input type="email" name="username" id="username">
    </div>
    <div>
      <label class="block" for="password-fieldset">Password:</label>
      <input type="password" name="password" id="password-fieldset">
    </div>
    <input style="width:100%" type="submit" value="Login">
  </fieldset>
</form>
```

### <a id="input-states" href="#input-states">Input States</a>

#### <a id="validation" href="#validation">Validation</a>

Mine.css leaves the eager `:valid` and `:invalid` states unpainted so untouched required fields do not look completed or broken. Constrained text and selection controls receive valid or invalid borders through [`:user-valid`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:user-valid) and [`:user-invalid`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:user-invalid) after the browser records an interaction. Pair the visual state with useful labels, instructions, and error text.

Change either value and leave the field, or submit the form, to see the interaction-gated states.

<form class="paragraph" id="validation-form">
  <label class="block" for="validation-email">Contact email:</label>
  <input
    aria-describedby="validation-help"
    class="block"
    required
    type="email"
    name="validation-email"
    id="validation-email"
    value="not-an-email">
  <label class="block" for="validation-url">Website:</label>
  <input
    aria-describedby="validation-help"
    class="block"
    required
    type="url"
    name="validation-url"
    id="validation-url"
    value="https://example.com">
  <small id="validation-help">Use a complete email address and an absolute URL.</small>
  <div><input type="submit" value="Check validity"></div>
</form>

```html
<form id="validation-form">
  <label class="block" for="validation-email">Contact email:</label>
  <input
    aria-describedby="validation-help"
    class="block"
    required
    type="email"
    name="validation-email"
    id="validation-email"
    value="not-an-email">
  <label class="block" for="validation-url">Website:</label>
  <input
    aria-describedby="validation-help"
    class="block"
    required
    type="url"
    name="validation-url"
    id="validation-url"
    value="https://example.com">
  <small id="validation-help">Use a complete email address and an absolute URL.</small>
  <div><input type="submit" value="Check validity"></div>
</form>
```

```js
const form = document.querySelector('#validation-form')
form.addEventListener('submit', event => event.preventDefault())
```

#### <a id="readonly" href="#readonly">Readonly</a>

Readonly controls remain focusable and submit their values, but users cannot edit them.

<p>
  <label class="block" for="account-id">Account ID (Readonly):</label>
  <input
    class="block"
    readonly
    type="text"
    name="account-id"
    id="account-id"
    value="acct_12345">
  <label class="block" for="readonly-notes">Notes (Readonly):</label>
  <textarea
    class="block"
    readonly
    name="readonly-notes"
    id="readonly-notes"
    rows="3"
    cols="33">Managed by your organization.</textarea>
</p>

```html
<label class="block" for="account-id">Account ID (Readonly):</label>
<input
  class="block"
  readonly
  type="text"
  name="account-id"
  id="account-id"
  value="acct_12345">
<label class="block" for="readonly-notes">Notes (Readonly):</label>
<textarea
  class="block"
  readonly
  name="readonly-notes"
  id="readonly-notes"
  rows="3"
  cols="33">Managed by your organization.</textarea>
```

#### <a id="multiple" href="#multiple">Multiple</a>

The multiple attribute applies to email, file, and select controls.

<div class="paragraph">
  <label class="block" for="multiple-email">Email recipients (Multiple):</label>
  <input
    class="block"
    multiple
    type="email"
    name="multiple-email"
    id="multiple-email"
    value="alice@example.com, bob@example.com">
  <label class="block" for="multiple-file">Attachments (Multiple):</label>
  <input multiple type="file" name="multiple-file" id="multiple-file">
  <label class="block" for="multiple-select">Tags (Multiple):</label>
  <select
    class="block"
    multiple
    size="3"
    name="multiple-select"
    id="multiple-select">
    <option value="css" selected>CSS</option>
    <option value="html">HTML</option>
    <option value="javascript" selected>JavaScript</option>
  </select>
</div>

```html
<label class="block" for="multiple-email">Email recipients (Multiple):</label>
<input
  class="block"
  multiple
  type="email"
  name="multiple-email"
  id="multiple-email"
  value="alice@example.com, bob@example.com">
<label class="block" for="multiple-file">Attachments (Multiple):</label>
<input multiple type="file" name="multiple-file" id="multiple-file">
<label class="block" for="multiple-select">Tags (Multiple):</label>
<select
  class="block"
  multiple
  size="3"
  name="multiple-select"
  id="multiple-select">
  <option value="css" selected>CSS</option>
  <option value="html">HTML</option>
  <option value="javascript" selected>JavaScript</option>
</select>
```

#### <a id="indeterminate" href="#indeterminate">Indeterminate</a>

Checkbox indeterminacy is a DOM property rather than an HTML attribute. It affects presentation, not the submitted checked value.

<div class="paragraph">
  <input type="checkbox" name="selected-items" id="indeterminate-checkbox">
  <label for="indeterminate-checkbox">Some items selected (Indeterminate)</label>
</div>

```html
<input type="checkbox" name="selected-items" id="indeterminate-checkbox">
<label for="indeterminate-checkbox">Some items selected (Indeterminate)</label>
```

```js
const checkbox = document.querySelector('#indeterminate-checkbox')
checkbox.indeterminate = true
```
