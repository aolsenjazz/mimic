import { ipcMain, Event } from 'electron';
import os from 'os';

import { DRIVERS } from '@shared/drivers';

import { VirtualPortServiceWrapper as VirtualPortService } from './virtual-port-service-wrapper';
import { windowService } from './window-service';

import { ConnectableDevice } from '../connectable-device';
import { REMOVE, OS } from '../ipc-channels';

export class Background {
  portService: VirtualPortService;

  connectableDevices = new Map<string, ConnectableDevice>();

  constructor() {
    this.portService = new VirtualPortService();
    this.initIpc();
  }

  initIpc() {
    ipcMain.on(REMOVE, (_e: Event, id: string) => {
      this.removeDevice(id);
    });

    // When the frontend as for OS details, send them
    ipcMain.on(OS, (e: Event) => {
      e.returnValue = os.platform();
    });
  }

  addDevice(dName: string) {
    const d = DRIVERS.get(dName);

    if (d) {
      const sibIdx = this.portService.getFirstAvailableSiblingIdx(d.name);
      const cd = new ConnectableDevice(d, sibIdx);
      this.portService.addDevice(d);
      this.connectableDevices.set(cd.id!, cd);

      windowService.sendDevices(Array.from(this.connectableDevices.values()));
    } else {
      throw new Error(`no driver for ${dName}`);
    }
  }

  removeDevice(id: string) {
    this.portService.removeDevice(id);
    this.connectableDevices.delete(id);
    windowService.sendDevices(Array.from(this.connectableDevices.values()));
  }
}
