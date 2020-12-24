import amqp from 'amqplib';
import { RabbitMQMessage } from '../common/interfaces/rabbitmqMessage.interface';
import { logger } from '../common/utils/logger';

class RabbitMQService {
  private static instance: RabbitMQService;
  private channel: amqp.Channel;
  private emailQueue = 'email';

  private constructor() {
    this.initializeQueue();
  }

  static getInstance() {
    if (!RabbitMQService.instance) {
      RabbitMQService.instance = new RabbitMQService();
    }
    return RabbitMQService.instance;
  }
  public async initializeQueue() {
    try {
      const connection = await amqp.connect('amqp://localhost:5672');
      logger.info('Connected to RabbitMQ Server');
      this.channel = await connection.createChannel();
      await this.channel.assertQueue('email', { durable: true });
      this.channel.consume(
        'email',
        function (msg) {
          console.log('new Message');
          console.log(JSON.parse(msg.content.toString()));
        },
        {
          // automatic acknowledgment mode,
          // see https://www.rabbitmq.com/confirms.html for details
          noAck: false,
        },
      );
    } catch (err) {
      logger.error(err);
    }
  }

  public sendToEmailChannel(eventDTO: RabbitMQMessage) {
    this.channel.sendToQueue(this.emailQueue, Buffer.from(JSON.stringify(eventDTO)));
  }
}

export default RabbitMQService;
