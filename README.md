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

- Static rendering from yaml files and handlebars templates
- Easy routing : by default hierarchy of your yaml files are the routes of your sites
- PostCSS + Stylus + Autoprefixer
- ES6 transpilation with babel + ES2015 presets
- Webpack dev server and hot reloading
- BrowserSync and its features (localtunnel, xip.io, ...)
- Hash from webpack is available as data in your layouts

<br>
<h1></h1>
<br>

### :hammer:  License
MIT.

<br><br>