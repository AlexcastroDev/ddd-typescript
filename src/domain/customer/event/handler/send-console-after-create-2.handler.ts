import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";
import ProductCreatedEvent from "../customer-created.event";

export default class SendAnotherConsoleAfterCreateHandler
  implements EventHandlerInterface<ProductCreatedEvent> {
  handle(event: CustomerCreatedEvent): void {
    console.log(
      "Esse é o segundo console.log do evento: CustomerCreated",
    );
  }
}
