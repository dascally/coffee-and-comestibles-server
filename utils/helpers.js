import OrderItem from '../models/orderItem.js';

const createOrderList = (rawOrderList) => {
  const cookedOrderList = Promise.all(
    rawOrderList.map(async (orderItem) => {
      const newOrderItem = new OrderItem(orderItem);
      const savedOrderItem = await newOrderItem.save();
      return savedOrderItem;
    })
  );

  return cookedOrderList;
};

export { createOrderList };
