# How to use my template-system

My Templates are Basically just some HTML extended by embedded NodeJS, so the only files that have to be modified are the html files.

![](https://puu.sh/AsNXr/982248aef9.png)

There are `Template`s and there are `Component`s, basically you can use a `Component` as a `Template` but I would not appreciate it.

## Templates

Template Files are found in the html directory, I prefer them to be directly in that folder but you can also put them into folders. The difference is in the naming.

the file `src/html/index.html` would have the name `index` if ther should be a Template created with it. So a file in the directory `src/html/foo/bar.html` would be adressed with `foo/bar`.

In order to create a Template you would do the following:
```JS
const Template = require('./class/Template'); // from index.js
// ....
let indexTemplate = new Template('index');
// then you would render it using
console.log(indexTemplate.render());
```
or
```JS
app.get('/', (req, res) => {
  res.send(new Template('index').render());
})
```

a Template is written as follows:

```HTML
<DOCTYPE html>
<html>
  <head>
    <!-- Some header stuff, or .. -->
    {{ new Component('header').render() }}
  </head>
  <body>
    <h1>Templates</h1>
    <p>Are cool, but I like NodeJS so I made this</p>

    {{
      const somePackage = require('package');
      somePackage('something to with the package');
    }}
  </body>
</html>
```

## Template JavaScript

everything in the template enclosed in `{{` `}}` will be treated as NodeJS, and like that it will be evaluated by the `Template` or `Component` object. So `this` in these Brackets is always a `Template` or `Component` and has at least a `name` and a `path`;

```JS
{{
`${this.name} @ ${this.path}`
}}
```

would result in `index @ {../}src/html/index.html` being printed into the template wher the code was

## Components

Basically Components could be used as Template, but again I would not appreciate it. Components are small parts of the website that you want to reuse. For my use-case I write short cuts for certain elements in MaterializeCSS that I want to use on multiple templates and if I want to change them that I do not have to rewrite them for every template.

Components can, when being created, be given data to work with.

```JS
let header = new Component('header', {title: 'Home'});
```

when now rendering `header` it would be able to use `this.data` and by that access `this.data.title` as **Home**

In my case I used it to set the page title page-specific,
somewhere in my templates I wrote

```JS
{{ new Component('header', {title: 'Home'}).render() }}
```

and in the `src/html/component/header.html` I wrote:
```HTML
<title>{{ this.data.title }} &#x2605; kouna.io</title>
```

## Warning

If you make any Logical Mistake in your code, so that node wont execute it without an error, or not return a string at the end of a template block it will result in a empty spot on the page, and would cause an error that will be logged in the console
