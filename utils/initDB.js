import http from 'http';
import app from '../app.js';
import mongoose from 'mongoose';
import { PORT } from './config.js';
import MenuItem from '../models/menuItem.js';
import Event from '../models/event.js';

const MENU = [
  {
    sectionName: 'Hot drinks',
    items: [
      {
        name: 'Banana bread latte',
        description:
          'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi esse provident ducimus odit laboriosam quaerat.',
        image: { src: 'latte-1.jpg', alt: 'A latte in a mug' },
        allergens: ['soy'],
        price: 500,
        options: [
          {
            name: 'Milk type',
            suboptions: ['Whole', 'Skim', 'Soy', 'Almond', 'Macadamia'],
          },
          {
            name: 'Chocolate syrup',
            suboptions: ['1 pump', '2 pumps', '3 pumps'],
          },
          {
            name: 'Amaretto syrup',
            suboptions: ['1 pump', '2 pumps', '3 pumps'],
          },
        ],
      },
      {
        name: 'Almond mocha latte',
        description:
          'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis beatae aspernatur repudiandae, sint quam consequatur molestiae.',
        image: { src: 'latte-1.jpg', alt: 'A latte in a mug' },
        allergens: ['soy', 'tree nuts'],
        price: 500,
        options: [
          {
            name: 'Milk type',
            suboptions: ['Whole', 'Skim', 'Soy', 'Almond', 'Macadamia'],
          },
        ],
      },
    ],
  },
  {
    sectionName: 'Cold drinks',
    items: [
      {
        name: 'Iced black tea',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit similique placeat excepturi nam provident obcaecati iste!',
        image: { src: 'latte-1.jpg', alt: 'A latte in a mug' },
        allergens: [],
        price: 300,
        options: [
          {
            name: 'Vanilla syrup',
            suboptions: ['1 pump', '2 pumps', '3 pumps'],
          },
        ],
      },
      {
        name: 'Iced green tea',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias ipsam rerum non facilis sit. Modi, excepturi?',
        image: { src: 'latte-1.jpg', alt: 'A latte in a mug' },
        allergens: [],
        price: 300,
        options: [
          {
            name: 'Raspberry syrup',
            suboptions: ['1 pump', '2 pumps', '3 pumps'],
          },
          {
            name: 'Strawberry syrup',
            suboptions: ['1 pump', '2 pumps', '3 pumps'],
          },
        ],
      },
    ],
  },
  {
    sectionName: 'Baked savory',
    items: [
      {
        name: 'Flatbread with hummus',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet, fugit. Impedit rerum quos nulla est debitis.',
        image: { src: 'latte-1.jpg', alt: 'A latte in a mug' },
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
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut veritatis consequatur nisi perspiciatis libero nostrum sit.',
        image: { src: 'latte-1.jpg', alt: 'A latte in a mug' },
        allergens: ['egg'],
        price: 300,
      },
      {
        name: 'Cranberry chocolate chip cookie',
        description:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores eos maxime natus incidunt inventore quod similique.',
        image: { src: 'latte-1.jpg', alt: 'A latte in a mug' },
        allergens: ['egg'],
        price: 400,
      },
    ],
  },
];

const EVENTS = [
  {
    title: 'Open mic',
    datetime: '2022-05-19T22:00Z',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus recusandae tempora cum sequi, reprehenderit iste impedit facere dignissimos nihil quas quam architecto incidunt suscipit sint numquam earum non, deleniti similique?',
    image: { src: 'event.jpg', alt: 'A nonexistant placeholder image' },
  },
  {
    title: 'Trivia night',
    datetime: '2022-05-20T23:00Z',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa, similique cum voluptatem repudiandae accusamus dolorum veritatis! Cumque vero eum in, officia illo repellat asperiores laboriosam, quo odio voluptas dolorem? Aliquam!',
    image: { src: 'event.jpg', alt: 'A nonexistant placeholder image' },
  },
  {
    title: 'Open mic',
    datetime: '2022-05-26T22:00Z',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, repudiandae porro itaque consequatur odio vitae sunt molestias eaque illo exercitationem, tenetur corporis recusandae deserunt sit explicabo dolore magni veniam veritatis!',
    image: { src: 'event.jpg', alt: 'A nonexistant placeholder image' },
  },
];

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});

await MenuItem.deleteMany({});
console.log('Existing menu data cleared.');

await Event.deleteMany({});
console.log('Existing event data cleared.');

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
    }).concat(
      EVENTS.map(async (event) => {
        const { title, datetime, description, image } = event;
        const newEvent = new Event({ title, datetime, description, image });
        const savedEvent = await newEvent.save();

        return savedEvent;
      })
    )
  );
})();

console.log('result', result);

mongoose.connection.close();
