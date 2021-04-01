const mongoose = require('mongoose');
const bcrypt = require('mongoose-bcrypt');
// const feedSchema = require('./Feed').schema

const Schema = mongoose.Schema;

const userSchema = new Schema({ 
  name: {type: String, required: true},
  feeds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Feed'}]
})

userSchema.plugin(bcrypt);

userSchema.options.toJSON = {
  transform: function(document, returnedObject) {
    delete returnedObject.password;
    return returnedObject;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User