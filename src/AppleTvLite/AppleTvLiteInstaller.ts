import { AppleTvLite } from './AppleTvLite';

export class AppleTvLiteInstaller {
  static pluginName = 'homebridge-apple-tv-lite';

  static platformName = 'AppleTvLite';

  static register(homebridge: any): void {
    const {
      Service,
      Characteristic,
    } = homebridge.hap;

    homebridge.registerAccessory(
      AppleTvLiteInstaller.pluginName,
      AppleTvLiteInstaller.platformName,
      AppleTvLite.bind(null, Service, Characteristic),
    );
  }
}
