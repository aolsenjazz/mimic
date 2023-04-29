import path from 'path';
import { app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
} from 'electron-extension-installer';
import log from 'electron-log';
import os from 'os';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { Background } from './background';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

  return (
    installer
      .default([], forceDownload)
      // eslint-disable-next-line no-console
      .catch(console.log)
  );
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 600,
    transparent: true,
    frame: false,
    titleBarStyle: 'hiddenInset',
    minHeight: 312,
    minWidth: 850,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      contextIsolation: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const background = new Background();
  const menuBuilder = new MenuBuilder(mainWindow, background);
  menuBuilder.buildMenu();

  // eslint-disable-next-line no-new
  new AppUpdater();
};

// this isn't how extensions should really be loaded
// see https://github.com/electron/electron/issues/37876 for more
app.on('ready', async () => {
  await installExtension(REACT_DEVELOPER_TOOLS, {
    loadExtensionOptions: {
      allowFileAccess: true,
    },
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    return app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  // eslint-disable-next-line no-console
  .catch(console.log);
