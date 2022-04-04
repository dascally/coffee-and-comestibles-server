import 'dotenv/config';

const PORT = process.env.port ?? 3002;

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

export { PORT, MENU };
