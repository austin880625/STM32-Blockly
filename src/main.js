const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path")
const { spawnSync } = require("child_process");
const { readFileSync } = require("fs");

let win;

function createWindow() {
  win = new BrowserWindow({
    height: 768 / 3,
    width: 1024,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile(path.join(__dirname, "../index.html"));
  win.on("closed", () => {
    win = null;
  });

  ipcMain.on('dev-list-update', function(e) {
    let result = spawnSync("sh", ["-c","ls /dev/ | grep ttyUSB"]); 
    console.log('command result: ', result.stdout.toString('utf-8'));
    let devList = result.stdout.toString('utf-8').trim().split('\n');
    console.log(devList);
    e.reply('dev-list-update', {
    list: devList
    });
  });

  ipcMain.on('run-command', function(e, arg) {
    let timeout = (arg[1] == "4" ? undefined : 10000);
    let result = spawnSync("./pc.out", arg, {timeout: timeout, stdio: ["pipe", "pipe", process.stderr]});
    e.reply('command-reply', {
      command: arg[1],
      value: result.stdout.toString('utf-8')
    })
  });
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.type !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
})