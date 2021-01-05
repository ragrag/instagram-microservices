import mailgun from 'mailgun-js';
import EmailClient from '../interfaces/emailClient.interface';
import { logger } from '../utils/logger';

class MailGunClient implements EmailClient {
  private mailer: mailgun.Mailgun;

  constructor() {
    this.mailer = mailgun({
      apiKey: process.env.MAILGUN_KEY,
      domain: 'mail.yourdomain.com',
    });
  }

  public sendWelcomeEmail = (receiverEmail: string) => {
    this.mailer.messages().send(
      {
        from: 'Algomoon <no-reply@mail.algomoon.com>',
        to: receiverEmail,
        subject: 'Welcome to Algomoon',
        template: 'welcome',
        text: 'Welcome to the app!',
      },
      (error, body) => {
        if (error) logger.error(error);
      },
    );
  };
}

export default MailGunClient;
