const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  dialog,
  powerSaveBlocker,
  nativeTheme,
} = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const Store = require("electron-store");
const store = new Store();
const fs = require("fs");
const configDir = app.getPath("userData");
const { ra } = require("./edge-tts");
const dirPath = path.join(configDir, "uploads");
let mainWin;
const singleInstance = app.requestSingleInstanceLock();
var filePath = null;
if (process.platform != "darwin" && process.argv.length >= 2) {
  filePath = process.argv[1];
}
let options = {
  width: 1050,
  height: 660,
  backgroundColor: "#fff",
  webPreferences: {
    webSecurity: false,
    nodeIntegration: true,
    contextIsolation: false,
    nativeWindowOpen: true,
    nodeIntegrationInSubFrames: true,
    allowRunningInsecureContent: true,
    enableRemoteModule: true,
  },
};

// Single Instance Lock
if (!singleInstance) {
  app.quit();
  if (filePath) {
    fs.writeFileSync(
      path.join(dirPath, "log.json"),
      JSON.stringify({ filePath }),
      "utf-8"
    );
  }
} else {
  app.on("second-instance", (event, argv, workingDir) => {
    if (mainWin) {
      if (!mainWin.isVisible()) mainWin.show();
      mainWin.focus();
    }
  });
}
const createMainWin = () => {
  mainWin = new BrowserWindow(options);

  if (!isDev) {
    Menu.setApplicationMenu(null);
  }
  const urlLocation = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "./build/index.html")}`;
  mainWin.loadURL(urlLocation);

  mainWin.on("close", () => {
    mainWin = null;
  });
  ipcMain.handle("open-book", (event, config) => {
    let { url, isMergeWord, isFullscreen, isPreventSleep } = config;
    options.webPreferences.nodeIntegrationInSubFrames = true;
    store.set({
      url,
      isMergeWord: isMergeWord ? isMergeWord : "no",
      isFullscreen: isFullscreen ? isFullscreen : "no",
      isPreventSleep: isPreventSleep ? isPreventSleep : "no",
    });
    let id;
    if (isPreventSleep === "yes") {
      id = powerSaveBlocker.start("prevent-display-sleep");
      console.log(powerSaveBlocker.isStarted(id));
    }

    if (isFullscreen === "yes") {
      readerWindow = new BrowserWindow(options);
      readerWindow.loadURL(url);
      readerWindow.maximize();
    } else {
      readerWindow = new BrowserWindow({
        ...options,
        width: parseInt(store.get("windowWidth") || 1050),
        height: parseInt(store.get("windowHeight") || 660),
        x: parseInt(store.get("windowX")),
        y: parseInt(store.get("windowY")),
        frame: isMergeWord === "yes" ? false : true,
        hasShadow: isMergeWord === "yes" ? false : true,
        transparent: isMergeWord === "yes" ? true : false,
      });
      readerWindow.loadURL(url);
    }
    readerWindow.on("close", (event) => {
      if (!readerWindow.isDestroyed()) {
        let bounds = readerWindow.getBounds();
        store.set({
          windowWidth: bounds.width,
          windowHeight: bounds.height,
          windowX: bounds.x,
          windowY: bounds.y,
        });
      }
      if (isPreventSleep && !readerWindow.isDestroyed()) {
        id && powerSaveBlocker.stop(id);
      }
      // readerWindow && readerWindow.destroy();
      // readerWindow = null;
    });

    event.returnValue = "success";
  });
  ipcMain.handle("edge-tts", async (event, config) => {
    console.log(dirPath);
    let { text } = config;
    let audioName = new Date().getTime() + ".webm";
    if (!fs.existsSync(path.join(dirPath, "tts"))) {
      fs.mkdirSync(path.join(dirPath, "tts"));
      fs.writeFileSync(path.join(dirPath, "tts", audioName), await ra(text));
      console.log("文件夹创建成功");
    } else {
      fs.writeFileSync(path.join(dirPath, "tts", audioName), await ra(text));
      console.log("文件夹已存在");
    }

    return path.join(dirPath, "tts", audioName);
  });
  ipcMain.handle("clear-tts", async (event, config) => {
    if (!fs.existsSync(path.join(dirPath, "tts"))) {
      return "pong";
    } else {
      const fsExtra = require("fs-extra");
      try {
        await fsExtra.remove(path.join(dirPath, "tts"));
        await fsExtra.mkdir(path.join(dirPath, "tts"));
        console.log("success!");
        return "pong";
      } catch (err) {
        console.error(err);
        return "pong";
      }
    }
  });
  ipcMain.handle("change-path", async (event) => {
    var path = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    return path;
  });
  ipcMain.handle("get-url-content", async (event, config) => {
    const axios = require("axios");
    try {
      const response = await axios.get(config.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  });
  ipcMain.on("storage-location", (event, arg) => {
    event.returnValue = path.join(dirPath, "data");
  });
  ipcMain.on("user-data", (event, arg) => {
    event.returnValue = dirPath;
  });
  ipcMain.handle("hide-reader", (event, arg) => {
    if (readerWindow && readerWindow.isFocused()) {
      readerWindow.minimize();
      event.returnvalue = true;
    } else if (mainWin && mainWin.isFocused()) {
      mainWin.minimize();
      event.returnvalue = true;
    } else {
      event.returnvalue = false;
    }
  });
  ipcMain.handle("open-console", (event, arg) => {
    mainWin.webContents.openDevTools();
    event.returnvalue = true;
  });
  ipcMain.handle("reload-reader", (event, arg) => {
    if (readerWindow) {
      readerWindow.reload();
    }
  });
  ipcMain.handle("reload-main", (event, arg) => {
    if (mainWin) {
      mainWin.reload();
    }
  });
  ipcMain.handle("focus-on-main", (event, arg) => {
    if (mainWin) {
      if (!mainWin.isVisible()) mainWin.show();
      mainWin.focus();
    }
  });
  ipcMain.handle("create-new-main", (event, arg) => {
    if (!mainWin) {
      createMainWin();
    }
  });
  ipcMain.handle("enter-fullscreen", () => {
    if (readerWindow) {
      readerWindow.setFullScreen(true);
      console.log("enter full");
    }
  });
  ipcMain.handle("exit-fullscreen", () => {
    if (readerWindow) {
      readerWindow.setFullScreen(false);
      console.log("exit full");
    }
  });
  ipcMain.handle("switch-moyu", (event, arg) => {
    let id;
    if (store.get("isPreventSleep") === "yes") {
      id = powerSaveBlocker.start("prevent-display-sleep");
      console.log(powerSaveBlocker.isStarted(id));
    }
    if (readerWindow) {
      readerWindow.close();
      Object.assign(options, {
        width: parseInt(store.get("windowWidth") || 1050),
        height: parseInt(store.get("windowHeight") || 660),
        x: parseInt(store.get("windowX")),
        y: parseInt(store.get("windowY")),
        frame: store.get("isMergeWord") !== "yes" ? false : true,
        hasShadow: store.get("isMergeWord") !== "yes" ? false : true,
        transparent: store.get("isMergeWord") !== "yes" ? true : false,
      });
      options.webPreferences.nodeIntegrationInSubFrames = true;

      store.set(
        "isMergeWord",
        store.get("isMergeWord") !== "yes" ? "yes" : "no"
      );
      readerWindow = new BrowserWindow(options);
      readerWindow.loadURL(store.get("url"));
      readerWindow.on("close", (event) => {
        if (!readerWindow.isDestroyed()) {
          let bounds = readerWindow.getBounds();
          store.set({
            windowWidth: bounds.width,
            windowHeight: bounds.height,
            windowX: bounds.x,
            windowY: bounds.y,
          });
        }
        if (store.get("isPreventSleep") && !readerWindow.isDestroyed()) {
          id && powerSaveBlocker.stop(id);
        }
        // readerWindow && readerWindow.destroy();
        // readerWindow = null;
      });
    }
    event.returnvalue = false;
  });
  ipcMain.on("get-dirname", (event, arg) => {
    event.returnValue = __dirname;
  });
  ipcMain.on("system-color", (event, arg) => {
    event.returnValue = nativeTheme.shouldUseDarkColors || false;
  });
  ipcMain.on("check-main-open", (event, arg) => {
    event.returnValue = mainWin ? true : false;
  });
  ipcMain.on("get-file-data", function (event) {
    if (fs.existsSync(path.join(dirPath, "log.json"))) {
      const _data = JSON.parse(
        fs.readFileSync(path.join(dirPath, "log.json"), "utf-8") || "{}"
      );
      if (_data && _data.filePath) {
        filePath = _data.filePath;
        fs.writeFileSync(path.join(dirPath, "log.json"), "", "utf-8");
      }
    }

    event.returnValue = filePath;
    filePath = null;
  });
};
app.on("ready", () => {
  createMainWin();
});
app.on("window-all-closed", () => {
  app.quit();
});
app.on("open-file", (e, pathToFile) => {
  filePath = pathToFile;
});
