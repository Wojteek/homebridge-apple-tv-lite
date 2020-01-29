import { ServiceInterface, ServiceParameters } from './ServiceInterface';

export class AccessoryInformationService implements ServiceInterface {
  private readonly service: HAPNodeJS.Service;

  constructor(root: ServiceParameters) {
    this.service = new root.service.AccessoryInformation('', '');
    this.service
      .setCharacteristic(root.characteristic.Manufacturer, 'Apple')
      .setCharacteristic(root.characteristic.Model, 'Apple TV')
      .setCharacteristic(root.characteristic.SerialNumber, 'V2PUAAKC')
      .setCharacteristic(root.characteristic.FirmwareRevision, '13.3');
  }

  getService(): HAPNodeJS.Service {
    return this.service;
  }
}
