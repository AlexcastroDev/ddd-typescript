import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";
import ProductCreatedEvent from "../customer-created.event";

export default class SendEmailWhenProductIsCreatedHandler
  implements EventHandlerInterface<ProductCreatedEvent> {
  handle(event: CustomerCreatedEvent): void {
    console.log(
      `Esse é o ${event.eventData} console.log do evento: CustomerCreated`,
    );
  }
}
