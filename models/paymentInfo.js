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

paymentInfoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.cardNumberFinalDigits = returnedObject.cardNumber.slice(-4);
    delete returnedObject.cardNumber;
    delete returnedObject.securityCode;
  },
});

const PaymentInfo = mongoose.model('PaymentInfo', paymentInfoSchema);

export default PaymentInfo;
