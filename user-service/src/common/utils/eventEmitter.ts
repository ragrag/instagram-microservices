import { EventEmitter } from 'events';

//Events, can be local events or Kafka Producer topics

const eventEmitter = new EventEmitter();

export { eventEmitter };
