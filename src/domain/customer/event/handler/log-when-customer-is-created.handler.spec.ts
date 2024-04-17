import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../customer-created.event";
import SendAnotherConsoleAfterCreateHandler from "./send-console-after-create-2.handler";
import SendConsoleAfterCreateHandler from "./send-console-after-create.handler";

describe("LogWhenCustomerIsCreatedHandler", () => {
  let dispatcher: EventDispatcher;

  beforeEach(() => {
    dispatcher = new EventDispatcher();
  });

  it("should log when a customer is created", () => {
    const handler = new SendConsoleAfterCreateHandler();
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
    const handler1 = new SendConsoleAfterCreateHandler();
    const handler2 = new SendAnotherConsoleAfterCreateHandler();

    dispatcher.register(CustomerCreatedEvent.event, handler1);
    dispatcher.register(CustomerCreatedEvent.event, handler2);

    const spySendEvent = jest.spyOn(handler1, "handle");
    const spySendAnother = jest.spyOn(handler2, "handle");

    const customerCreatedEvent = new CustomerCreatedEvent();

    dispatcher.notify(customerCreatedEvent);

    expect(spySendEvent).toHaveBeenCalledTimes(1);
    expect(spySendAnother).toHaveBeenCalledTimes(1);
  });
});
