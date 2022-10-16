const electron = require ('electron');
const url = require('url');
const path = require('path'); 

const {app, BrowserWindow, Menu, ipcMain}= electron;

//SET ENVIRONMENT
process.env.NODE_ENV='production';

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function(){
    //Create new Window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
          }
    });
    //Load html into Window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,  'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //Quit app when closed
mainWindow.on('closed',function(){
    app.quit();
});
    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    //Insert Menu
    Menu.setApplicationMenu(mainMenu)
});

//Handle Create add Window
function createAddWindow(){
    //Create new Window
    addWindow = new BrowserWindow({
        width:300,
        height:200,
        title:'Add Shopping List Item',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
          }
    });
    //Load html into Window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname,  'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
//Garbage collection handle
    addWindow.on('close',function(){
addWindow=null;
    });
}
//catch item:add
ipcMain.on('item:add',function(e, item){
    mainWindow.webContents.send("item:add", item);
    addWindow.close();
});

//Create Menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label: 'Add item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: 'Ctrl+Q',
                click(){
                    app.quit()
                }
            }
        ]
    }
];

//If mac, add empty object to menu
if(process.platform=='darwin'){
    mainMenuTemplate.unshiftf({});
}

// Add developer tools item if not in prod
if(process.env.NODE_ENV !=='production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu:[
            {
                label:'Toggle DevTools',
                accelerator: process.platform=='darwin'?'Command+I':
                'Ctrl+I',
                click(item,focusdWindow){
                    focusdWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    });
}