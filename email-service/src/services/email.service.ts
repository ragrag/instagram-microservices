import MailGunClient from '../common/clients/mailGun.client';
import EmailClient from '../common/interfaces/emailClient.interface';
import { Event } from '../common/interfaces/Event.interface';
import { logger } from '../common/utils/logger';
import EventHandler from './eventHandler.service';

class EmailService {
  private eventHandlers: Event[] = [
    {
      topic: 'UserCreated',
      cb: async ({ email }) => {
        await this.sendWelcomeEmail(email);
      },
    },
  ];

  constructor(private emailClient: EmailClient = new MailGunClient()) {
    this.registerEvents();
  }

  public registerEvents() {
    EventHandler.registerEvents(this.eventHandlers);
  }

  public async sendWelcomeEmail(email: string) {
    try {
      logger.info(`sending welcome email to ${email}`);
      await this.emailClient.sendWelcomeEmail(email);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }
}

export default EmailService;
