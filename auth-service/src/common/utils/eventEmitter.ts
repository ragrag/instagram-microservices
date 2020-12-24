import { EventEmitter } from 'events';

enum Events {
  USER_CREATED = 'user-created',
}
const eventEmitter = new EventEmitter();

export { eventEmitter, Events };
