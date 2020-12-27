import { Event } from '../common/interfaces/Event.interface';

class EventHandler {
  static events: Map<string, (value: any) => Promise<any>> = new Map<string, (value: any) => Promise<any>>();

  public static async handleEvent(topic: string, value: any) {
    try {
      await EventHandler.events.get(topic)(value);
    } catch (err) {
      throw err;
    }
  }

  public static registerEvents(eventHandlers: Event[]) {
    for (const event of eventHandlers) {
      EventHandler.events.set(event.topic, event.cb);
    }
  }
}

export default EventHandler;
