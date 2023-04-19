/* eslint max-classes-per-file: 0 */
import { VirtualInput } from '@sc/main/port-service/virtual-input';
import { VirtualOutput } from '@sc/main/port-service/virtual-output';
import { VirtualPortService } from '@sc/main/port-service/virtual-port-service';
import { DeviceDriver } from '@shared/driver-types';
import { PortPair } from '@sc/main/port-service/port-pair';

import { windowService } from './window-service';

// Shim VirtualInput to use only device name as display name
class VirtualInputShim extends VirtualInput {
  get displayName() {
    return this.name;
  }
}

// Shim VirtualOutput to use only device name as display name
class VirtualOutputShim extends VirtualOutput {
  get displayName() {
    return this.name;
  }
}

// Shim VirtualPortService to use the VirtualInputShim and VirtualOutputShim
class VirtualPortServiceShim extends VirtualPortService {
  // open the virtual port, but uses the shims
  open(deviceName: string, siblingIndex: number) {
    const id = `${deviceName} ${siblingIndex}`;

    const iPort = new VirtualInputShim(siblingIndex, deviceName);
    const oPort = new VirtualOutputShim(siblingIndex, deviceName);
    const portPair = new PortPair(iPort, oPort);

    portPair.open();
    portPair.onMessage((_delta, msg) => {
      windowService.sendMsg(id, msg);
    });

    this.ports.set(id, portPair);
  }
}

export class VirtualPortServiceWrapper {
  protected portService: VirtualPortService;

  constructor() {
    this.portService = new VirtualPortServiceShim();
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
