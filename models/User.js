const debug = require('debug')('node-jwt:models:User');
const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { type: String, default: 'User', trim: true },
  email: { type: String, required: true },
  hash: { type: String, required: true },
  salt: String,
}, { timestamps: true });

userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('hash')) {
    return next();
  }

  user.salt = crypto.randomBytes(16);
  user.hash = crypto.pbkdf2Sync(
    user.hash,
    user.salt,
    100000,
    64,
    'sha512',
  ).toString('hex');

  return next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;
  const candidatePasswordHash = crypto.pbkdf2Sync(
    candidatePassword,
    user.salt,
    100000,
    64,
    'sha512',
  ).toString('hex');

  return candidatePasswordHash === user.hash;
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).then((result) => {
    debug(result);
    return result;
  }).catch((err) => {
    debug(err);
    throw err;
  });
};

const User = mongoose.model('user', userSchema);
module.exports = User;
