var Message = require('../models/message');
var User = require('../models/user');

const {body,validationResult} = require('express-validator');
var async = require('async');

exports.index = (req,res,next)=> {
  Message.find({})
  .sort({'timestamp': 'ascending'})
  .exec((err,results)=>{
    if(err) {return next(err);}
    res.render('index', {messages: results})
  });
};

// All message list-> show to everyone
exports.message_list = (req,res,next)=> {
  Message.find({})
  .sort({'timestamp': 'ascending'})
  .populate('creator')
  .exec((err,results)=>{
    if(err) {return next(err);}
    res.render('message_list', {messages: results , user: req.user})
  });
};

// exports.message_detail = (req,res,next)=> {
//   res.send('Individual msg');
// };

// GET message create form
exports.message_create_get = (req,res,next)=> {
  res.render('message_create');
};

// POST message create form
exports.message_create_post = [
  body('title', 'Title is required').trim().isLength({min:1}).escape(),
  body('body', 'Body is required').trim().isLength({min:1}).escape(),
  (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.render('message_create', {errors: errors.array()});
      return;
    } 
    else {
      var message = new Message(
        {
          title: req.body.title,
          body: req.body.body,
          timestamp: Date.now(),
          creator: req.user
        }
      );
      message.save(function(err){
        if(err) {return next(err);}
        res.redirect('back');
      })
    }
  }
]

// exports.message_update_get = (req,res,next)=> {
//   res.send('Single msg update form');
// };

// exports.message_update_post = (req,res,next)=> {
//   res.send('single msg update post');
// };

exports.message_delete_get = (req,res,next)=> {
  if(req.user.admin != true){
    res.redirect('back');
  }
  else{
    Message.findById(req.params.id)
    .exec(function(err,result){
      if(err) {return next(err);}
      if(result == null){
        res.redirect('message/messages');
      }
      res.render('message_delete', {message: result});
    });
  }
}

exports.message_delete_post = (req,res,next)=> {
  Message.findByIdAndRemove(req.params.id, (err)=>{
      if(err) {return (err);}
      res.redirect('/message/messages');
    });
};
