import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    // FIXME: Add path to default image
  },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
