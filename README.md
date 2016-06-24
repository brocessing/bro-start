bro-start-nano
=====

Tiny starter kit for one-page experiences

### Features
* [Webpack](https://github.com/webpack/webpack) + [Webpack-dev-server](https://github.com/webpack/webpack-dev-server)
* [ES6](https://github.com/lukehoban/es6features#readme) transpilation with [Babel](https://github.com/babel/babel)
* [Stylus](https://github.com/stylus/stylus/) + [nib](https://github.com/tj/nib) + [autoprefixer](https://github.com/jescalan/autoprefixer-stylus)
* [BrowserSync](https://github.com/BrowserSync/browser-sync) + [localtunnel](https://github.com/localtunnel/localtunnel)
* [imagemin-cli](https://github.com/imagemin/imagemin-cli) + [pngquant](https://github.com/imagemin/imagemin-pngquant)

### Installation
```
svn export https://github.com/brocessing/bro-start-nano/trunk bro-start-nano
npm install
```

### Usage
- `npm run dev`
Run a BrowserSync proxy with Hot Module Replacement on localhost:3001

- `npm run build`
Production ready build

- `npm run build-analyze`
Production ready build and display the size of all used modules with [webpack-bundle-size-analyzer](https://github.com/robertknight/webpack-bundle-size-analyzer)

- `npm run imagemin`
Compress images in src/static/images/

### License
MIT.
