import { EventEmitter } from 'events';

enum Events {
  USER_REGISTRATION = 'user-registered',
}
const eventEmitter = new EventEmitter();

export { eventEmitter, Events };
