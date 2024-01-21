import { model, models, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const adminUserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

adminUserSchema.pre('save', async function (next) {
  // Hash password before saving user
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

adminUserSchema.methods.matchPassword = async function (password) {
  // Compare provided password with hashed password
  return await bcrypt.compare(password, this.password);
};

export default models?.AdminUser || model('AdminUser', adminUserSchema);
