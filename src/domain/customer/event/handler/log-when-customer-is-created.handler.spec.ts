import LogWhenCustomerIsCreatedHandler from "./log-when-customer-is-created.handler";
import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../customer-created.event";

describe("LogWhenCustomerIsCreatedHandler", () => {
  let handler: LogWhenCustomerIsCreatedHandler;
  let dispatcher: EventDispatcher;

  beforeEach(() => {
    handler = new LogWhenCustomerIsCreatedHandler();
    dispatcher = new EventDispatcher();
  });

  it("should log when a customer is created", () => {
    dispatcher.register(CustomerCreatedEvent.event, handler);

    expect(
      dispatcher.getEventHandlers[CustomerCreatedEvent.event],
    ).toBeDefined();
    expect(
      dispatcher.getEventHandlers[CustomerCreatedEvent.event].length,
    ).toBe(
      1,
    );
    expect(
      dispatcher.getEventHandlers[CustomerCreatedEvent.event][0],
    ).toMatchObject(handler);
  });

  it("should log when a customer is created", () => {
    dispatcher.register(CustomerCreatedEvent.event, handler);
    jest.spyOn(console, "log");

    const customerCreatedEvent1 = new CustomerCreatedEvent("primeiro");
    const customerCreatedEvent2 = new CustomerCreatedEvent("segundo");

    dispatcher.notify(customerCreatedEvent1);
    dispatcher.notify(customerCreatedEvent2);

    expect(console.log).toBeCalledTimes(2);
    expect(console.log).toBeCalledWith(
      "Esse é o primeiro console.log do evento: CustomerCreated",
    );
    expect(console.log).toBeCalledWith(
      "Esse é o primeiro console.log do evento: CustomerCreated",
    );
  });
});
