// In the main process.
const electron = require('electron')
const path = require('path');
const url = require('url');

const { app, BrowserWindow, globalShortcut, Tray, Menu } = electron;

var iconpath = path.join(__dirname, 'new.png')

let mainWindow;
var appIcon;

let isQuiting = false;

app.on('before-quit', function () {
    isQuiting = true;
});


app.on("ready", () => {
    trayMenuSetup();
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/ui/index.html`),
            protocol: "file:",
            slashes: true
          })
    );
    

    windowMenuSetup();

    registerGlobalShortCuts();
});

function windowMenuSetup() {
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
    });
}

function trayMenuSetup() {
    appIcon = new Tray(iconpath);

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

    appIcon.setContextMenu(contextMenu);
}
function registerGlobalShortCuts() {
    globalShortcut.register('CommandOrControl+T', () => {
        console.log('CommandOrControl+X is pressed')
    })
}