import { AppleTV } from 'node-appletv-x';
import { ServiceInterface, ServiceParameters } from './ServiceInterface';
import { EVENT_POWER_CHANGED } from '../AppleTv';

export class AppleTVControlSwitchService implements ServiceInterface {
  private readonly service: HAPNodeJS.Service;

  private _isTurnedOn: boolean = false;

  constructor(private root: ServiceParameters) {
    this.service = new root.service.Switch(root.config.name, '');
    this.service.getCharacteristic(root.characteristic.On)
      .on('get', this.getState.bind(this))
      .on('set', this.setState.bind(this));

    this.onDeviceState();
  }

  getService(): HAPNodeJS.Service {
    return this.service;
  }

  get isTurnedOn(): boolean {
    return this._isTurnedOn;
  }

  set isTurnedOn(value: boolean) {
    if (this.isTurnedOn === value) {
      return;
    }

    this.root.log(`Updating the state: ${value}`);

    this._isTurnedOn = value;
    this.service
      .getCharacteristic(this.root.characteristic.On)
      .updateValue(value);
  }

  private async setState(
    value: boolean,
    callback: (error: Error | null, value?: boolean) => void,
  ): Promise<void> {
    const device = await this.root.appleTv.connection;

    this.root.log(`Trigger setState for the AppleTV: ${value}`);

    try {
      if (value) {
        await device.sendKeyCommand(AppleTV.Key.Tv);
      } else {
        await device.sendKeyCommand(AppleTV.Key.LongTv);
        await device.sendKeyCommand(AppleTV.Key.Select);
      }

      this.isTurnedOn = value;

      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  private getState(
    callback: (error: Error | null, value?: boolean) => void,
  ): void {
    callback(null, this.isTurnedOn);
  }

  private onDeviceState(): void {
    const { event } = this.root.appleTv;

    event.addListener(EVENT_POWER_CHANGED, (state: boolean): void => {
      this.isTurnedOn = state;
    });
  }
}
