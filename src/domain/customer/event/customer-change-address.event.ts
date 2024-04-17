import EventInterface from "../../@shared/event/event.interface";

interface EventData {
  id: string;
  nome: string;
  endereco: string;
}

export default class CustomerChangeAddressEvent implements EventInterface {
  static event = "CustomerChangeAddressEvent";
  dataTimeOccurred: Date;
  eventData: EventData;

  constructor(eventData: any) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
