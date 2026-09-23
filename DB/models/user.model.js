
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false }, // ✅ اضافه

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['ADMIN','CUSTOMER'],
      default: 'CUSTOMER'
    },
    refreshTokens: [{ token: String }] ,
    accessTokens: [{ token: String, createdAt: { type: Date, default: Date.now } }]

  },
  { timestamps: true }
);

// hash password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return; // مش محتاج next
  this.password = await bcrypt.hash(this.password, 10);
});


// compare password
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};


const User = mongoose.model('user', userSchema);
export default User; 