var Message = require('../models/message');
var User = require('../models/user');
var passport = require('passport');
var bcrypt = require('bcryptjs');

const {body,validationResult} = require('express-validator');
var async = require('async');

exports.user_create_get = (req,res,next)=> {
  res.render('signup');
};

exports.user_create_post = [
  body('firstName', 'User must have a first name').trim().isLength({min:1}).escape(),
  body('lastName', 'User must have a last name').trim().isLength({min:1}).escape(),
  body('username', 'Provide a username').trim().isLength({min:1}).escape(),
  body('password', 'Provide a password of 8 letters atleast').trim().isLength({min:8}).escape(),
  (req,res,next)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.render('signup', {errors: errors.array()});
      return;
    } 
    else {
      var user = new User(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          username: req.body.username
        }
      );
      bcrypt.hash(req.body.password, 10, (err, hashedPassword)=>{
        if(err) {return next(err);}
        user.set('password',hashedPassword);
        user.save(err=>{
          if(err) {return next(err);}
          res.redirect('/');
        })
      });
    }
  }
];

exports.user_login_get = (req,res,next)=> {
  res.render('login');
};

exports.user_login_post = passport.authenticate('local', {
  session: true,
  successRedirect: '/message/messages',
  failureRedirect:'/user/login'
})

exports.user_update_get = (req,res,next)=> {
  User.findById(req.params.id)
  .exec(function(err,result){
    if(err) {return next(err);}
    if(result == null){
      res.redirect('back');
    }
    res.render('update', {user: result});
  })
};

exports.user_update_post = (req,res,next)=> {
  var isAdmin = false;
  var isMember = false;
  if(req.body.admin == 'admin'){
    isAdmin = true;
  }
  if(req.body.membership == 'member'){
    isMember = true;
  }
  var user = req.user;
  var newUser = new User ({
    _id: req.params.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    password: user.password,
    membership: user.membership || isMember,
    admin: user.admin || isAdmin
  });
  User.findByIdAndUpdate(req.params.id, newUser, {}, (err)=>
  {
    if(err) {return next(err);}
    res.redirect('/');
  })
};

exports.user_logout = function(req, res, next) {
  req.logout();
  res.redirect('/');
};