var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

const User = require('./models/user');

require('dotenv').config();

var indexRouter = require('./routes/index');
var messageRouter = require('./routes/message');
var userRouter = require('./routes/user');

var app = express();

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('err', console.error.bind(console, 'mongodb connection error'));

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { 
        return done(err);
      };
      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // Successful login
          return done(null, user);
        } else {
          // Passwords do not match
          return done(null, false, {msg: 'Incorrect Password'});
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(session({secret: 'secret', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/message', messageRouter);
app.use('/user', userRouter);

app.listen(process.env.PORT, ()=> console.log(`Server up on ${process.env.PORT}`));