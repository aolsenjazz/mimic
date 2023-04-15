import { ipcMain, Event } from 'electron';
import os from 'os';

import { DRIVERS } from '@shared/drivers';

import { VirtualPortServiceWrapper as VirtualPortService } from './virtual-port-service-wrapper';
import { windowService } from './window-service';

import { ConnectableDevice } from '../connectable-device';
import { AdapterDevice } from '../adapter-device';
import { REMOVE, OS, POWERON, POWEROFF } from '../ipc-channels';

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

    ipcMain.on(POWERON, (_e: Event, id: string) => {
      const dev = this.connectableDevices.get(id);

      if (dev) {
        this.portService.addDevice(dev);
      } else {
        throw new Error(`no device found for id ${id}`);
      }
    });

    ipcMain.on(POWEROFF, (_e: Event, id: string) => {
      this.portService.removeDevice(id);
    });
  }

  addDevice(dName: string) {
    const d = DRIVERS.get(dName);

    if (d) {
      const sibIdx = this.portService.getFirstAvailableSiblingIdx(d.name);
      const cd =
        d.type === 'adapter'
          ? new AdapterDevice(d, sibIdx)
          : new ConnectableDevice(d, sibIdx);

      this.connectableDevices.set(cd.id!, cd);
      windowService.sendDevices(Array.from(this.connectableDevices.values()));

      // this is weird, but by adding a delay to opening the virtual port, we ensure that 100%
      // computational resources go to reflecting the user action in the frontend, making it
      // *feel* faster
      setTimeout(() => {
        this.portService.addDevice(d);
      }, 500);
    } else {
      throw new Error(`no driver for ${dName}`);
    }
  }

  removeDevice(id: string) {
    this.portService.removeDevice(id);
    this.connectableDevices.delete(id);
  }
}
