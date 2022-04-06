import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  selectedOptions: {
    type: Map,
    // FIXME: may make this a map. e.g. {flavors: {vanilla: 3, chocolate: 1}}
    of: [String],
  },
  useRewards: {
    type: Boolean,
    required: false,
  },
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

export default OrderItem;
