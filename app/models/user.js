var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

/*Primary Key in mongoose === index: {unique: true}*/
var userSchema = mongoose.Schema ({
    username: {type: String, required: true, index:{unique: true}},
    password: {type: String, required: true}
});

var User = mongoose.model('User', userSchema);

User.comparePassword = function(attemptedPassword, savedPassword, callback) {
    bcrypt.compare(attemptedPassword, savePassword, function(err, isMatch) {
      callback(isMatch);
    });
  }

userSchema.pre('save', function(next){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
      .then(function(hash) {
        this.password = hash;
        next()
      });
  });

module.exports = User;
// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });
