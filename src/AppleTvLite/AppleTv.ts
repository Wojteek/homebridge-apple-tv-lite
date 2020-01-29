import { AppleTV, Message, parseCredentials, scan } from 'appletv-node';
import { EventEmitter } from 'events';

export const EVENT_POWER_CHANGED = 'powerChanged';
export const EVENT_MESSAGE = 'message';
export const EVENT_ERROR = 'error';

export class AppleTv {
  readonly connection: Promise<AppleTV>;

  readonly event: EventEmitter;

  constructor(credentials: string) {
    this.connection = this.getConnection(credentials);
    this.event = new EventEmitter();
  }

  private async getConnection(credentials: string): Promise<AppleTV> {
    const parse = parseCredentials(credentials);

    try {
      const [
        device,
      ] = await scan(parse.uniqueIdentifier);

      const atv = await device.openConnection(parse);

      this.onError(atv);
      this.onDeviceUpdate(atv);

      return atv;
    } catch (error) {
      throw error;
    }
  }

  async deviceConnectedCount(device: AppleTV): Promise<number> {
    const { payload }: Message = await device.sendIntroduction();

    return payload.logicalDeviceCount;
  }

  private onError(device: AppleTV): void {
    device.on(EVENT_ERROR, (error: Error) => {
      console.error(error.message);
      console.error(error.stack);
    });
  }

  private onDeviceUpdate(device: AppleTV): void {
    device.on(EVENT_MESSAGE, ({ type, payload }: Message): void => {
      if (type !== Message.Type.DeviceInfoUpdate) {
        return;
      }

      this.event.emit(EVENT_POWER_CHANGED, !!payload.logicalDeviceCount);
    });
  }
}
