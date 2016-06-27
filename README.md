bro-start-nano
=====

Tiny starter kit for making cool websites

### Features
- [Webpack](https://github.com/webpack/webpack) + [Webpack-dev-server](https://github.com/webpack/webpack-dev-server)
- [ES6](https://github.com/lukehoban/es6features#readme) transpilation with [Babel](https://github.com/babel/babel)
- [Stylus](https://github.com/stylus/stylus/) + [nib](https://github.com/tj/nib) + [autoprefixer](https://github.com/jescalan/autoprefixer-stylus)
- [mustache](https://mustache.github.io/) with [mu](https://github.com/raycmorgan/Mu)
- [BrowserSync](https://github.com/BrowserSync/browser-sync) + [localtunnel](https://github.com/localtunnel/localtunnel)
- [imagemin-cli](https://github.com/imagemin/imagemin-cli) + [pngquant](https://github.com/imagemin/imagemin-pngquant)


### Installation
```
svn export https://github.com/brocessing/bro-start-nano/trunk bro-start-nano
cd bro-start-nano
npm install
```
You can also [download stable releases](https://github.com/brocessing/bro-start-nano/releases)


### Usage
- `npm run dev`
Run a BrowserSync proxy with Hot Module Replacement on localhost:3001

- `npm run build`
Production ready build

- `npm run imagemin`
Compress images in src/static/images/

- `npm run bundle-analyzer`
Display the size of all used modules with [webpack-bundle-size-analyzer](https://github.com/robertknight/webpack-bundle-size-analyzer)

This command is for optimization only. Despite making files in your build folder,
don't use it for production ready builds.

### To do
- Add html-minifier to the production build script

### License
MIT.
