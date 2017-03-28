<br>
<p align="center">
  <img src="static/brostart.gif" width="125" alt="brostart">
</p>
<h1 align="center">bro-start</h1>
<h3 align="center">Blazing fast webpack setup for static websites</h3>

<div align="center">
  <!-- License -->
  <a href="https://raw.githubusercontent.com/brocessing/bro-start/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License" />
  </a>
</div>

<br><br>
<br><br>
<br><br>

### :unamused:  Why another frontend setup?

Webpack is a nice, easily customizable module bundler.<br>
It pairs nice with modern javascript frameworks like Vue or React but it's a hassle when it comes to compile some good old html files. :older_man:
_Bro-start_ combines for you the coolest webpack features with a simple static site generator with yaml and handlebars.

<br>
<h1></h1>
<br>

### :santa:  I want my bro-start setup!

```sh
svn export https://github.com/brocessing/bro-start/trunk bro-start
cd bro-start
yarn install
# Yarn is FAST ! But npm install will do the job as well.
```

You can also [download the latest release](https://github.com/brocessing/bro-start/releases/latest)

<br>
<h1></h1>
<br>

### :handbag:  Features

- Webpack 2
- PostCSS + Stylus + Autoprefixer
- ES6 transpilation with babel + ES2015 presets
- Webpack Dev Server and Hot Reloading
- Static rendering from handlebars templates
- Easily configurable with multiple config files for each parts of the starter kit
- _autoPartials_ option to register all your handlebars partials automatically before any rendering
- BrowserSync and its features (localtunnel, xip.io, ...)
- PHP middleware using the built-in server of php cli
- Hash, publicPath from webpack is available as data in your layouts
- `deploy` script to push the build on a gh-pages branch, using `ghp`
- Basic tests with `snazzy` and `dependency-check`


<br>
<h1></h1>
<br>

### :hammer:  License
MIT.

<br><br>