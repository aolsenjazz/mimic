import { ipcMain, Event } from 'electron';
import os from 'os';

import { DRIVERS } from '@shared/drivers';
import { ConnectableDevice } from '@shared/connectable-device';
import { AdapterDevice } from '@shared/adapter-device';
import { create } from '@shared/midi-array';

import { VirtualPortServiceWrapper as VirtualPortService } from './virtual-port-service-wrapper';
import { windowService } from './window-service';

import { REMOVE, OS, POWERON, POWEROFF, MSG } from '../ipc-channels';

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
      this.reloadDevices();
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

    ipcMain.on(
      MSG,
      (_e: Event, deviceId: string, msg: NumberArrayWithStatus) => {
        this.portService.send(deviceId, create(msg));
      }
    );
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
      this.reloadDevices();

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

  reloadDevices() {
    windowService.sendDevices(Array.from(this.connectableDevices.values()));
  }
}
