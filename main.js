const electron = require('electron')
// Module to control application life.
const app = electron.app
const protocol = electron.protocol

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  // mainWindow.loadURL(`file://${__dirname}/index.html`)
  // mainWindow.loadURL('https://todomvc-express.gleb-demos.com/')
  const base = 'http://localhost:3000/'
  mainWindow.loadURL(base)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // protocol.registerStringProtocol('todo', (req, cb) => {
  //   const url = req.url
  //   console.log('todo url %s', url)
  //   cb('it works')
  // }, (err) => {
  //   if (!err) {
  //     console.log('registered todo protocol')
  //   } else {
  //     console.error('could not register todo protocol')
  //     console.error(err)
  //   }
  // })

  protocol.registerHttpProtocol('todo', (req, cb) => {
    const url = req.url
    const todoPath = url.substr(7)
    console.log('todo url %s path %s', url, todoPath)
    // cb({
    //   url: `${base}${todoPath}`,
    //   method: 'GET'
    // })
    mainWindow.loadURL(`${base}${todoPath}`)
  }, (err) => {
    if (!err) {
      console.log('registered todo protocol')
    } else {
      console.error('could not register todo protocol')
      console.error(err)
    }
  })

  // protocol.interceptHttpProtocol('todo', (req, cb) => {
  //   const url = req.url
  //   const todoPath = url.substr(7)
  //   console.log('intercepted todo url %s path %s', url, todoPath)
  //   cb({
  //     url: `${base}${todoPath}`,
  //     method: 'GET'
  //   })
  // }, (err) => {
  //   if (!err) {
  //     console.log('intercepted todo protocol fine')
  //   } else {
  //     console.error('could not intercept todo protocol')
  //     console.error(err)
  //   }
  // })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
