import { BrowserWindow } from 'electron';

import { ConnectableDevice } from '@shared/connectable-device';
import { stringify } from '@shared/util';
import { DEVICES, MSG } from '../ipc-channels';

class WindowService {
  sendDevices(devices: ConnectableDevice[]) {
    this.#send(DEVICES, stringify(devices));
  }

  sendMsg(id: string, msg: MidiTuple) {
    this.#send(MSG, id, msg);
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
