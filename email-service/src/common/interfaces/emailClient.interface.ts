export default interface EmailClient {
  sendWelcomeEmail: (receiverEmail: string) => Promise<any>;
}
