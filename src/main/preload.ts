import { IpcRendererEvent, ipcRenderer, contextBridge } from 'electron';
import { PanelGroupStorage } from 'react-resizable-panels';

import { MidiArray } from '@shared/midi-array';

import {
  DEVICES,
  OS,
  REMOVE,
  POWERON,
  POWEROFF,
  MSG,
  CONFIRM,
  GET_LAYOUT_ITEM,
  SET_LAYOUT_ITEM,
  GET_LAYOUT,
  SET_LAYOUT,
} from '../ipc-channels';
import { LayoutParams } from './store';

/**
 * Generic wrapper around ipcRenderer.on() and ipcRenderer.removeListener()
 *
 * @param channel The channel data is being received on
 * @param func The callback function to be invoked once data is received
 */
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
  onChange: (func: (deviceJSON: string) => void) => {
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

  sendMsg(deviceId: string, msg: MidiArray) {
    ipcRenderer.send(MSG, deviceId, msg);
  },

  onMsg(func: (deviceId: string, msg: NumberArrayWithStatus) => void) {
    return addOnChangeListener(MSG, func);
  },

  onConfirmation(func: (deviceId: string, msg: NumberArrayWithStatus) => void) {
    return addOnChangeListener(CONFIRM, func);
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

const layoutService = {
  getLayoutParams(): LayoutParams {
    return ipcRenderer.sendSync(GET_LAYOUT);
  },

  setLayoutParams(lp: LayoutParams): void {
    return ipcRenderer.sendSync(SET_LAYOUT, lp);
  },

  getItem(s: string): string | null {
    return ipcRenderer.sendSync(GET_LAYOUT_ITEM, s);
  },

  setItem(s: string, v: string): void {
    return ipcRenderer.sendSync(SET_LAYOUT_ITEM, s, v);
  },
};

contextBridge.exposeInMainWorld('layoutService', layoutService);
contextBridge.exposeInMainWorld('hostService', hostService);
contextBridge.exposeInMainWorld('deviceService', deviceService);

export type DeviceService = typeof deviceService;
export type HostService = typeof hostService;
export type LayoutService = typeof layoutService & PanelGroupStorage;
