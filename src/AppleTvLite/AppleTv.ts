import { AppleTV, Message, parseCredentials, scan, NowPlayingInfo } from 'node-appletv-x';
import { EventEmitter } from 'events';

type AppleTV = any;
type Message = any;
type NowPlayingInfo = any;

export const EVENT_POWER_CHANGED = 'powerChanged';
export const EVENT_MESSAGE = 'message';
export const EVENT_ERROR = 'error';
export const EVENT_NOW_PLAYING = 'nowPlaying';

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

      this.onError(device);
      // this.onNowPlaying(device);
      this.onDeviceUpdate(device);

      return device.openConnection(parse);
    } catch (error) {
      throw error;
    }
  }

  async deviceConnectedCount(device: AppleTV): Promise<number> {
    const { payload }: Message = await device.sendIntroduction();

    return payload.logicalDeviceCount;
  }

  private onError(device: AppleTV): void {
    device.on(EVENT_ERROR, (error: Error): void => {
      console.error(error.message);
      console.error(error.stack);
    });
  }

  private onNowPlaying(device: AppleTV): void {
    device.on(EVENT_NOW_PLAYING, (info: NowPlayingInfo): void => {
      console.log(info.toString());
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
