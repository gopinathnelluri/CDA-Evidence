// In the main process.
const electron = require('electron')
const path = require('path');
const url = require('url');

const { app, BrowserWindow, globalShortcut, Tray, Menu } = electron;

var iconpath = path.join(__dirname, 'new.png')

let mainWindow;

let isQuiting = false;

app.on('before-quit', function () {
    isQuiting = true;
});


app.on("ready", () => {
    var appIcon = new Tray(iconpath)

    mainWindow = new BrowserWindow({});
    mainWindow.loadURL("https://google.com");

    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App', click: function () {
                mainWindow.show()
            }
        },
        {
            label: 'Quit', click: function () {
                app.isQuiting = true
                app.quit();
            }
        }
    ])

    appIcon.setContextMenu(contextMenu)

    mainWindow.on('close', function (event) {
        if (!isQuiting) {
            event.preventDefault();
            mainWindow.hide();
            event.returnValue = false;
        }
    })

    mainWindow.on('minimize', function (event) {
        event.preventDefault()
        mainWindow.minimize();
    })

    mainWindow.on('show', function () {
        appIcon.setHighlightMode('always')
    })

    registerGlobalShortCuts();
});

function registerGlobalShortCuts() {
    globalShortcut.register('CommandOrControl+X', () => {
        console.log('CommandOrControl+X is pressed')
    })
}