const electron = require('electron')
// Module to control application life.
const app = electron.app
const protocol = electron.protocol

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

console.log('process args', process.argv)

// http://electron.atom.io/docs/api/app/#appsetasdefaultprotocolclientprotocol-path-args-macos-windows
// app.setAsDefaultProtocolClient('todo')
// app.setAsDefaultProtocolClient('todos')

// app.removeAsDefaultProtocolClient('todo')
// app.removeAsDefaultProtocolClient('todos')

const base = 'http://localhost:3000/'
let initialUrl = ''
const PROTOCOL = 'todo2://'

function devToolsLog(s) {
  console.log(s)
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`console.log("${s}")`)
  }
}

function stripCustomProtocol(url) {
  if (!url) {
    return url
  }
  if (!url.startsWith(PROTOCOL)) {
    return url
  }
  const todoPath = url.substr(8)
  return todoPath
}

function formFullTodoUrl(todoPath) {
  return `${base}${todoPath}`
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  // mainWindow.loadURL(`file://${__dirname}/index.html`)
  // mainWindow.loadURL('https://todomvc-express.gleb-demos.com/')

  mainWindow.webContents.openDevTools()

  devToolsLog('process args ' + process.argv.join(','))
  devToolsLog('initial url? ' + initialUrl)
  const openUrl = initialUrl || process.argv[1]
  const firstUrl = openUrl ? formFullTodoUrl(openUrl) : base
  devToolsLog('opening ' + firstUrl)

  mainWindow.loadURL(firstUrl)

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
    const todoPath = stripCustomProtocol(url)
    const msg = `todo url ${url} path ${todoPath}`
    devToolsLog(msg)

    // cb({
    //   url: `${base}${todoPath}`,
    //   method: 'GET'
    // })
    const fullUrl = formFullTodoUrl(todoPath)
    devToolsLog('full url to open ' + fullUrl)
    mainWindow.loadURL(fullUrl)
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

app.on('open-url', function (e, url) {
  console.log('open-url', url)
  if (url.startsWith('/')) {
    url = url.substr(1)
  }
  initialUrl = stripCustomProtocol(url)
  devToolsLog('setting initial url to ' + initialUrl)
  // e.preventDefault()
  if (mainWindow) {
    // we are already running!
    const fullUrl = formFullTodoUrl(initialUrl)
    devToolsLog('full url to open ' + fullUrl)
    mainWindow.loadURL(fullUrl)
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
