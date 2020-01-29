export type LogFunction = (..._: (string | boolean)[]) => void;

export interface Configuration {
  accessory: string;
  name: string;
  credentials: string;
  updateStateFrequency: number;
  debug: boolean;
}
