const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "SUPER_ADMIN"
  },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },
}, { timestamps: true });

AdminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12); // High-security salt rounds
  this.password = await bcrypt.hash(this.password, salt);

});

module.exports = mongoose.model('Admin', AdminSchema);