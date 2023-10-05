import { HostService, DeviceService, LayoutService } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    hostService: HostService;
    deviceService: DeviceService;
    layoutService: LayoutService;
  }
}

export {};
