import mongoose from 'mongoose';

const paymentInfoSchema = mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
  },
  securityCode: {
    type: String,
    required: true,
  },
  billingName: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
});

const PaymentInfo = mongoose.model('PaymentInfo', paymentInfoSchema);

export default PaymentInfo;
