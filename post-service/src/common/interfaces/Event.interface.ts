export interface Event {
  topic: string;
  cb: (value: any) => Promise<any>;
}
