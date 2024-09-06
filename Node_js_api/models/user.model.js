const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthdate: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const userData = mongoose.model('user', userSchema);
module.exports = userData;

