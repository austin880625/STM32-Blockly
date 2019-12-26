const { app, BrowserWindow } = require("electron");
const path = require("path")
const { readFileSync } = require("fs");

let win;

function createWindow() {
  win = new BrowserWindow({
    height: 768,
    width: 1024,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile(path.join(__dirname, "../index.html"));
  win.on("closed", () => {
    win = null;
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