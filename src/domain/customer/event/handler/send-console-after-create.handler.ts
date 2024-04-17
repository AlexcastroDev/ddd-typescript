import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import ProductCreatedEvent from "../customer-created.event";

export default class SendConsoleAfterCreateHandler
  implements EventHandlerInterface<ProductCreatedEvent> {
  handle(): void {
    console.log(
      `Esse é o primeiro console.log do evento: CustomerCreated`,
    );
  }
}
