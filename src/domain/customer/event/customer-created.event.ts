import EventInterface from "../../@shared/event/event.interface";

export default class CustomerCreatedEvent implements EventInterface {
  static event = "CustomerCreatedEvent";
  dataTimeOccurred: Date;
  eventData: string;

  constructor(eventData: string) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
