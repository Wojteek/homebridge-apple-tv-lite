import { AppleTV, Message, parseCredentials, scan, NowPlayingInfo } from 'appletv-node';
import { EventEmitter } from 'events';

export const EVENT_POWER_CHANGED = 'powerChanged';
export const EVENT_MESSAGE = 'message';
export const EVENT_ERROR = 'error';
export const EVENT_NOW_PLAYING = 'nowPlaying';

interface Config {
  updateStateFrequency: number;
}

export class AppleTv {
  readonly connection: Promise<AppleTV>;

  readonly event: EventEmitter;

  constructor(credentials: string, private readonly config: Config) {
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

      const connection = await device.openConnection(parse);

      this.updateInterval(connection);

      return connection;
    } catch (error) {
      throw error;
    }
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

  private updateInterval(device: AppleTV): void {
    setTimeout((): void => {
      device.sendIntroduction().then(({ payload }: Message) => {
        this.event.emit(EVENT_POWER_CHANGED, !!payload.logicalDeviceCount);
        this.updateInterval(device);
      });
    }, this.config.updateStateFrequency || 10000);
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
