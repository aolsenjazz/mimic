import { VirtualPortService } from '@sc/main/port-service/virtual-port-service';
import { DeviceDriver } from '@shared/driver-types';

export class VirtualPortServiceWrapper {
  protected portService: VirtualPortService;

  constructor() {
    this.portService = new VirtualPortService();
  }

  addDevice(driver: DeviceDriver) {
    const siblingIdx = this.getFirstAvailableSiblingIdx(driver.name);
    this.portService.open(driver.name, siblingIdx);
    return `${driver.name} ${siblingIdx}`;
  }

  removeDevice(id: string) {
    this.portService.close(id);
  }

  getFirstAvailableSiblingIdx(name: string) {
    let idx = 0;
    const portArray = Array.from(this.portService.ports.values());

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const matchingPortsAtIndex = portArray.filter(
        // eslint-disable-next-line no-loop-func
        (pp) => pp.siblingIndex === idx && pp.name === name
      );
      if (matchingPortsAtIndex.length === 0) return idx;

      idx++;
    }
  }
}
