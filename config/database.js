const cryptoRandomString = require('crypto-random-string');

const crypto = cryptoRandomString(250);


module.exports = {
  uri: 'mongodb://localhost:27017/' + this.db,
  secret: crypto,
  db: 'myBlogDB'
}
