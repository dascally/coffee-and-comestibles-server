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
    src: String,
    alt: String,
  },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
