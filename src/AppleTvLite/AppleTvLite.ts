import { LogFunction, Configuration } from '@/types/index';
import { AppleTv } from './AppleTv';
import { Services } from './Services/Services';
import ServiceFactory from './Services';

export class AppleTvLite {
  private readonly services: Services;

  constructor(
    private readonly service: HAPNodeJS.Service,
    private readonly characteristic: HAPNodeJS.Characteristic,
    private readonly log: LogFunction,
    private readonly configuration: Configuration,
  ) {
    const config = {
      ...configuration,
      debug: configuration.debug || false,
    };

    if (typeof config.credentials === 'undefined') {
      throw new TypeError('The credentials of Apple Tv are necessary. Make sure that you\'ve added it to the object config.');
    }

    const debug = (...content: (string | boolean)[]): void => {
      if (!config.debug) {
        return;
      }

      log(...content);
    };

    log('Initialization in progress...');

    debug(JSON.stringify(config));

    const appleTv = new AppleTv(config.credentials, {
      updateStateFrequency: configuration.updateStateFrequency || 50000,
    });

    this.services = ServiceFactory.bind(null, {
      service,
      characteristic,
      log,
      config,
      debug,
      appleTv,
    })();
  }

  // It's calling by Homebridge by default
  getServices(): HAPNodeJS.Service[] {
    return this.services.getServices();
  }
}
