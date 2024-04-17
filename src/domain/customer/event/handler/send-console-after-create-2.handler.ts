import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import ProductCreatedEvent from "../customer-created.event";

export default class SendAnotherConsoleAfterCreateHandler
  implements EventHandlerInterface<ProductCreatedEvent> {
  handle(): void {
    console.log(
      `Esse é o segundo console.log do evento: CustomerCreated`,
    );
  }
}
