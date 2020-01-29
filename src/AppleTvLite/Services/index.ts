import { Services } from './Services';
import { AppleTVControlSwitchService } from './AppleTVControlSwitchService';
import { AccessoryInformationService } from './AccessoryInformationService';
import { ServiceParameters} from './ServiceInterface';

export default function (params: ServiceParameters): Services {
  return new Services([
    AppleTVControlSwitchService,
    AccessoryInformationService,
  ], params);
};
