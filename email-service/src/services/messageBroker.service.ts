import { Consumer, Kafka, logLevel, Producer } from 'kafkajs';
import { KafkaEvent } from '../common/interfaces/kafkaEvent';
import { logger } from '../common/utils/logger';

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

      //   await this.channel.assertQueue(this.emailQueue, { durable: true });
    } catch (err) {
      logger.error(err);
    }
  }
  public async initializeProducer() {
    this.producer = this.kafka.producer({ allowAutoTopicCreation: true });
    await this.producer.connect();
  }
  public async processMsg(msg: string) {
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  public async initializeConsumer() {
    this.consumer = this.kafka.consumer({ groupId: 'email-service', allowAutoTopicCreation: true });
    await this.consumer.connect();

    await this.consumer.subscribe({ topic: 'user-created', fromBeginning: true });

    await this.consumer.run({
      eachBatchAutoResolve: false,
      eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale }) => {
        for (const message of batch.messages) {
          console.log('new msg');
          console.log({
            topic: batch.topic,
            value: message.value.toString(),
          });
          await this.processMsg(message.value.toString());
          resolveOffset(message.offset);
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
