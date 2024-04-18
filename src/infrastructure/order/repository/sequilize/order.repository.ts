import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async update(entity: Order): Promise<void> {
    let transaction;
    try {
      transaction = await OrderModel.sequelize.transaction();

      await OrderModel.update(
        {
          customer_id: entity.customerId,
          total: entity.total(),
        },
        {
          where: { id: entity.id },
          transaction,
        },
      );

      // This part is because of issue about updating associations
      // https://github.com/sequelize/sequelize-typescript/issues/309

      // Given the context: https://forum.code.education/forum/topico/desafio-implementacao-do-orderrespository-ddd-modelagem-tatica-e-patterns-1237/
      // I really dont like the approach of delete all items and insert again with bulkCreate
      // If we are not using DELETE method, maybe a solution can be near to this: https://api.rubyonrails.org/v7.1.3/classes/ActiveRecord/NestedAttributes/ClassMethods.html
      // My suggestion here is run a loop that create or update, and consider the _destroy flag to delete the item, i will not implement this here.
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
        transaction,
      });
      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      }));
      await OrderItemModel.bulkCreate(items, { transaction });
      await OrderModel.update(
        { total: entity.total() },
        { where: { id: entity.id }, transaction },
      );

      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw error;
    }
  }

  async find(id: string): Promise<Order> {
    const order = await OrderModel.findByPk(id, {
      include: [{ model: OrderItemModel }],
    });

    return new Order(
      order.id,
      order.customer_id,
      order.items.map((item) =>
        new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity,
        )
      ),
    );
  }
  async findAll(): Promise<Order[]> {
    const order = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    return order.map((order) => {
      return new Order(
        order.id,
        order.customer_id,
        order.items.map((item) =>
          new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity,
          )
        ),
      );
    });
  }

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      },
    );
  }
}
