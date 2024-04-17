import EventInterface from "../../@shared/event/event.interface";

export default class CustomerCreatedEvent implements EventInterface {
  static event = "CustomerCreatedEvent";
  dataTimeOccurred: Date;
  eventData: any;

  constructor() {
    this.dataTimeOccurred = new Date();
    this.eventData = {};
  }
}
