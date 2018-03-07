const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');



module.exports = (router) => {

router.post('/register', (req, res) => {

  if(!req.body.email){
    res.json({ success: false, message: 'You must provide an e-mail address'});
  } else {
      if(!req.body.username) {
        res.json({ success: false, message: 'You must provide an username'});
      } else {
        if(!req.body.password) {
            res.json({ success: false, message: 'You must provide an password'});
        } else {

          let user = new User({
          email :  req.body.email.toLowerCase(),
          username : req.body.username.toLowerCase(),
          password : req.body.password,
        });


  user.save((err) => {
    if (err) {
      console.log(err);
      if (err.code === 11000) {
        res.json({
          sucess: false,
          message: 'Username or E-mail already exist'
        });
      } else {
        if (err.errors) {
          if (err.errors.email) {
            res.json({
              success: false,
              message: err.errors.email.message
            });
          } else {
            if (err.errors.username) {
              res.json({
                success: false,
                message: err.errors.username.message
              });
            } else {
              if(err.errors.password){
                res.json({
                  success: false,
                  message: err.errors.password.message
                });
              }
            }
          }
        } else {
          res.json({
            success: false,
            message: 'Could not register user'
          });
        }
      }

    } else {
      res.json({
        success: true,
        message: 'User Registered'
      });
    }


  });


        }
      }
  }

});

router.get('/checkEmail/:email', (req, res) => {
  // Check if email was provided in paramaters
  if (!req.params.email) {
    res.json({ success: false, message: 'E-mail was not provided' }); // Return error
  } else {
    // Search for user's e-mail in database;
    User.findOne({ email: req.params.email }, (err, user) => {
      if (err) {
        res.json({ success: false, message: err }); // Return connection error
      } else {
        // Check if user's e-mail is taken
        if (user) {
          res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
        } else {
          res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
        }
      }
    });
  }
});


router.get('/checkUsername/:username', (req, res) => {
  // Check if username was provided in paramaters
  if (!req.params.username) {
    res.json({ success: false, message: 'Username was not provided' }); // Return error
  } else {
    // Look for username in database
    User.findOne({ username: req.params.username }, (err, user) => {
      // Check if connection error was found
      if (err) {
        res.json({ success: false, message: err }); // Return connection error
      } else {
        // Check if user's username was found
        if (user) {
          res.json({ success: false, message: 'Username is already taken' }); // Return as taken username
        } else {
          res.json({ success: true, message: 'Username is available' }); // Return as vailable username
        }
      }
    });
  }
});
/* ========
LOGIN ROUTE
======== */
router.post('/login', (req, res) => {
  // Check if username was provided
  if (!req.body.username) {
    res.json({ success: false, message: 'No username was provided' }); // Return error
  } else {
    // Check if password was provided
    if (!req.body.password) {
      res.json({ success: false, message: 'No password was provided.' }); // Return error
    } else {
      // Check if username exists in database
      User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: err }); // Return error
        } else {
          // Check if username was found
          if (!user) {
            res.json({ success: false, message: 'Username not found.' }); // Return error
          } else {
            const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
            // Check if password is a match
            if (!validPassword) {
              res.json({ success: false, message: 'Password invalid' }); // Return error
            } else {
              const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); // Create a token for client
              res.json({ success: true, message: 'Success!', token: token, user: { username: user.username } }); // Return success and token to frontend
            }
          }
        }
      });
    }
  }
});

router.use((req, res, next) => {
    const token =  req.headers['authorization'];

    if(!token) {
      res.json({ success: false, message: 'No token provided'});
    } else {
      jwt.verify(token, config.secret, (err, decoded) => {
            if(err) {
              res.json({ success: false, message: 'Token is expired! ' + err})
            } else {
              req.decoded = decoded;
              next();
            }
      });
    }
});


router.get('/profile', (req, res) => {
  // Search for user in database
  User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
    // Check if error connecting
    if (err) {
      res.json({ success: false, message: err }); // Return error
    } else {
      // Check if user was found in database
      if (!user) {
        res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
      } else {
        res.json({ success: true, user: user }); // Return success, send user object to frontend for profile
      }
    }
  });
});
  return router;
}
