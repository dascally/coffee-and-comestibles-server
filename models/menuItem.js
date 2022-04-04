import mongoose from 'mongoose';

const menuItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  menuSection: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    // FIXME: Add a default path
  },
  price: {
    type: Number,
    required: true,
  },
  options: {
    type: Map,
    of: [String],
  },
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
