import { Configuration, LogFunction } from '@/types/index';
import { AppleTv } from '../AppleTv';

export interface ServiceParameters {
  appleTv: AppleTv;
  service: HAPNodeJS.Service;
  characteristic: HAPNodeJS.Characteristic;
  log: LogFunction;
  config: Configuration;
  debug: LogFunction;
}

export interface ServiceInterface {
  getService(): HAPNodeJS.Service;
}

export interface ServiceConstructor {
  new (params: ServiceParameters): ServiceInterface;
}
