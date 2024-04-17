import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangeAddressEvent from "../customer-change-address.event";

export default class LogWhenCustomerChangeAddressHandler
  implements EventHandlerInterface<CustomerChangeAddressEvent> {
  handle(event: CustomerChangeAddressEvent): void {
    const { id, nome, endereco } = event.eventData;

    console.log(
      `Endereço do cliente: ${id}, ${nome} alterado para: ${endereco}`,
    );
  }
}
