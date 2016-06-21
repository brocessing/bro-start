const path    = require('path');
const express = require('express');
const app     = express();
const IP      = '0.0.0.0';
const PORT    = 3000;

const isProduction = (process.env.NODE_ENV === 'production');
const contentPath  = isProduction ?
                      path.resolve('build') :
                      path.resolve('src/static')

//serve static files — webpack handle js & css in dev env
app.use(express.static(contentPath, { index: 'index.html' }));

/*

  You can put your server Routes here

 */

//historyApiFallback for SPA, if needed
app.get('*', (req, res) => {
  res.sendFile(path.join(contentPath, 'index.html'));
});

app.listen(PORT, (err) => { if (err) console.log(err); });

module.exports = {
  ip: IP,
  port: PORT,
  instance: app
};