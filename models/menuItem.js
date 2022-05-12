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
  description: String,
  image: {
    src: String,
    alt: String,
  },
  allergens: [String],
  price: {
    type: Number,
    required: true,
  },
  options: [
    {
      name: String,
      suboptions: [String],
    },
  ],
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
