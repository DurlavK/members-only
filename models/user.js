var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    membership: {type: Boolean, default: false},
    admin: {type: Boolean, default: false}
  }
);

UserSchema
.virtual('fullname')
.get(function(){
  return this.firstName + ' ' + this.lastName;
});

UserSchema
.virtual('url')
.get(function(){
  return '/user/'+this._id;
})

module.exports = mongoose.model('User', UserSchema);