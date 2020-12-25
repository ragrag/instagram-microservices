import { EventEmitter } from 'events';

const Events = {
  USER_CREATED: 'user-created',
};
const eventEmitter = new EventEmitter();

export { eventEmitter, Events };
