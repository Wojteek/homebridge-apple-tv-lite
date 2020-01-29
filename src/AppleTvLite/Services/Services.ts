import { ServiceConstructor, ServiceParameters } from './ServiceInterface';

export class Services {
  constructor(
    private readonly collection: ServiceConstructor[] = [],
    private readonly params: ServiceParameters,
  ) {}

  getServices(): HAPNodeJS.Service[] {
    return this.collection.map((service: ServiceConstructor) => new service(this.params).getService());
  }
}
