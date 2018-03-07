const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const config = require('../config/database');



const Schema = mongoose.Schema;


let emailLengthChecker = (email) => {
  if(!email){
      return false;
  }else {
    if(email.length < 5 ||  email.length > 30){
      return false;
    } else {
      return true;
    }
  }
};

let validEmailChecker = (email) => {
  if(!email){
    return false;
  } else {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  return regExp.test(email);
  }
};


let userLengthChecker = (username) => {
  if(!username){
    return false;
  } else {
    if(username.length < 3 || username.length > 30){
      return false;
    }else {
      return true;
    }
  }
};

let userValidChecker = (username) => {
  if(!username){
    return false;
  } else {
  const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
  return regExp.test(username);
  }
}


let validPassword = (password) => {
    if(!password) {
      return false;
    } else {
      const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,30}/);
      return regExp.test(password);
    }
};
let passwordLengthChecker = (password) => {
  if(!password){
    return false;
  } else {
    if(password.length < 3 || password.length > 20 ){
      return false;
    }else {
      return true;
    }
  }
}
const emailValidators = [
  {
    validator: emailLengthChecker,
     msg: 'Email must be atleast 5 characters but no more than 30'
  },
  {
    validator: validEmailChecker,
    msg: 'Must use a valid Email'
  }
];

const userValidators = [
   {
     validator: userLengthChecker,
     msg: 'Username must be atleast 5 characters but no more than 30'
   },
   {
     validator: userValidChecker,
     msg:'Username consist only with characters no special characters'
   }
];

const passwordValidators = [
  {
    validator: passwordLengthChecker,
    msg: 'Password must be atleast 5 characters but no more than 20'
  },
  {
    validator: validPassword,
    msg: 'Must have at least one uppercase, lowercase, special character, and number'
  }
];

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators  },
  username: { type: String, required: true, unique: true, lowercase: true, validate: userValidators},
  password: { type: String, required: true, validate: passwordValidators },
});

userSchema.pre('save', function (next) {
  if(!this.isModified('password'))
  return next();

  bcrypt.hash(this.password, null, null, (err, hash) => {
    if(err) return next(err);
    this.password = hash;
    next();
  });

});

;


userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
