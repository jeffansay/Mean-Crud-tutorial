const cryptoRandomString = require('crypto-random-string');

const crypto = cryptoRandomString(250);


module.exports = {
  uri: 'mongodb://localhost:27017/myBlogDB',
  secret: crypto,
}
