// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),      
      nodeIntegration: true
    }
  })

  // Remove the menu bar in release version
  const isDev = require('electron-is-dev');
  if (!isDev) {
    Menu.setApplicationMenu(null)
  }

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.webContents.once("dom-ready", () => {
    // Check for updates
    check_updates()
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const ipc = require("electron").ipcMain;

ipc.on("api-request", async function(evt, arg){
  const is_reachable = require("is-reachable") 
  if (await is_reachable(arg)) {
    const {net} = require("electron"); 
    const request = net.request(arg)
    request.on('response', (response) => {
      var data = ""
      response.on('data', (chunk) => {
        data += chunk
      })
      response.on('end', () => {
        mainWindow.webContents.send("api-response", JSON.parse(data))
      })
    })
    request.end()
  }
})

async function check_updates() {
  const {net} = require("electron"); 
  const is_reachable = require("is-reachable") 

  if (await is_reachable("https://api.github.com/repos/Alaeron/CharacterSheet/releases")) {
    const request = net.request("https://api.github.com/repos/Alaeron/CharacterSheet/releases")
    request.on('response', (response) => {
      var data = ""
      response.on('data', (chunk) => {
        data += chunk
      })
      response.on('end', () => {
        data = JSON.parse(data)
        if (data[0].tag_name != "v" + app.getVersion()) {
          mainWindow.webContents.send("update-alert", data[0].tag_name )
        }
      })
    })
    request.end()
}
}