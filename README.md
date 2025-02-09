# gvfsashgawt-nekoweb

`Home of the rawest j,rk`

![Apple Tree I, 1912 by Gustav Klimt [datamoshed]](doc/apple-tree-mosh-anim.gif "Apple Tree I, 1912 by Gustav Klimt [datamoshed]")

`Long live the Glitch!`

Built using custom `neko-ssg` bundler.

## but why? O-o

_Because zere're no thero-cost abstractions._

<details>

  <summary>
    <b>INCOHERENT RANT ABOUT FRAMEWORKS</b>
  </summary>

Every framework is designed to get rid of some routine steps. It is simple to start a development, but it also constraints your end results. And it's not what I want for an artistic project like this.

Besides, I have already built this website with plain HTML/CSS/JS. And it was so much fun!! Although, main drawbacks of this approach are: 1 - that it's hard to structure JS code this way, and 2 - that I also needed to duplicate some HTML elements across different pages (which is pain in the ass to support).

Therefore, I've decided to put an effort into writing a basic tooling to suit my needs.

</details>

## core technologies

- [EJS](https://handlebarsjs.com/) — HTML templating
- [Node](https://nodejs.org/) — bundler and development server

## `neko-ssg` features

- development server for localhost
- build script (ejs->html compilation)
- html/js/css files compression for production build
- static files handling
- folder-based routing

## project structure

```
/.neko-ssg  # bundler directory
/build      # compilation output
/src        # compilation input
  /partials # repeated page elements
  /pages    # page templates/configs
  /scripts  # javascript modules
  /styles   # css stylesheets
/static     # static files (images, etc.)
```

### routing

All you need for routing is to put `<url>.ejs` and `<url>.config.js` files inside `src/pages` directory.

On build your `<url>.ejs` file will be compiled into `<url>.html` file.

Development server handles requests this way:

- `GET /` returns `build/index.html`
- `GET /about` returns `build/about.html`
- `GET /static/image.png` returns `build/static/image.png`
- ...and so on...

### errors handling

- If requested file not found, server returns `404`\*.
- If requested file has unsupported format, server returns `415`.
- If using any other HTTP method except `GET`, server returns `405`.

> \* _404 resolved to `build/not_found.html` (if exists)_

## commands

- `yarn build` -- run build from source
- `yarn clear` -- clears build folder
- `yarn start` -- run local server with existing build
- `yarn dev` -- run development server (overrides previous build)

## deployment

Run build, pack `build` folder into `.zip` file and use `Import [ZIP]` option from Dashboard on Nekoweb.

Find more at [deploy2nekoweb](https://deploy.nekoweb.org/) to automate this process.

### site configuration

1. Turn on **Enable 'nice links'**
2. **Serve Folder:** specify `<project_dir>/build`
