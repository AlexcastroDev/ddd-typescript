import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;
  let customerRepository: CustomerRepository;
  let productRepository: ProductRepository;
  let orderRepository: OrderRepository;
  let customer: Customer;
  let product: Product;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);

    await sequelize.sync();

    customerRepository = new CustomerRepository();
    productRepository = new ProductRepository();
    orderRepository = new OrderRepository();

    // Repeatable setup
    customer = new Customer("123", "Customer 1");
    product = new Product("123", "Product 1", 10);
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    await productRepository.create(product);
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const orderItem = new OrderItem(
      null,
      product.name,
      product.price,
      product.id,
      2,
    );

    const order = new Order("123", "123", [orderItem]);

    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: 1,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find an order by ID", async () => {
    const orderItem = new OrderItem(
      1,
      product.name,
      product.price,
      product.id,
      2,
    );

    const order = new Order("123", "123", [orderItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    const foundOrder = await orderRepository.find(order.id);

    expect(foundOrder).toStrictEqual(
      new Order(
        orderModel.id,
        orderModel.customer_id,
        orderModel.items.map((item) =>
          new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity,
          )
        ),
      ),
    );
  });

  it("should find all orders", async () => {
    const orderItem = new OrderItem(
      null,
      product.name,
      product.price,
      product.id,
      2,
    );

    const order1 = new Order("123", "123", [orderItem]);
    const order2 = new Order("456", "123", [orderItem]);

    await Promise.all([
      orderRepository.create(order1),
      orderRepository.create(order2),
    ]);

    const orders = await orderRepository.findAll();
    expect(orders[0]).toEqual(
      new Order(
        order1.id,
        order1.customerId,
        order1.items.map((item) =>
          new OrderItem(
            1,
            item.name,
            item.price,
            item.productId,
            item.quantity,
          )
        ),
      ),
    );
    expect(orders[1]).toEqual(
      new Order(
        order2.id,
        order2.customerId,
        order2.items.map((item) =>
          new OrderItem(
            2,
            item.name,
            item.price,
            item.productId,
            item.quantity,
          )
        ),
      ),
    );
  });

  it("should update an order", async () => {
    const orderItem = new OrderItem(
      null,
      product.name,
      product.price,
      product.id,
      2,
    );

    const order = new Order("123", "123", [orderItem]);

    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    orderModel.items[0].quantity = 3;

    await orderRepository.update(
      new Order(
        orderModel.id,
        orderModel.customer_id,
        orderModel.items.map((item) =>
          new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity,
          )
        ),
      ),
    );

    const updatedOrder = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(updatedOrder.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: 30,
      items: [
        {
          id: 1,
          name: orderItem.name,
          price: orderItem.price,
          quantity: 3,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order with one more item", async () => {
    const orderItem = new OrderItem(
      null,
      product.name,
      product.price,
      product.id,
      2,
    );

    const order = new Order("123", "123", [orderItem]);

    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    orderModel.items[0].quantity = 3;

    const orderItem2 = new OrderItem(
      null,
      product.name,
      product.price,
      product.id,
      2,
    );

    await orderRepository.update(
      new Order(
        orderModel.id,
        orderModel.customer_id,
        orderModel.items.map((item) =>
          new OrderItem(
            item.id,
            item.name,
            item.price,
            item.product_id,
            item.quantity,
          )
        ).concat(orderItem2),
      ),
    );

    const updatedOrder = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(updatedOrder.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: 50,
      items: [
        {
          id: 1,
          name: orderItem.name,
          price: orderItem.price,
          quantity: 3,
          order_id: "123",
          product_id: "123",
        },
        {
          id: 2,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update and remove item", async () => {
    const orderItems = new Array(6).fill(
      new OrderItem(null, product.name, product.price, product.id, 2),
    );

    const order = new Order("123", "123", orderItems);

    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    await orderRepository.update(
      new Order(
        orderModel.id,
        orderModel.customer_id,
        orderModel.items
          .map((item) =>
            new OrderItem(
              item.id,
              item.name,
              item.price,
              item.product_id,
              item.quantity,
            )
          )
          .filter((item) => item.id !== 3),
      ),
    );

    const updatedOrder = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(updatedOrder.items.length).toBe(5);
  });
});
