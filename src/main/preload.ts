import { IpcRendererEvent, ipcRenderer, contextBridge } from 'electron';

import { ConnectableDevice } from '../connectable-device';

import { DEVICES, OS, REMOVE, POWERON, POWEROFF } from '../ipc-channels';

/**
 * Generic wrapper around ipcRenderer.on() and ipcRenderer.removeListener()
 *
 * @param channel The channel data is being received on
 * @param func The callback function to be invoked once data is received
 */
// eslint-disable-next-line no-unused-vars
function addOnChangeListener(channel: string, func: (...args: any[]) => void) {
  const subscription = (_event: IpcRendererEvent, ...args: any[]) => {
    func(...args);
  };
  ipcRenderer.on(channel, subscription);
  return () => {
    ipcRenderer.removeListener(channel, subscription);
  };
}

const deviceService = {
  /**
   * Registers a callback to be invoked whenever the list of devices changes
   *
   * @param func The callback to be invoked
   */
  // eslint-disable-next-line no-unused-vars
  onChange: (func: (devices: ConnectableDevice[]) => void) => {
    return addOnChangeListener(DEVICES, func);
  },

  remove: (deviceId: string) => {
    ipcRenderer.send(REMOVE, deviceId);
  },

  powerOn: (deviceId: string) => {
    ipcRenderer.send(POWERON, deviceId);
  },

  powerOff: (deviceId: string) => {
    ipcRenderer.send(POWEROFF, deviceId);
  },
};

/**
 * Expose data re. the host (usually the OS + hardware) to the renderer process
 */
const hostService = {
  /**
   * Returns a string representation of the current operating system
   */
  getHost: () => {
    return ipcRenderer.sendSync(OS);
  },
};

contextBridge.exposeInMainWorld('hostService', hostService);
contextBridge.exposeInMainWorld('deviceService', deviceService);

export type DeviceService = typeof deviceService;
export type HostService = typeof hostService;
