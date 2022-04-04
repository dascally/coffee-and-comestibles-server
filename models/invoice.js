import mongoose from 'mongoose';

const invoiceSchema = mongoose.Schema({
  status: {
    type: String,
    default: 'received',
  },
  contactPhone: {
    type: String,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  ccInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentInfo',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  orderList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderItem',
    },
  ],
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
