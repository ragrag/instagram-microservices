import { Consumer, Kafka, Producer } from 'kafkajs';
import { KafkaEvent } from '../common/interfaces/kafkaEvent';
import { logger } from '../common/utils/logger';
import EventHandler from './eventHandler.service';

class MessageBroker {
  private static instance: MessageBroker;
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  private constructor() {
    this.initializeConnection();
  }

  static getInstance() {
    if (!MessageBroker.instance) {
      MessageBroker.instance = new MessageBroker();
    }
    return MessageBroker.instance;
  }

  public async initializeConnection() {
    try {
      this.kafka = new Kafka({
        clientId: 'instagram',
        brokers: ['localhost:9092'],
      });
      logger.info('kafka connected');
      await this.initializeProducer();
      await this.initializeConsumer();
    } catch (err) {
      logger.error(err);
    }
  }
  public async initializeProducer() {
    this.producer = this.kafka.producer({ allowAutoTopicCreation: true });
    await this.producer.connect();
  }

  public async initializeConsumer() {
    this.consumer = this.kafka.consumer({ groupId: 'post-query-service', allowAutoTopicCreation: true });
    await this.consumer.connect();

    for (const [eventTopic] of EventHandler.events) {
      await this.consumer.subscribe({ topic: eventTopic, fromBeginning: true });
    }

    await this.consumer.run({
      eachBatchAutoResolve: false,
      eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale, uncommittedOffsets }) => {
        for (const message of batch.messages) {
          if (isStale) {
          }
          try {
            console.log({
              topic: batch.topic,
              value: { ...JSON.parse(message.value.toString()) },
            });
            await EventHandler.handleEvent(batch.topic, { ...JSON.parse(message.value.toString()) });
            resolveOffset(message.offset);
          } catch (err) {
            logger.error(`Failed to handle event\n ${err}\n topic:${batch.topic} \n value:${JSON.parse(message.value.toString())}`);
          }
        }
      },
    });
  }
  public async sendEvent(eventDTO: KafkaEvent) {
    try {
      // this.emailQueue, Buffer.from(JSON.stringify(eventDTO))
      await this.producer.send({ topic: eventDTO.topic, messages: [{ value: eventDTO.value }] });
    } catch (err) {
      logger.error(err);
    }
  }
}

export default MessageBroker;
