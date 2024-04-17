import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerChangeAddressEvent from "../customer-change-address.event";
import LogWhenCustomerChangeAddressHandler from "./log-when-customer-change-address.handler";

describe("LogWhenCustomerChangeAddressHandler", () => {
  let handler: LogWhenCustomerChangeAddressHandler;
  let dispatcher: EventDispatcher;

  beforeEach(() => {
    handler = new LogWhenCustomerChangeAddressHandler();
    dispatcher = new EventDispatcher();
  });

  it("should log when a customer address is changed", () => {
    dispatcher.register(CustomerChangeAddressEvent.event, handler);

    expect(
      dispatcher.getEventHandlers[CustomerChangeAddressEvent.event],
    ).toBeDefined();
    expect(
      dispatcher.getEventHandlers[CustomerChangeAddressEvent.event]
        .length,
    ).toBe(
      1,
    );
    expect(
      dispatcher.getEventHandlers[CustomerChangeAddressEvent.event][0],
    ).toMatchObject(handler);
  });

  it("should log when a customer is created", () => {
    dispatcher.register(CustomerChangeAddressEvent.event, handler);
    jest.spyOn(console, "log");

    const customerChangeEvent = new CustomerChangeAddressEvent({
      id: 1,
      nome: "Lekito on rails",
      endereco: "rua 1",
    });

    dispatcher.notify(customerChangeEvent);

    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith(
      "Endereço do cliente: 1, Lekito on rails alterado para: rua 1",
    );
  });
});
