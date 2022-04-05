import http from 'http';
import app from '../app.js';
import mongoose from 'mongoose';
import { PORT } from './config.js';
import MenuItem from '../models/menuItem.js';

const MENU = [
  {
    sectionName: 'Hot drinks',
    items: [
      {
        name: 'Banana bread latte',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae quo nemo natus, dolorum accusantium maiores commodi vel voluptatum aperiam dicta, consequuntur veniam enim adipisci ut alias asperiores pariatur, necessitatibus blanditiis.',
        image: { src: '../assets/latte-1.jpg', alt: 'A latte in a mug' },
        allergens: ['soy'],
        price: 500,
        options: {
          'Milk type': [
            'Whole milk',
            'Skim milk',
            'Soy milk',
            'Almond milk',
            'Macadamia milk',
          ],
        },
      },
      {
        name: 'Almond mocha latte',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo maxime porro, a vel, ducimus voluptatem accusantium eveniet impedit deleniti rerum nobis autem error, ut amet. Corporis esse vitae aspernatur placeat.',
        image: { src: '../assets/latte-1.jpg', alt: 'A latte in a mug' },
        allergens: ['soy', 'tree nuts'],
        price: 500,
        options: {
          'Milk type': [
            'Whole milk',
            'Skim milk',
            'Soy milk',
            'Almond milk',
            'Macadamia milk',
          ],
        },
      },
    ],
  },
  {
    sectionName: 'Cold drinks',
    items: [
      {
        name: 'Iced black tea',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae quo nemo natus, dolorum accusantium maiores commodi vel voluptatum aperiam dicta, consequuntur veniam enim adipisci ut alias asperiores pariatur, necessitatibus blanditiis.',
        image: { src: '../assets/latte-1.jpg', alt: 'A latte in a mug' },
        allergens: [],
        price: 300,
      },
      {
        name: 'Iced green tea',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae quo nemo natus, dolorum accusantium maiores commodi vel voluptatum aperiam dicta, consequuntur veniam enim adipisci ut alias asperiores pariatur, necessitatibus blanditiis.',
        image: { src: '../assets/latte-1.jpg', alt: 'A latte in a mug' },
        allergens: [],
        price: 300,
      },
    ],
  },
  {
    sectionName: 'Baked savory',
    items: [
      {
        name: 'Flatbread with hummus',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae quo nemo natus, dolorum accusantium maiores commodi vel voluptatum aperiam dicta, consequuntur veniam enim adipisci ut alias asperiores pariatur, necessitatibus blanditiis.',
        image: { src: '../assets/latte-1.jpg', alt: 'A latte in a mug' },
        allergens: ['sesame'],
        price: 600,
      },
    ],
  },
  {
    sectionName: 'Baked sweets',
    items: [
      {
        name: 'Brownie',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae quo nemo natus, dolorum accusantium maiores commodi vel voluptatum aperiam dicta, consequuntur veniam enim adipisci ut alias asperiores pariatur, necessitatibus blanditiis.',
        image: { src: '../assets/latte-1.jpg', alt: 'A latte in a mug' },
        allergens: ['egg'],
        price: 300,
      },
      {
        name: 'Cranberry chocolate chip cookie',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae quo nemo natus, dolorum accusantium maiores commodi vel voluptatum aperiam dicta, consequuntur veniam enim adipisci ut alias asperiores pariatur, necessitatibus blanditiis.',
        image: { src: '../assets/latte-1.jpg', alt: 'A latte in a mug' },
        allergens: ['egg'],
        price: 400,
      },
    ],
  },
];

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});

const result = await (async () => {
  return await Promise.all(
    MENU.map(async (section) => {
      const savedMenuSection = await Promise.all(
        section.items.map(async (menuItem) => {
          const { name, description, image, allergens, price, options } =
            menuItem;

          const newMenuItem = new MenuItem({
            name,
            menuSection: section.sectionName,
            description,
            image,
            allergens,
            price,
            options,
          });
          const savedMenuItem = await newMenuItem.save();

          return savedMenuItem;
        })
      );

      return savedMenuSection;
    })
  );
})();

console.log('result', result);

mongoose.connection.close();
