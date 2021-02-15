var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
  {
    title: {type: String, required: true},
    body: {type: String, required: true},
    timestamp: {type: Date, default: Date.now()},
    creator: {type: Schema.Types.ObjectId, ref: 'User'}
  }
);

MessageSchema
.virtual('url')
.get(function(){
  return '/message/'+this._id;
})

module.exports = mongoose.model('Message', MessageSchema);