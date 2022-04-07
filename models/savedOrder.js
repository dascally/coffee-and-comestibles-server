import mongoose from 'mongoose';

const savedOrderSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  orderList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderItem',
    },
  ],
});

const SavedOrder = mongoose.model('SavedOrder', savedOrderSchema);

export default SavedOrder;
