import { Admin, Consumer, Kafka, Producer } from 'kafkajs';
import { KafkaEvent } from '../common/interfaces/kafkaEvent';
import { logger } from '../common/utils/logger';

class MessageBroker {
  private static instance: MessageBroker;
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private admin: Admin;

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
      // await this.initializeAdmin();
    } catch (err) {
      logger.error(err);
    }
  }

  public async initializeAdmin() {
    this.admin = this.kafka.admin();
    await this.admin.connect();
    await this.admin.createTopics({
      topics: [
        {
          topic: 'user-created',
          numPartitions: 1,
        },
      ],
    });
    await this.admin.disconnect();
  }

  public async initializeProducer() {
    this.producer = this.kafka.producer({ allowAutoTopicCreation: true });
    await this.producer.connect();
  }

  public async initializeConsumer() {
    this.consumer = this.kafka.consumer({ allowAutoTopicCreation: true, groupId: 'post-service' });
    await this.consumer.connect();
  }
  public async sendEvent(eventDTO: KafkaEvent) {
    try {
      // this.emailQueue, Buffer.from(JSON.stringify(eventDTO))
      logger.info(`sending \ntopic: ${eventDTO.topic} \nvalue:${JSON.parse(eventDTO.value)}`);
      await this.producer.send({ topic: eventDTO.topic, messages: [{ value: eventDTO.value }] });
    } catch (err) {
      logger.error(err);
    }
  }
}

export default MessageBroker;
