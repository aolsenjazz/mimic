import { BrowserWindow } from 'electron';

import { ConnectableDevice } from '../connectable-device';
import { DEVICES } from '../ipc-channels';

class WindowService {
  sendDevices(devices: ConnectableDevice[]) {
    this.#send(DEVICES, devices);
  }

  /**
   * Send objects to the frontend
   *
   * @param channel The IPC channel on which to send
   * @param args The objects to send
   */
  /* eslint-disable-next-line */
  #send = (channel: string, ...args: any[]) => {
    const windows = BrowserWindow.getAllWindows();
    const window = windows.length ? windows[0] : null;

    if (window !== null) {
      window.webContents.send(channel, ...args);
    }
  };
}

export const windowService = new WindowService();
