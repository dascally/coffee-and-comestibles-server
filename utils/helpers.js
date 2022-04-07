import OrderItem from '../models/orderItem.js';

const createOrderIdList = (rawOrderList) => {
  const cookedOrderList = Promise.all(
    rawOrderList.map(async (orderItem) => {
      const newOrderItem = new OrderItem(orderItem);
      const savedOrderItem = await newOrderItem.save();
      return savedOrderItem._id;
    })
  );

  return cookedOrderList;
};

export { createOrderIdList };
