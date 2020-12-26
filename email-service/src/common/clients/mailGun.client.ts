import mailgun from 'mailgun-js';
import EmailClient from '../interfaces/emailClient.interface';
import { logger } from '../utils/logger';

class MailGunClient implements EmailClient {
  private mailer: mailgun.Mailgun;

  constructor() {
    this.mailer = mailgun({
      apiKey: process.env.MAILGUN_KEY,
      domain: 'mail.algomoon.com',
    });
  }

  public sendWelcomeEmail = async (email: string) => {
    try {
      await this.mailer.messages().send(
        {
          from: 'Algomoon <no-reply@mail.algomoon.com>',
          to: email,
          subject: 'Welcome to Algomoon',
          template: 'welcome',
          text: 'Welcome to the app!',
        },
        (error, body) => {
          if (error) logger.error(error);
        },
      );
    } catch (err) {
      throw err;
    }
  };
}

export default MailGunClient;
