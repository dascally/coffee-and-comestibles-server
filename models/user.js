import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  rewards: {
    type: Number,
    default: 0,
  },
  savedPayments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  ],
  savedOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);

export default User;
