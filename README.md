bro-start
=====

Tiny starter kit for making cool websites

### Features
- [Webpack](https://github.com/webpack/webpack) + [Webpack-dev-server](https://github.com/webpack/webpack-dev-server)
- [ES6](https://github.com/lukehoban/es6features#readme) transpilation with [Babel](https://github.com/babel/babel)
- [Stylus](https://github.com/stylus/stylus/) + [nib](https://github.com/tj/nib) + [autoprefixer](https://github.com/jescalan/autoprefixer-stylus)
- [mustache](https://mustache.github.io/) with [mu](https://github.com/raycmorgan/Mu)
- [BrowserSync](https://github.com/BrowserSync/browser-sync) + [localtunnel](https://github.com/localtunnel/localtunnel)
- [imagemin-cli](https://github.com/imagemin/imagemin-cli) + [pngquant](https://github.com/imagemin/imagemin-pngquant)
- 'Doodle mode' to quickly create prototypes or codepen-like stuff

### Installation
```
svn export https://github.com/brocessing/bro-start/trunk bro-start
cd bro-start
npm install
```
You can also [download stable releases](https://github.com/brocessing/bro-start/releases)


### Usage

###### Main scripts

- `npm run dev` Run a BrowserSync server with Hot Module Replacement
- `npm run build` Production ready build
- `npm run imagemin` Compress images in src/static/images/

###### Doodle-specific scripts

- `npm run doodle -- doodleName` Create the doodle _doodleName_ in the doodles folder.
- `npm run dev -- doodleName` Run a BrowserSync server for _doodleName_
- `npm run build -- doodleName` Production ready build of _doodleName_



### To do
- Add html-minifier to the production build script
- Add an efficient webfont generator

### License
MIT.
