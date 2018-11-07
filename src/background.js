// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, BrowserWindow, Tray, Menu } from "electron";
import { devMenuTemplate } from "./menu/dev_menu_template";
import { editMenuTemplate } from "./menu/edit_menu_template";
import createWindow from "./helpers/window";

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";

var iconpath = './resources/icons/whatsapp_tray.png';
const setApplicationMenu = () => {
  const menus = [editMenuTemplate];
  if (env.name !== "production") {
    menus.push(devMenuTemplate);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

app.on("ready", () => {
  setApplicationMenu();
  
  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    icon: iconpath
  });
  mainWindow.setMenu(null);
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app.html"),
      protocol: "file:",
      slashes: true
    })
  );

  var appIcon = new Tray(iconpath)

  var contextMenu = Menu.buildFromTemplate([
      {
          label: 'Show App', click: function () {
            mainWindow.show()
          }
      },
      {
          label: 'Quit', click: function () {
              app.isQuiting = true
              app.quit()
          }
      }
  ])

  appIcon.setContextMenu(contextMenu)

  mainWindow.on('close', function (event) {
      //mainWindow = null;
      app.quit();
  })

  mainWindow.on('minimize', function (event) {
      event.preventDefault()
      mainWindow.hide()
  })

  mainWindow.on('show', function () {
      appIcon.setHighlightMode('always')
  })

});

app.on("window-all-closed", () => {
  app.quit();
});
