import amqp from 'amqplib';
import { RabbitMQMessage } from '../common/interfaces/rabbitmqMessage.interface';
import { logger } from '../common/utils/logger';

class RabbitMQ {
  private static instance: RabbitMQ;
  private channel: amqp.Channel;
  private emailQueue = 'email';

  private constructor() {
    this.initializeQueue();
  }

  static getInstance() {
    if (!RabbitMQ.instance) {
      RabbitMQ.instance = new RabbitMQ();
    }
    return RabbitMQ.instance;
  }

  public async initializeQueue() {
    try {
      const connection = await amqp.connect('amqp://localhost:5672');
      logger.info('Connected to RabbitMQ Server');
      this.channel = await connection.createChannel();
      await this.channel.assertQueue('email', { durable: true });
    } catch (err) {
      logger.error(err);
    }
  }

  public sendToEmailChannel(eventDTO: RabbitMQMessage) {
    this.channel.sendToQueue(this.emailQueue, Buffer.from(JSON.stringify(eventDTO)));
  }
}

export default RabbitMQ;
